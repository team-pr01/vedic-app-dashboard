// Add these types to your existing types file

export interface VedicText {
  id: string;
  veda_type: 'rigveda' | 'samaveda' | 'yajurveda' | 'atharvaveda';
  mandala_number?: number;
  sukta_number?: number;
  verse_number?: number;
  book_number?: number;
  chapter_number?: number;
  original_text: string;
  devanagari_text?: string;
  transliteration?: string;
  meter?: string;
  tags: string[];
  notes?: string;
  is_published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface VedicTranslation {
  id: string;
  text_id: string;
  language_code: string;
  translation: string;
  translator: string;
  translation_type: 'word_by_word' | 'verse' | 'commentary';
  source?: string;
  is_verified: boolean;
  verified_by?: string;
  verification_notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Mantra {
  id: string;
  veda: 'rigveda' | 'samaveda' | 'yajurveda' | 'atharvaveda';
  text: string;
  translation: {
    [key: string]: {
      text: string;
      translator: string;
      verified: boolean;
    };
  };
  tags: string[];
  views: number;
  created_at: string;
  updated_at: string;
}