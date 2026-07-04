export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          active: boolean
          balance: number
          color: string
          created_at: string
          emoji: string
          id: string
          initial_balance: number
          name: string
          type: Database["public"]["Enums"]["account_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          balance?: number
          color?: string
          created_at?: string
          emoji?: string
          id?: string
          initial_balance?: number
          name: string
          type?: Database["public"]["Enums"]["account_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          balance?: number
          color?: string
          created_at?: string
          emoji?: string
          id?: string
          initial_balance?: number
          name?: string
          type?: Database["public"]["Enums"]["account_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      budget_envelopes: {
        Row: {
          color: string | null
          created_at: string
          emoji: string | null
          id: string
          monthly_limit: number
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          emoji?: string | null
          id?: string
          monthly_limit?: number
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          emoji?: string | null
          id?: string
          monthly_limit?: number
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      credit_card_invoices: {
        Row: {
          closing_date: string
          created_at: string
          credit_card_id: string
          due_date: string
          id: string
          paid_at: string | null
          reference_month: string
          status: Database["public"]["Enums"]["invoice_status"]
          updated_at: string
        }
        Insert: {
          closing_date: string
          created_at?: string
          credit_card_id: string
          due_date: string
          id?: string
          paid_at?: string | null
          reference_month: string
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
        }
        Update: {
          closing_date?: string
          created_at?: string
          credit_card_id?: string
          due_date?: string
          id?: string
          paid_at?: string | null
          reference_month?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_card_invoices_credit_card_id_fkey"
            columns: ["credit_card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_cards: {
        Row: {
          active: boolean
          closing_day: number
          created_at: string
          credit_limit: number | null
          due_day: number
          id: string
          name: string
          payment_account_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          closing_day: number
          created_at?: string
          credit_limit?: number | null
          due_day: number
          id?: string
          name: string
          payment_account_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          closing_day?: number
          created_at?: string
          credit_limit?: number | null
          due_day?: number
          id?: string
          name?: string
          payment_account_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_cards_payment_account_id_fkey"
            columns: ["payment_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      debts: {
        Row: {
          category: Database["public"]["Enums"]["debt_category"]
          created_at: string
          due_day: number | null
          id: string
          is_variable: boolean
          last_paid_month: string | null
          monthly_installment: number
          name: string
          remaining_installments: number
          start_date: string
          status_this_month: Database["public"]["Enums"]["payment_status"]
          total_amount: number
          total_installments: number
          type: Database["public"]["Enums"]["debt_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["debt_category"]
          created_at?: string
          due_day?: number | null
          id?: string
          is_variable?: boolean
          last_paid_month?: string | null
          monthly_installment: number
          name: string
          remaining_installments: number
          start_date?: string
          status_this_month?: Database["public"]["Enums"]["payment_status"]
          total_amount?: number
          total_installments: number
          type?: Database["public"]["Enums"]["debt_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["debt_category"]
          created_at?: string
          due_day?: number | null
          id?: string
          is_variable?: boolean
          last_paid_month?: string | null
          monthly_installment?: number
          name?: string
          remaining_installments?: number
          start_date?: string
          status_this_month?: Database["public"]["Enums"]["payment_status"]
          total_amount?: number
          total_installments?: number
          type?: Database["public"]["Enums"]["debt_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      income_sources: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string
          expected_date_label: string | null
          expected_day: number
          id: string
          last_received_month: string | null
          name: string
          status: Database["public"]["Enums"]["income_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount?: number
          created_at?: string
          expected_date_label?: string | null
          expected_day?: number
          id?: string
          last_received_month?: string | null
          name: string
          status?: Database["public"]["Enums"]["income_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string
          expected_date_label?: string | null
          expected_day?: number
          id?: string
          last_received_month?: string | null
          name?: string
          status?: Database["public"]["Enums"]["income_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "income_sources_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          amount: number
          created_at: string
          id: string
          name: string
          suggested_contribution: number
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          name: string
          suggested_contribution?: number
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          name?: string
          suggested_contribution?: number
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      monthly_budgets: {
        Row: {
          created_at: string
          global_limit_amount: number
          id: string
          month_year: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          global_limit_amount?: number
          id?: string
          month_year: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          global_limit_amount?: number
          id?: string
          month_year?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      people: {
        Row: {
          active: boolean
          avatar_url: string | null
          created_at: string
          id: string
          name: string
          notes: string | null
          type: Database["public"]["Enums"]["person_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          type?: Database["public"]["Enums"]["person_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          type?: Database["public"]["Enums"]["person_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          essential_expenses: number
          full_name: string | null
          id: string
          monthly_income: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          essential_expenses?: number
          full_name?: string | null
          id: string
          monthly_income?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          essential_expenses?: number
          full_name?: string | null
          id?: string
          monthly_income?: number
          updated_at?: string
        }
        Relationships: []
      }
      savings_goals: {
        Row: {
          color: string
          created_at: string
          current_amount: number
          emoji: string
          id: string
          monthly_contribution: number
          name: string
          target_amount: number
          target_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          current_amount?: number
          emoji?: string
          id?: string
          monthly_contribution?: number
          name: string
          target_amount?: number
          target_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          current_amount?: number
          emoji?: string
          id?: string
          monthly_contribution?: number
          name?: string
          target_amount?: number
          target_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      third_party_financials: {
        Row: {
          amount: number
          created_at: string
          credit_card_id: string | null
          direction: Database["public"]["Enums"]["third_party_direction"]
          due_date: string | null
          id: string
          installments_left: number
          is_installment: boolean
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method_type"]
          person_id: string | null
          person_name: string
          purchase_group_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          type: Database["public"]["Enums"]["third_party_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          credit_card_id?: string | null
          direction?: Database["public"]["Enums"]["third_party_direction"]
          due_date?: string | null
          id?: string
          installments_left?: number
          is_installment?: boolean
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method_type"]
          person_id?: string | null
          person_name: string
          purchase_group_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          type: Database["public"]["Enums"]["third_party_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          credit_card_id?: string | null
          direction?: Database["public"]["Enums"]["third_party_direction"]
          due_date?: string | null
          id?: string
          installments_left?: number
          is_installment?: boolean
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method_type"]
          person_id?: string | null
          person_name?: string
          purchase_group_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          type?: Database["public"]["Enums"]["third_party_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "third_party_financials_credit_card_id_fkey"
            columns: ["credit_card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "third_party_financials_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string | null
          amount: number
          category: string
          created_at: string
          credit_card_id: string | null
          date: string
          description: string
          due_date: string | null
          envelope_id: string | null
          id: string
          installment_number: number | null
          installment_total: number | null
          invoice_id: string | null
          is_fixed: boolean
          origin_invoice_id: string | null
          origin_transaction_id: string | null
          paid_at: string | null
          person_id: string | null
          purchase_group_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          type: Database["public"]["Enums"]["tx_kind"]
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          category?: string
          created_at?: string
          credit_card_id?: string | null
          date?: string
          description?: string
          due_date?: string | null
          envelope_id?: string | null
          id?: string
          installment_number?: number | null
          installment_total?: number | null
          invoice_id?: string | null
          is_fixed?: boolean
          origin_invoice_id?: string | null
          origin_transaction_id?: string | null
          paid_at?: string | null
          person_id?: string | null
          purchase_group_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          type: Database["public"]["Enums"]["tx_kind"]
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          category?: string
          created_at?: string
          credit_card_id?: string | null
          date?: string
          description?: string
          due_date?: string | null
          envelope_id?: string | null
          id?: string
          installment_number?: number | null
          installment_total?: number | null
          invoice_id?: string | null
          is_fixed?: boolean
          origin_invoice_id?: string | null
          origin_transaction_id?: string | null
          paid_at?: string | null
          person_id?: string | null
          purchase_group_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          type?: Database["public"]["Enums"]["tx_kind"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_credit_card_id_fkey"
            columns: ["credit_card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_envelope_id_fkey"
            columns: ["envelope_id"]
            isOneToOne: false
            referencedRelation: "budget_envelopes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "credit_card_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_origin_invoice_id_fkey"
            columns: ["origin_invoice_id"]
            isOneToOne: false
            referencedRelation: "credit_card_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_origin_transaction_id_fkey"
            columns: ["origin_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      adiantar_parcelas: { Args: { _tx_ids: string[] }; Returns: string }
      atualizar_ciclo_faturas: { Args: never; Returns: undefined }
      criar_compra_parcelada: {
        Args: {
          _account_id?: string
          _amount_total: number
          _category: string
          _credit_card_id?: string
          _description: string
          _envelope_id?: string
          _first_due_date: string
          _installments: number
          _person_id?: string
        }
        Returns: string
      }
      encerrar_parcelamento: {
        Args: { _custom_amount?: number; _group_id: string; _modo: string }
        Returns: undefined
      }
      estornar_fatura: { Args: { _invoice_id: string }; Returns: undefined }
      estornar_parcela: { Args: { _tx_id: string }; Returns: undefined }
      get_or_create_invoice: {
        Args: { _credit_card_id: string; _reference_month: string }
        Returns: string
      }
      installment_status: {
        Args: { _due_date: string; _paid_at: string; _ref_month?: string }
        Returns: string
      }
      pagar_fatura: { Args: { _invoice_id: string }; Returns: string }
      pagar_parcela: { Args: { _tx_id: string }; Returns: undefined }
      pay_debt_installment: { Args: { _debt_id: string }; Returns: undefined }
      pay_debt_with_amount: {
        Args: { _amount: number; _debt_id: string }
        Returns: undefined
      }
      revert_debt_payment: { Args: { _debt_id: string }; Returns: undefined }
      wipe_user_data: { Args: never; Returns: undefined }
    }
    Enums: {
      account_type:
        | "Conta Corrente"
        | "Poupança"
        | "Dinheiro"
        | "Cartão de Crédito"
      debt_category: "parcelada" | "variavel" | "fixa" | "congelada"
      debt_type: "Cartão de Crédito" | "Empréstimo" | "Financiamento"
      income_status: "recebido" | "pendente"
      invoice_status: "futura" | "aberta" | "fechada" | "paga"
      payment_method_type: "conta" | "cartao_credito" | "dinheiro"
      payment_status: "pago" | "pendente" | "atrasado"
      person_type: "contato" | "empresa" | "familia"
      third_party_direction: "a_pagar" | "a_receber"
      third_party_type:
        | "emprestei_dinheiro"
        | "usou_meu_cartao"
        | "devo_a_terceiro"
      tx_kind: "receita" | "despesa"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_type: [
        "Conta Corrente",
        "Poupança",
        "Dinheiro",
        "Cartão de Crédito",
      ],
      debt_category: ["parcelada", "variavel", "fixa", "congelada"],
      debt_type: ["Cartão de Crédito", "Empréstimo", "Financiamento"],
      income_status: ["recebido", "pendente"],
      invoice_status: ["futura", "aberta", "fechada", "paga"],
      payment_method_type: ["conta", "cartao_credito", "dinheiro"],
      payment_status: ["pago", "pendente", "atrasado"],
      person_type: ["contato", "empresa", "familia"],
      third_party_direction: ["a_pagar", "a_receber"],
      third_party_type: [
        "emprestei_dinheiro",
        "usou_meu_cartao",
        "devo_a_terceiro",
      ],
      tx_kind: ["receita", "despesa"],
    },
  },
} as const
