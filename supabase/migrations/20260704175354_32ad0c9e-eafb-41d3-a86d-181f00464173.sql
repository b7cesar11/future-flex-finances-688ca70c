CREATE OR REPLACE FUNCTION public.pagar_parcela(_tx_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user uuid;
  v_amount numeric;
  v_credit_card uuid;
  v_pay_account uuid;
  v_desc text;
  v_paid timestamptz;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;

  SELECT user_id, amount, credit_card_id, description, paid_at
    INTO v_user, v_amount, v_credit_card, v_desc, v_paid
    FROM public.transactions WHERE id = _tx_id;

  IF v_user IS NULL OR v_user IS DISTINCT FROM auth.uid() THEN RAISE EXCEPTION 'not authorized'; END IF;
  IF v_paid IS NOT NULL THEN RETURN; END IF;

  UPDATE public.transactions
    SET paid_at = now(), status = 'pago', updated_at = now()
    WHERE id = _tx_id;

  IF v_credit_card IS NOT NULL THEN
    SELECT payment_account_id INTO v_pay_account
      FROM public.credit_cards WHERE id = v_credit_card AND user_id = v_user;
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
END $function$;

CREATE OR REPLACE FUNCTION public.estornar_parcela(_tx_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE v_user uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;

  SELECT user_id INTO v_user FROM public.transactions WHERE id = _tx_id;
  IF v_user IS NULL OR v_user IS DISTINCT FROM auth.uid() THEN RAISE EXCEPTION 'not authorized'; END IF;

  DELETE FROM public.transactions
    WHERE origin_transaction_id = _tx_id AND user_id = v_user;

  UPDATE public.transactions
    SET paid_at = NULL, status = 'pendente', updated_at = now()
    WHERE id = _tx_id;
END $function$;

CREATE OR REPLACE FUNCTION public.encerrar_parcelamento(_group_id uuid, _modo text, _custom_amount numeric DEFAULT NULL::numeric)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
      FROM public.credit_cards WHERE id = v_credit_card AND user_id = v_user;
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
END $function$;

CREATE OR REPLACE FUNCTION public.adiantar_parcelas(_tx_ids uuid[])
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user uuid := auth.uid();
  v_total numeric;
  v_credit_card uuid;
  v_pay_account uuid;
  v_new_id uuid;
  v_distinct_cards int;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;

  IF EXISTS (SELECT 1 FROM public.transactions
             WHERE id = ANY(_tx_ids) AND user_id IS DISTINCT FROM v_user) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  SELECT COUNT(DISTINCT credit_card_id) INTO v_distinct_cards
    FROM public.transactions WHERE id = ANY(_tx_ids);
  IF v_distinct_cards <> 1 THEN
    RAISE EXCEPTION 'todas as parcelas devem pertencer ao mesmo cartão';
  END IF;

  SELECT credit_card_id, SUM(amount) INTO v_credit_card, v_total
    FROM public.transactions
    WHERE id = ANY(_tx_ids) AND paid_at IS NULL AND user_id = v_user
    GROUP BY credit_card_id;

  IF v_credit_card IS NULL THEN RAISE EXCEPTION 'nenhuma parcela pendente'; END IF;

  SELECT payment_account_id INTO v_pay_account
    FROM public.credit_cards WHERE id = v_credit_card AND user_id = v_user;

  UPDATE public.transactions
    SET paid_at = now(), status = 'pago', updated_at = now()
    WHERE id = ANY(_tx_ids) AND paid_at IS NULL AND user_id = v_user;

  INSERT INTO public.transactions (
    user_id, account_id, amount, type, category, description,
    date, due_date, status, is_fixed, paid_at
  ) VALUES (
    v_user, v_pay_account, v_total, 'despesa', 'contas',
    'Adiantamento de parcelas',
    CURRENT_DATE, CURRENT_DATE, 'pago', false, now()
  ) RETURNING id INTO v_new_id;

  RETURN v_new_id;
END $function$;

CREATE OR REPLACE FUNCTION public.pay_debt_installment(_debt_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user uuid;
  v_inst numeric;
  v_rem integer;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;

  SELECT user_id, monthly_installment, remaining_installments
    INTO v_user, v_inst, v_rem
    FROM public.debts WHERE id = _debt_id;
  IF v_user IS NULL OR v_user IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  UPDATE public.debts
    SET remaining_installments = GREATEST(v_rem - 1, 0),
        total_amount = GREATEST(total_amount - v_inst, 0),
        status_this_month = 'pago',
        last_paid_month = date_trunc('month', now())::date,
        updated_at = now()
  WHERE id = _debt_id;
END $function$;

CREATE OR REPLACE FUNCTION public.revert_debt_payment(_debt_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user uuid;
  v_inst numeric;
  v_cat public.debt_category;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;

  SELECT user_id, monthly_installment, category
    INTO v_user, v_inst, v_cat
    FROM public.debts WHERE id = _debt_id;
  IF v_user IS NULL OR v_user IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  UPDATE public.debts
    SET remaining_installments = CASE WHEN v_cat = 'parcelada' THEN remaining_installments + 1 ELSE remaining_installments END,
        total_amount = CASE WHEN v_cat = 'parcelada' THEN total_amount + v_inst ELSE total_amount END,
        status_this_month = 'pendente',
        last_paid_month = NULL,
        updated_at = now()
  WHERE id = _debt_id;
END $function$;

CREATE OR REPLACE FUNCTION public.pay_debt_with_amount(_debt_id uuid, _amount numeric)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user uuid;
  v_cat public.debt_category;
  v_rem integer;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;

  SELECT user_id, category, remaining_installments
    INTO v_user, v_cat, v_rem
    FROM public.debts WHERE id = _debt_id;
  IF v_user IS NULL OR v_user IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  UPDATE public.debts
    SET remaining_installments = CASE WHEN v_cat = 'parcelada' THEN GREATEST(v_rem - 1, 0) ELSE v_rem END,
        total_amount = GREATEST(total_amount - _amount, 0),
        monthly_installment = CASE WHEN v_cat = 'variavel' THEN _amount ELSE monthly_installment END,
        status_this_month = 'pago',
        last_paid_month = date_trunc('month', now())::date,
        updated_at = now()
  WHERE id = _debt_id;
END $function$;