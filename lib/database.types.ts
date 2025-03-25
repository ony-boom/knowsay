export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      answer_corrections: {
        Row: {
          answer_id: string | null
          corrected_at: string | null
          corrector_id: string | null
          feedback: string | null
          id: string
          score: number
        }
        Insert: {
          answer_id?: string | null
          corrected_at?: string | null
          corrector_id?: string | null
          feedback?: string | null
          id?: string
          score: number
        }
        Update: {
          answer_id?: string | null
          corrected_at?: string | null
          corrector_id?: string | null
          feedback?: string | null
          id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "answer_corrections_answer_id_fkey"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "test_attempt_answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answer_corrections_corrector_id_fkey"
            columns: ["corrector_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      challenge_attempts: {
        Row: {
          attempt_date: string | null
          challenge_id: string | null
          id: string
          status: string
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          attempt_date?: string | null
          challenge_id?: string | null
          id?: string
          status?: string
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          attempt_date?: string | null
          challenge_id?: string | null
          id?: string
          status?: string
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_attempts_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["challenge_id"]
          },
          {
            foreignKeyName: "challenge_attempts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "challenge_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_invitations: {
        Row: {
          accepted_at: string | null
          challenge_id: string | null
          created_at: string | null
          email: string
          invitation_id: string
          is_registered: boolean | null
          team_id: string | null
          token: string
        }
        Insert: {
          accepted_at?: string | null
          challenge_id?: string | null
          created_at?: string | null
          email: string
          invitation_id?: string
          is_registered?: boolean | null
          team_id?: string | null
          token: string
        }
        Update: {
          accepted_at?: string | null
          challenge_id?: string | null
          created_at?: string | null
          email?: string
          invitation_id?: string
          is_registered?: boolean | null
          team_id?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_invitations_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["challenge_id"]
          },
          {
            foreignKeyName: "challenge_invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["team_id"]
          },
        ]
      }
      challenges: {
        Row: {
          challenge_id: string
          created_at: string | null
          creator_id: string | null
          description: string | null
          end_time: string
          is_team_based: boolean | null
          start_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          challenge_id?: string
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          end_time: string
          is_team_based?: boolean | null
          start_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          challenge_id?: string
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          end_time?: string
          is_team_based?: boolean | null
          start_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string | null
          friendship_id: string
          status: string
          updated_at: string | null
          user_id1: string | null
          user_id2: string | null
        }
        Insert: {
          created_at?: string | null
          friendship_id?: string
          status?: string
          updated_at?: string | null
          user_id1?: string | null
          user_id2?: string | null
        }
        Update: {
          created_at?: string | null
          friendship_id?: string
          status?: string
          updated_at?: string | null
          user_id1?: string | null
          user_id2?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friendships_user_id1_fkey"
            columns: ["user_id1"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id2_fkey"
            columns: ["user_id2"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          is_read: boolean | null
          message_id: string
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          is_read?: boolean | null
          message_id?: string
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          is_read?: boolean | null
          message_id?: string
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          is_read: boolean | null
          message: string
          notification_id: string
          related_id: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          is_read?: boolean | null
          message: string
          notification_id?: string
          related_id?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          is_read?: boolean | null
          message?: string
          notification_id?: string
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      qcm: {
        Row: {
          created_at: string | null
          qcm_id: string
          question: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          qcm_id?: string
          question: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          qcm_id?: string
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      qcm_options: {
        Row: {
          is_correct: boolean
          option_id: string
          option_image_url: string | null
          option_text: string | null
          qcm_id: string | null
        }
        Insert: {
          is_correct: boolean
          option_id?: string
          option_image_url?: string | null
          option_text?: string | null
          qcm_id?: string | null
        }
        Update: {
          is_correct?: boolean
          option_id?: string
          option_image_url?: string | null
          option_text?: string | null
          qcm_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qcm_options_qcm_id_fkey"
            columns: ["qcm_id"]
            isOneToOne: false
            referencedRelation: "qcm"
            referencedColumns: ["qcm_id"]
          },
        ]
      }
      quiz: {
        Row: {
          category_id: string | null
          created_at: string | null
          creator_id: string | null
          description: string | null
          difficulty: string | null
          is_public: boolean
          quiz_id: string
          slug: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          difficulty?: string | null
          is_public?: boolean
          quiz_id?: string
          slug?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          difficulty?: string | null
          is_public?: boolean
          quiz_id?: string
          slug?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_quiz_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempt_answers: {
        Row: {
          id: string
          is_correct: boolean | null
          is_timeout: boolean | null
          question_id: string | null
          quiz_attempt_id: string | null
          selected_options: string[] | null
          submitted_at: string | null
        }
        Insert: {
          id?: string
          is_correct?: boolean | null
          is_timeout?: boolean | null
          question_id?: string | null
          quiz_attempt_id?: string | null
          selected_options?: string[] | null
          submitted_at?: string | null
        }
        Update: {
          id?: string
          is_correct?: boolean | null
          is_timeout?: boolean | null
          question_id?: string | null
          quiz_attempt_id?: string | null
          selected_options?: string[] | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempt_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempt_answers_quiz_attempt_id_fkey"
            columns: ["quiz_attempt_id"]
            isOneToOne: false
            referencedRelation: "quiz_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          challenge_id: string | null
          completed_at: string | null
          id: string
          quiz_id: string | null
          score: number | null
          started_at: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          completed_at?: string | null
          id?: string
          quiz_id?: string | null
          score?: number | null
          started_at?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          completed_at?: string | null
          id?: string
          quiz_id?: string | null
          score?: number | null
          started_at?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["challenge_id"]
          },
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quiz"
            referencedColumns: ["quiz_id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          id: string
          points: number
          position: number
          qcm_id: string | null
          quiz_id: string | null
          time_limit: number
        }
        Insert: {
          id?: string
          points: number
          position: number
          qcm_id?: string | null
          quiz_id?: string | null
          time_limit: number
        }
        Update: {
          id?: string
          points?: number
          position?: number
          qcm_id?: string | null
          quiz_id?: string | null
          time_limit?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_qcm_id_fkey"
            columns: ["qcm_id"]
            isOneToOne: false
            referencedRelation: "qcm"
            referencedColumns: ["qcm_id"]
          },
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quiz"
            referencedColumns: ["quiz_id"]
          },
        ]
      }
      taggable_items: {
        Row: {
          entity_id: string
          entity_type: string
          id: string
          tag_id: string | null
        }
        Insert: {
          entity_id: string
          entity_type: string
          id?: string
          tag_id?: string | null
        }
        Update: {
          entity_id?: string
          entity_type?: string
          id?: string
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "taggable_items_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["tag_id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string | null
          name: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          name: string
          tag_id?: string
        }
        Update: {
          created_at?: string | null
          name?: string
          tag_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          is_captain: boolean | null
          joined_at: string | null
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          is_captain?: boolean | null
          joined_at?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          is_captain?: boolean | null
          joined_at?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          challenge_id: string | null
          created_at: string | null
          name: string
          team_id: string
        }
        Insert: {
          challenge_id?: string | null
          created_at?: string | null
          name: string
          team_id?: string
        }
        Update: {
          challenge_id?: string | null
          created_at?: string | null
          name?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["challenge_id"]
          },
        ]
      }
      test_attempt_answers: {
        Row: {
          free_text_answer: string | null
          id: string
          is_timeout: boolean | null
          question_id: string | null
          selected_options: string[] | null
          submitted_at: string | null
          test_attempt_id: string | null
        }
        Insert: {
          free_text_answer?: string | null
          id?: string
          is_timeout?: boolean | null
          question_id?: string | null
          selected_options?: string[] | null
          submitted_at?: string | null
          test_attempt_id?: string | null
        }
        Update: {
          free_text_answer?: string | null
          id?: string
          is_timeout?: boolean | null
          question_id?: string | null
          selected_options?: string[] | null
          submitted_at?: string | null
          test_attempt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_attempt_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "test_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_attempt_answers_test_attempt_id_fkey"
            columns: ["test_attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      test_attempts: {
        Row: {
          completed_at: string | null
          id: string
          score: number | null
          started_at: string | null
          status: string
          test_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          score?: number | null
          started_at?: string | null
          status?: string
          test_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          score?: number | null
          started_at?: string | null
          status?: string
          test_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_attempts_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["test_id"]
          },
          {
            foreignKeyName: "test_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      test_correctors: {
        Row: {
          assigned_at: string | null
          corrector_id: string | null
          id: string
          response_at: string | null
          status: string | null
          test_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          corrector_id?: string | null
          id?: string
          response_at?: string | null
          status?: string | null
          test_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          corrector_id?: string | null
          id?: string
          response_at?: string | null
          status?: string | null
          test_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_correctors_corrector_id_fkey"
            columns: ["corrector_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_correctors_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["test_id"]
          },
        ]
      }
      test_questions: {
        Row: {
          id: string
          is_free_text: boolean | null
          points: number
          position: number
          qcm_id: string | null
          test_id: string | null
          time_limit: number | null
        }
        Insert: {
          id?: string
          is_free_text?: boolean | null
          points: number
          position: number
          qcm_id?: string | null
          test_id?: string | null
          time_limit?: number | null
        }
        Update: {
          id?: string
          is_free_text?: boolean | null
          points?: number
          position?: number
          qcm_id?: string | null
          test_id?: string | null
          time_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_questions_qcm_id_fkey"
            columns: ["qcm_id"]
            isOneToOne: false
            referencedRelation: "qcm"
            referencedColumns: ["qcm_id"]
          },
          {
            foreignKeyName: "test_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["test_id"]
          },
        ]
      }
      tests: {
        Row: {
          created_at: string | null
          creator_id: string | null
          description: string | null
          end_time: string | null
          start_time: string | null
          test_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          end_time?: string | null
          start_time?: string | null
          test_id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          end_time?: string | null
          start_time?: string | null
          test_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tests_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_id: string
          activity_type: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string
          user_id: string | null
        }
        Insert: {
          activity_id?: string
          activity_type: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          user_id?: string | null
        }
        Update: {
          activity_id?: string
          activity_type?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          clerk_id: string | null
          created_at: string | null
          email: string
          id: string
          is_verified: boolean | null
          name: string
          password_hash: string | null
          role: string
        }
        Insert: {
          clerk_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_verified?: boolean | null
          name: string
          password_hash?: string | null
          role?: string
        }
        Update: {
          clerk_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_verified?: boolean | null
          name?: string
          password_hash?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_completed_attempts: {
        Args: {
          user_uuid: string
        }
        Returns: {
          id: string
          user_id: string
          team_id: string
          status: string
        }[]
      }
    }
    Enums: {
      quiz_status: "IN_PROGRESS" | "PAUSED" | "DONE" | "NOT_STARTED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
