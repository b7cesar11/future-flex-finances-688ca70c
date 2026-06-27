
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, monthly_income, essential_expenses)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''), 5000, 2000);
  INSERT INTO public.accounts (user_id, name, type, balance, emoji, color) VALUES
    (NEW.id, 'Conta Principal', 'Conta Corrente', 0, '🏦', 'bg-sky-500/20 text-sky-300'),
    (NEW.id, 'Dinheiro', 'Dinheiro', 0, '💵', 'bg-emerald-500/20 text-emerald-300');
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
