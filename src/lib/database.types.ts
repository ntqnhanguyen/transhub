export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string
          name: string
          description: string | null
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: Database["public"]["Enums"]["team_role"]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role: Database["public"]["Enums"]["team_role"]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          role?: Database["public"]["Enums"]["team_role"]
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          source_language: string
          target_languages: string[]
          progress: number
          status: Database["public"]["Enums"]["project_status"]
          owner_id: string
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          source_language: string
          target_languages: string[]
          progress?: number
          status?: Database["public"]["Enums"]["project_status"]
          owner_id: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          source_language?: string
          target_languages?: string[]
          progress?: number
          status?: Database["public"]["Enums"]["project_status"]
          owner_id?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      project_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: Database["public"]["Enums"]["team_role"]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role: Database["public"]["Enums"]["team_role"]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: Database["public"]["Enums"]["team_role"]
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          project_id: string
          name: string
          source_language: string
          target_language: string
          status: Database["public"]["Enums"]["document_status"]
          progress: number
          translator_id: string | null
          file_url: string
          file_size: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          source_language: string
          target_language: string
          status?: Database["public"]["Enums"]["document_status"]
          progress?: number
          translator_id?: string | null
          file_url: string
          file_size: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          source_language?: string
          target_language?: string
          status?: Database["public"]["Enums"]["document_status"]
          progress?: number
          translator_id?: string | null
          file_url?: string
          file_size?: number
          created_at?: string
          updated_at?: string
        }
      }
      translations: {
        Row: {
          id: string
          document_id: string
          source_text: string
          target_text: string
          status: Database["public"]["Enums"]["translation_status"]
          confidence_score: number
          translator_id: string | null
          reviewer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          document_id: string
          source_text: string
          target_text: string
          status?: Database["public"]["Enums"]["translation_status"]
          confidence_score?: number
          translator_id?: string | null
          reviewer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          source_text?: string
          target_text?: string
          status?: Database["public"]["Enums"]["translation_status"]
          confidence_score?: number
          translator_id?: string | null
          reviewer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          avatar_url: string | null
          preferred_language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          avatar_url?: string | null
          preferred_language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          avatar_url?: string | null
          preferred_language?: string
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          user_id: string
          openai_api_key: string | null
          openai_model: string | null
          openai_base_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          openai_api_key?: string | null
          openai_model?: string | null
          openai_base_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          openai_api_key?: string | null
          openai_model?: string | null
          openai_base_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Enums: {
      project_status: "draft" | "active" | "completed" | "archived"
      document_status: "queued" | "in_progress" | "in_review" | "completed"
      translation_status: "pending" | "in_progress" | "in_review" | "completed"
      team_role: "owner" | "admin" | "translator" | "reviewer"
    }
  }
}