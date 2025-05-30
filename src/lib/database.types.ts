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
      projects: {
        Row: {
          id: string
          name: string
          description: string
          source_language: string
          target_languages: string[]
          progress: number
          status: string
          created_at: string
          updated_at: string
          owner_id: string
          due_date: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          source_language: string
          target_languages: string[]
          progress?: number
          status?: string
          created_at?: string
          updated_at?: string
          owner_id: string
          due_date: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          source_language?: string
          target_languages?: string[]
          progress?: number
          status?: string
          created_at?: string
          updated_at?: string
          owner_id?: string
          due_date?: string
        }
      }
      documents: {
        Row: {
          id: string
          project_id: string
          name: string
          source_language: string
          target_language: string
          status: string
          progress: number
          translator_id: string | null
          created_at: string
          updated_at: string
          file_url: string
          file_size: number
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          source_language: string
          target_language: string
          status?: string
          progress?: number
          translator_id?: string | null
          created_at?: string
          updated_at?: string
          file_url: string
          file_size: number
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          source_language?: string
          target_language?: string
          status?: string
          progress?: number
          translator_id?: string | null
          created_at?: string
          updated_at?: string
          file_url?: string
          file_size?: number
        }
      }
      translations: {
        Row: {
          id: string
          document_id: string
          source_text: string
          target_text: string
          status: string
          confidence_score: number
          created_at: string
          updated_at: string
          translator_id: string | null
          reviewer_id: string | null
        }
        Insert: {
          id?: string
          document_id: string
          source_text: string
          target_text: string
          status?: string
          confidence_score?: number
          created_at?: string
          updated_at?: string
          translator_id?: string | null
          reviewer_id?: string | null
        }
        Update: {
          id?: string
          document_id?: string
          source_text?: string
          target_text?: string
          status?: string
          confidence_score?: number
          created_at?: string
          updated_at?: string
          translator_id?: string | null
          reviewer_id?: string | null
        }
      }
      team_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: string
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
    }
  }
}