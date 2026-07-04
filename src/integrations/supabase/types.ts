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
          due_date: string | null
          id: string
          installments_left: number
          is_installment: boolean
          notes: string | null
          person_id: string | null
          person_name: string
          status: Database["public"]["Enums"]["payment_status"]
          type: Database["public"]["Enums"]["third_party_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          due_date?: string | null
          id?: string
          installments_left?: number
          is_installment?: boolean
          notes?: string | null
          person_id?: string | null
          person_name: string
          status?: Database["public"]["Enums"]["payment_status"]
          type: Database["public"]["Enums"]["third_party_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          id?: string
          installments_left?: number
          is_installment?: boolean
          notes?: string | null
          person_id?: string | null
          person_name?: string
          status?: Database["public"]["Enums"]["payment_status"]
          type?: Database["public"]["Enums"]["third_party_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
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
          date: string
          description: string
          due_date: string | null
          envelope_id: string | null
          id: string
          is_fixed: boolean
          status: Database["public"]["Enums"]["payment_status"]
          type: Database["public"]["Enums"]["tx_kind"]
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          due_date?: string | null
          envelope_id?: string | null
          id?: string
          is_fixed?: boolean
          status?: Database["public"]["Enums"]["payment_status"]
          type: Database["public"]["Enums"]["tx_kind"]
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          due_date?: string | null
          envelope_id?: string | null
          id?: string
          is_fixed?: boolean
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
            foreignKeyName: "transactions_envelope_id_fkey"
            columns: ["envelope_id"]
            isOneToOne: false
            referencedRelation: "budget_envelopes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
      payment_status: "pago" | "pendente" | "atrasado"
      person_type: "contato" | "empresa" | "familia"
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
      payment_status: ["pago", "pendente", "atrasado"],
      person_type: ["contato", "empresa", "familia"],
      third_party_type: [
        "emprestei_dinheiro",
        "usou_meu_cartao",
        "devo_a_terceiro",
      ],
      tx_kind: ["receita", "despesa"],
    },
  },
} as const
