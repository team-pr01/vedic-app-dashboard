export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      doctors: {
        Row: {
          id: string
          user_id: string
          full_name: string
          profile_image: string | null
          specialization: string[]
          qualification: string[]
          experience_years: number
          rating: number
          total_reviews: number
          consultation_fee: number
          about: string | null
          languages: string[]
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          profile_image?: string | null
          specialization: string[]
          qualification: string[]
          experience_years: number
          rating?: number
          total_reviews?: number
          consultation_fee: number
          about?: string | null
          languages: string[]
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          profile_image?: string | null
          specialization?: string[]
          qualification?: string[]
          experience_years?: number
          rating?: number
          total_reviews?: number
          consultation_fee?: number
          about?: string | null
          languages?: string[]
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      consultancy_categories: {
        Row: {
          id: string
          name: 'mind' | 'body' | 'family' | 'relationship' | 'social' | 'financial'
          icon: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: 'mind' | 'body' | 'family' | 'relationship' | 'social' | 'financial'
          icon: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: 'mind' | 'body' | 'family' | 'relationship' | 'social' | 'financial'
          icon?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      doctor_availability: {
        Row: {
          id: string
          doctor_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          doctor_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          doctor_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          category_id: string
          appointment_date: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          symptoms: string[]
          notes: string | null
          payment_status: boolean
          payment_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          category_id: string
          appointment_date: string
          start_time: string
          end_time: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          symptoms?: string[]
          notes?: string | null
          payment_status?: boolean
          payment_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          category_id?: string
          appointment_date?: string
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          symptoms?: string[]
          notes?: string | null
          payment_status?: boolean
          payment_amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      symptoms: {
        Row: {
          id: string
          user_id: string
          category_id: string
          symptom_text: string
          severity: number
          date_reported: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          symptom_text: string
          severity: number
          date_reported?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          symptom_text?: string
          severity?: number
          date_reported?: string
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          appointment_id: string
          patient_id: string
          doctor_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          appointment_id: string
          patient_id: string
          doctor_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          appointment_id?: string
          patient_id?: string
          doctor_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      appointment_status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
      consultation_category: 'mind' | 'body' | 'family' | 'relationship' | 'social' | 'financial'
    }
  }
}