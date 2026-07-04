
-- ============ Extensões em transactions para rastreio ============
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS origin_transaction_id uuid REFERENCES public.transactions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS origin_invoice_id uuid REFERENCES public.credit_card_invoices(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_tx_origin_tx ON public.transactions(origin_transaction_id);
CREATE INDEX IF NOT EXISTS idx_tx_origin_invoice ON public.transactions(origin_invoice_id);

-- ============ Fase 4: status calculado ============
CREATE OR REPLACE FUNCTION public.installment_status(
  _paid_at timestamptz,
  _due_date date,
  _ref_month date DEFAULT CURRENT_DATE
) RETURNS text
LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE
    WHEN _paid_at IS NOT NULL THEN 'paga'
    WHEN _due_date < CURRENT_DATE THEN 'atrasada'
    WHEN date_trunc('month', _due_date) = date_trunc('month', _ref_month) THEN 'a_vencer'
    ELSE 'futura'
  END
$$;

-- ============ Fase 6: ciclo de vida automático da fatura ============
CREATE OR REPLACE FUNCTION public.atualizar_ciclo_faturas() RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.credit_card_invoices
    SET status = 'aberta', updated_at = now()
    WHERE status = 'futura' AND CURRENT_DATE >= reference_month;
  UPDATE public.credit_card_invoices
    SET status = 'fechada', updated_at = now()
    WHERE status = 'aberta' AND CURRENT_DATE > closing_date;
END $$;
REVOKE ALL ON FUNCTION public.atualizar_ciclo_faturas() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.atualizar_ciclo_faturas() TO authenticated;

-- ============ Fase 3: materialização de parcelas ============
CREATE OR REPLACE FUNCTION public.criar_compra_parcelada(
  _description text,
  _amount_total numeric,
  _installments int,
  _first_due_date date,
  _category text,
  _credit_card_id uuid DEFAULT NULL,
  _account_id uuid DEFAULT NULL,
  _person_id uuid DEFAULT NULL,
  _envelope_id uuid DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user uuid := auth.uid();
  v_group uuid := gen_random_uuid();
  v_parcela numeric;
  v_ult numeric;
  v_due date;
  v_ref_month date;
  v_invoice uuid;
  i int;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  IF _installments < 1 THEN RAISE EXCEPTION 'installments must be >= 1'; END IF;
  IF _amount_total <= 0 THEN RAISE EXCEPTION 'amount must be positive'; END IF;

  -- Arredondamento: N-1 parcelas iguais, última absorve a diferença
  v_parcela := round(_amount_total / _installments, 2);
  v_ult := _amount_total - (v_parcela * (_installments - 1));

  FOR i IN 1.._installments LOOP
    v_due := (_first_due_date + ((i - 1) * INTERVAL '1 month'))::date;
    v_invoice := NULL;
    IF _credit_card_id IS NOT NULL THEN
      v_ref_month := date_trunc('month', v_due)::date;
      v_invoice := public.get_or_create_invoice(_credit_card_id, v_ref_month);
    END IF;

    INSERT INTO public.transactions (
      user_id, account_id, amount, type, category, description,
      date, due_date, status, is_fixed,
      credit_card_id, invoice_id, purchase_group_id,
      installment_number, installment_total, person_id, envelope_id
    ) VALUES (
      v_user,
      CASE WHEN _credit_card_id IS NULL THEN _account_id ELSE NULL END,
      CASE WHEN i = _installments THEN v_ult ELSE v_parcela END,
      'despesa', _category,
      _description || ' (' || i || '/' || _installments || ')',
      v_due, v_due,
      'pendente', false,
      _credit_card_id, v_invoice, v_group,
      i, _installments, _person_id, _envelope_id
    );
  END LOOP;

  RETURN v_group;
END $$;
REVOKE ALL ON FUNCTION public.criar_compra_parcelada(text,numeric,int,date,text,uuid,uuid,uuid,uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.criar_compra_parcelada(text,numeric,int,date,text,uuid,uuid,uuid,uuid) TO authenticated;

-- ============ Fase 7.1: pagar_parcela ============
CREATE OR REPLACE FUNCTION public.pagar_parcela(_tx_id uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user uuid;
  v_amount numeric;
  v_credit_card uuid;
  v_pay_account uuid;
  v_desc text;
  v_paid timestamptz;
BEGIN
  SELECT user_id, amount, credit_card_id, description, paid_at
    INTO v_user, v_amount, v_credit_card, v_desc, v_paid
    FROM public.transactions WHERE id = _tx_id;

  IF v_user IS NULL OR v_user <> auth.uid() THEN RAISE EXCEPTION 'not authorized'; END IF;
  IF v_paid IS NOT NULL THEN RETURN; END IF;

  UPDATE public.transactions
    SET paid_at = now(), status = 'pago', updated_at = now()
    WHERE id = _tx_id;

  -- Se é parcela de cartão: gera débito único na conta de pagamento
  IF v_credit_card IS NOT NULL THEN
    SELECT payment_account_id INTO v_pay_account
      FROM public.credit_cards WHERE id = v_credit_card;
    IF v_pay_account IS NOT NULL THEN
      INSERT INTO public.transactions (
        user_id, account_id, amount, type, category, description,
        date, due_date, status, is_fixed, paid_at, origin_transaction_id
      ) VALUES (
        v_user, v_pay_account, v_amount, 'despesa', 'contas',
        'Pgto parcela: ' || v_desc,
        CURRENT_DATE, CURRENT_DATE, 'pago', false, now(), _tx_id
      );
    END IF;
  END IF;
END $$;
REVOKE ALL ON FUNCTION public.pagar_parcela(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.pagar_parcela(uuid) TO authenticated;

-- ============ Fase 7.1b: estornar_parcela ============
CREATE OR REPLACE FUNCTION public.estornar_parcela(_tx_id uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_user uuid;
BEGIN
  SELECT user_id INTO v_user FROM public.transactions WHERE id = _tx_id;
  IF v_user IS NULL OR v_user <> auth.uid() THEN RAISE EXCEPTION 'not authorized'; END IF;

  -- Apaga qualquer débito automático gerado por essa parcela
  DELETE FROM public.transactions
    WHERE origin_transaction_id = _tx_id AND user_id = v_user;

  UPDATE public.transactions
    SET paid_at = NULL, status = 'pendente', updated_at = now()
    WHERE id = _tx_id;
END $$;
REVOKE ALL ON FUNCTION public.estornar_parcela(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.estornar_parcela(uuid) TO authenticated;

-- ============ Fase 7.2: adiantar_parcelas ============
CREATE OR REPLACE FUNCTION public.adiantar_parcelas(_tx_ids uuid[]) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user uuid := auth.uid();
  v_total numeric;
  v_credit_card uuid;
  v_pay_account uuid;
  v_new_id uuid;
  v_distinct_cards int;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;

  -- Todas do mesmo dono
  IF EXISTS (SELECT 1 FROM public.transactions
             WHERE id = ANY(_tx_ids) AND user_id <> v_user) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  -- Todas do mesmo cartão (ou nenhuma sem cartão misturada)
  SELECT COUNT(DISTINCT credit_card_id) INTO v_distinct_cards
    FROM public.transactions WHERE id = ANY(_tx_ids);
  IF v_distinct_cards <> 1 THEN
    RAISE EXCEPTION 'todas as parcelas devem pertencer ao mesmo cartão';
  END IF;

  SELECT credit_card_id, SUM(amount) INTO v_credit_card, v_total
    FROM public.transactions
    WHERE id = ANY(_tx_ids) AND paid_at IS NULL
    GROUP BY credit_card_id;

  IF v_credit_card IS NULL THEN RAISE EXCEPTION 'nenhuma parcela pendente'; END IF;

  SELECT payment_account_id INTO v_pay_account
    FROM public.credit_cards WHERE id = v_credit_card AND user_id = v_user;

  UPDATE public.transactions
    SET paid_at = now(), status = 'pago', updated_at = now()
    WHERE id = ANY(_tx_ids) AND paid_at IS NULL;

  INSERT INTO public.transactions (
    user_id, account_id, amount, type, category, description,
    date, due_date, status, is_fixed, paid_at
  ) VALUES (
    v_user, v_pay_account, v_total, 'despesa', 'contas',
    'Adiantamento de parcelas',
    CURRENT_DATE, CURRENT_DATE, 'pago', false, now()
  ) RETURNING id INTO v_new_id;

  RETURN v_new_id;
END $$;
REVOKE ALL ON FUNCTION public.adiantar_parcelas(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.adiantar_parcelas(uuid[]) TO authenticated;

-- ============ Fase 7.3: encerrar_parcelamento ============
CREATE OR REPLACE FUNCTION public.encerrar_parcelamento(
  _group_id uuid,
  _modo text,
  _custom_amount numeric DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user uuid := auth.uid();
  v_total numeric;
  v_credit_card uuid;
  v_pay_account uuid;
  v_account uuid;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  IF _modo NOT IN ('quitar','cancelar') THEN
    RAISE EXCEPTION 'modo inválido (use quitar ou cancelar)';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.transactions
                 WHERE purchase_group_id = _group_id AND user_id = v_user) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  IF _modo = 'cancelar' THEN
    DELETE FROM public.transactions
      WHERE purchase_group_id = _group_id
        AND user_id = v_user
        AND paid_at IS NULL;
    RETURN;
  END IF;

  -- quitar: pega totais das não pagas
  SELECT SUM(amount), MAX(credit_card_id), MAX(account_id)
    INTO v_total, v_credit_card, v_account
    FROM public.transactions
    WHERE purchase_group_id = _group_id
      AND user_id = v_user
      AND paid_at IS NULL;

  IF v_total IS NULL OR v_total = 0 THEN RETURN; END IF;
  IF _custom_amount IS NOT NULL THEN v_total := _custom_amount; END IF;

  IF v_credit_card IS NOT NULL THEN
    SELECT payment_account_id INTO v_pay_account
      FROM public.credit_cards WHERE id = v_credit_card;
    v_account := v_pay_account;
  END IF;

  UPDATE public.transactions
    SET paid_at = now(), status = 'pago', updated_at = now()
    WHERE purchase_group_id = _group_id
      AND user_id = v_user
      AND paid_at IS NULL;

  INSERT INTO public.transactions (
    user_id, account_id, amount, type, category, description,
    date, due_date, status, is_fixed, paid_at
  ) VALUES (
    v_user, v_account, v_total, 'despesa', 'contas',
    'Quitação de parcelamento',
    CURRENT_DATE, CURRENT_DATE, 'pago', false, now()
  );
END $$;
REVOKE ALL ON FUNCTION public.encerrar_parcelamento(uuid,text,numeric) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.encerrar_parcelamento(uuid,text,numeric) TO authenticated;

-- ============ Fase 7.4: pagar_fatura (UMA transação de débito) ============
CREATE OR REPLACE FUNCTION public.pagar_fatura(_invoice_id uuid) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user uuid := auth.uid();
  v_credit_card uuid;
  v_pay_account uuid;
  v_total numeric;
  v_ref date;
  v_new_id uuid;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;

  SELECT i.credit_card_id, i.reference_month, cc.payment_account_id
    INTO v_credit_card, v_ref, v_pay_account
    FROM public.credit_card_invoices i
    JOIN public.credit_cards cc ON cc.id = i.credit_card_id
    WHERE i.id = _invoice_id AND cc.user_id = v_user;

  IF v_credit_card IS NULL THEN RAISE EXCEPTION 'not authorized'; END IF;
  IF v_pay_account IS NULL THEN RAISE EXCEPTION 'cartão sem conta de pagamento'; END IF;

  SELECT COALESCE(SUM(amount), 0) INTO v_total
    FROM public.transactions
    WHERE invoice_id = _invoice_id AND user_id = v_user;

  IF v_total = 0 THEN RAISE EXCEPTION 'fatura vazia'; END IF;

  -- Marca todas as parcelas da fatura como pagas
  UPDATE public.transactions
    SET paid_at = now(), status = 'pago', updated_at = now()
    WHERE invoice_id = _invoice_id AND user_id = v_user AND paid_at IS NULL;

  -- UMA única transação de débito
  INSERT INTO public.transactions (
    user_id, account_id, amount, type, category, description,
    date, due_date, status, is_fixed, paid_at, origin_invoice_id
  ) VALUES (
    v_user, v_pay_account, v_total, 'despesa', 'contas',
    'Pagamento de fatura ' || to_char(v_ref, 'MM/YYYY'),
    CURRENT_DATE, CURRENT_DATE, 'pago', false, now(), _invoice_id
  ) RETURNING id INTO v_new_id;

  UPDATE public.credit_card_invoices
    SET status = 'paga', paid_at = now(), updated_at = now()
    WHERE id = _invoice_id;

  RETURN v_new_id;
END $$;
REVOKE ALL ON FUNCTION public.pagar_fatura(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.pagar_fatura(uuid) TO authenticated;

-- ============ Fase 7.5: estornar_fatura ============
CREATE OR REPLACE FUNCTION public.estornar_fatura(_invoice_id uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_user uuid := auth.uid();
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.credit_card_invoices i
    JOIN public.credit_cards cc ON cc.id = i.credit_card_id
    WHERE i.id = _invoice_id AND cc.user_id = v_user
  ) THEN RAISE EXCEPTION 'not authorized'; END IF;

  -- Remove o débito único gerado por pagar_fatura
  DELETE FROM public.transactions
    WHERE origin_invoice_id = _invoice_id AND user_id = v_user;

  -- Reverte as parcelas
  UPDATE public.transactions
    SET paid_at = NULL, status = 'pendente', updated_at = now()
    WHERE invoice_id = _invoice_id AND user_id = v_user;

  UPDATE public.credit_card_invoices
    SET status = 'fechada', paid_at = NULL, updated_at = now()
    WHERE id = _invoice_id;
END $$;
REVOKE ALL ON FUNCTION public.estornar_fatura(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.estornar_fatura(uuid) TO authenticated;
