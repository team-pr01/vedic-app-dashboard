import React, { useState, useEffect } from 'react';
import { Book, Search, Plus, Trash2, Check, Languages } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SUPPORTED_LANGUAGES, TRANSLATION_TYPES, VEDIC_METERS, VEDA_TYPES } from '../lib/languages';
import toast from 'react-hot-toast';
import type { VedicText, VedicTranslation } from '../types';

const sampleMantras = [
  {
    id: '1',
    veda_type: 'rigveda',
    mandala_number: 3,
    sukta_number: 62,
    verse_number: 10,
    original_text: 'ॐ भूर्भुवः स्वः । तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥',
    devanagari_text: 'ॐ भूर्भुवः स्वः । तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥',
    transliteration: 'oṃ bhūr bhuvaḥ svaḥ tát savitúr váreṇyaṃ bhárgo devásya dhīmahi dhíyo yó naḥ pracodáyāt',
    meter: 'Gayatri',
    tags: ['meditation', 'sun', 'enlightenment'],
    notes: 'The Gayatri Mantra, one of the most sacred mantras in Hinduism',
    is_published: true
  },
  {
    id: '2',
    veda_type: 'samaveda',
    book_number: 1,
    chapter_number: 1,
    verse_number: 1,
    original_text: 'अग्न आ याहि वीतये गृणानो हव्यदातये । नि होता सत्सि बर्हिषि ॥',
    devanagari_text: 'अग्न आ याहि वीतये गृणानो हव्यदातये । नि होता सत्सि बर्हिषि ॥',
    transliteration: 'agna ā yāhi vītaye gṛṇāno havyadātaye | ni hotā satsi barhiṣi ||',
    meter: 'Gayatri',
    tags: ['agni', 'invocation', 'ritual'],
    notes: 'An invocation to Agni from Samaveda',
    is_published: true
  }
];

const sampleTranslations = {
  '1': [
    {
      language_code: 'en',
      translation: 'We meditate on the glorious splendor of the Divine Light (of the Sun); May He illuminate our intellect.',
      translator: 'Max Müller',
      translation_type: 'verse',
      source: 'Sacred Books of the East',
      is_verified: true
    },
    {
      language_code: 'hi',
      translation: 'हम उस देव के तेज का ध्यान करते हैं, जो सबको प्रेरणा देता है। वह हमारी बुद्धि को सन्मार्ग पर प्रेरित करे।',
      translator: 'डॉ. रामकृष्ण शर्मा',
      translation_type: 'verse',
      source: 'वैदिक साहित्य संग्रह',
      is_verified: true
    }
  ]
};

export function ReligiousTextManager() {
  const [texts, setTexts] = useState<VedicText[]>(sampleMantras);
  const [selectedVeda, setSelectedVeda] = useState<VedicText['veda_type']>('rigveda');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['sa', 'en', 'hi', 'bn']);
  const [translations, setTranslations] = useState<{[key: string]: VedicTranslation[]}>(sampleTranslations);
  const [showForm, setShowForm] = useState(false);
  const [currentText, setCurrentText] = useState<Partial<VedicText>>({
    veda_type: 'rigveda',
    original_text: '',
    devanagari_text: '',
    transliteration: '',
    tags: [],
    is_published: false
  });

  useEffect(() => {
    fetchTexts();
  }, [selectedVeda]);

  const fetchTexts = async () => {
    try {
      const { data, error } = await supabase
        .from('vedic_texts')
        .select('*')
        .eq('veda_type', selectedVeda)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTexts(data || sampleMantras);

      // Fetch translations for all texts
      if (data?.length) {
        const { data: translationsData, error: translationsError } = await supabase
          .from('vedic_translations')
          .select('*')
          .in('text_id', data.map(text => text.id));

        if (translationsError) throw translationsError;
        
        // Group translations by text_id
        const translationsByText = translationsData?.reduce((acc, curr) => {
          if (!acc[curr.text_id]) {
            acc[curr.text_id] = [];
          }
          acc[curr.text_id].push(curr);
          return acc;
        }, {} as {[key: string]: VedicTranslation[]});

        setTranslations(translationsByText || sampleTranslations);
      }
    } catch (error) {
      console.error('Error fetching texts:', error);
      toast.error('Failed to load texts');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      // Insert the main text
      const { data: textData, error: textError } = await supabase
        .from('vedic_texts')
        .insert({
          ...currentText,
          created_by: userData.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (textError) throw textError;

      // Insert translations
      const translationPromises = selectedLanguages.map(langCode => {
        if (translations[langCode]) {
          return supabase
            .from('vedic_translations')
            .insert({
              text_id: textData.id,
              language_code: langCode,
              translation: translations[langCode],
              translator: `${userData.user?.email}`,
              translation_type: 'verse',
              created_by: userData.user.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
        }
      });

      await Promise.all(translationPromises);

      toast.success('Text and translations added successfully');
      resetForm();
      fetchTexts();
    } catch (error) {
      console.error('Error saving text:', error);
      toast.error('Failed to save text');
    }
  };

  const resetForm = () => {
    setCurrentText({
      veda_type: selectedVeda,
      original_text: '',
      devanagari_text: '',
      transliteration: '',
      tags: [],
      is_published: false
    });
    setTranslations({});
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this text?')) return;

    try {
      const { error } = await supabase
        .from('vedic_texts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Text deleted successfully');
      fetchTexts();
    } catch (error) {
      console.error('Error deleting text:', error);
      toast.error('Failed to delete text');
    }
  };

  const filteredTexts = texts.filter(text => {
    const searchString = searchQuery.toLowerCase();
    return (
      text.original_text.toLowerCase().includes(searchString) ||
      text.devanagari_text?.toLowerCase().includes(searchString) ||
      text.transliteration?.toLowerCase().includes(searchString) ||
      text.tags.some(tag => tag.toLowerCase().includes(searchString))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Book className="h-6 w-6 mr-2 text-blue-500" />
          Vedic Texts Management
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Text
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {VEDA_TYPES.map((veda) => (
          <button
            key={veda.id}
            onClick={() => setSelectedVeda(veda.id as VedicText['veda_type'])}
            className={`p-4 rounded-lg text-center transition-colors ${
              selectedVeda === veda.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <h3 className="text-lg font-semibold">{veda.name}</h3>
            <p className="text-sm mt-2 opacity-80">{veda.description}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search texts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <Languages className="h-6 w-6 text-gray-400" />
        <select
          multiple
          value={selectedLanguages}
          onChange={(e) => setSelectedLanguages(
            Array.from(e.target.selectedOptions, option => option.value)
          )}
          className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
        >
          {SUPPORTED_LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredTexts.map((text) => (
          <div
            key={text.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {text.veda_type === 'rigveda'
                    ? `Mandala ${text.mandala_number}, Sukta ${text.sukta_number}, Verse ${text.verse_number}`
                    : `Book ${text.book_number}, Chapter ${text.chapter_number}, Verse ${text.verse_number}`
                  }
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                  text.is_published
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {text.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setCurrentText(text);
                    setShowForm(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(text.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Original Text
              </h4>
              <p className="text-gray-900 dark:text-white font-sanskrit">
                {text.original_text}
              </p>
              {text.devanagari_text && (
                <p className="mt-2 text-gray-600 dark:text-gray-400 font-devanagari">
                  {text.devanagari_text}
                </p>
              )}
              {text.transliteration && (
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {text.transliteration}
                </p>
              )}
            </div>

            {translations[text.id] && (
              <div className="mt-4 space-y-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Translations
                </h4>
                {translations[text.id].map((translation, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {SUPPORTED_LANGUAGES.find(l => l.code === translation.language_code)?.name}
                      </span>
                      {translation.is_verified && (
                        <span className="text-green-600 dark:text-green-400">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 dark:text-gray-200">
                      {translation.translation}
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Translated by: {translation.translator}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {text.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {text.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {currentText.id ? 'Edit Text' : 'Add New Text'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Original Text (Sanskrit)
                  </label>
                  <textarea
                    value={currentText.original_text}
                    onChange={(e) => setCurrentText({ ...currentText, original_text: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 font-sanskrit"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Devanagari Text
                  </label>
                  <textarea
                    value={currentText.devanagari_text}
                    onChange={(e) => setCurrentText({ ...currentText, devanagari_text: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 font-devanagari"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Transliteration
                </label>
                <textarea
                  value={currentText.transliteration}
                  onChange={(e) => setCurrentText({ ...currentText, transliteration: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedVeda === 'rigveda' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Mandala Number
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={currentText.mandala_number || ''}
                        onChange={(e) => setCurrentText({
                          ...currentText,
                          mandala_number: parseInt(e.target.value)
                        })}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Sukta Number
                      </label>
                      <input
                        type="number"
                        value={currentText.sukta_number || ''}
                        onChange={(e) => setCurrentText({
                          ...currentText,
                          sukta_number: parseInt(e.target.value)
                        })}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Book Number
                      </label>
                      <input
                        type="number"
                        value={currentText.book_number || ''}
                        onChange={(e) => setCurrentText({
                          ...currentText,
                          book_number: parseInt(e.target.value)
                        })}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Chapter Number
                      </label>
                      <input
                        type="number"
                        value={currentText.chapter_number || ''}
                        onChange={(e) => setCurrentText({
                          ...currentText,
                          chapter_number: parseInt(e.target.value)
                        })}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        required
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Verse Number
                  </label>
                  <input
                    type="number"
                    value={currentText.verse_number || ''}
                    onChange={(e) => setCurrentText({
                      ...currentText,
                      verse_number: parseInt(e.target.value)
                    })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Meter
                </label>
                <select
                  value={currentText.meter}
                  onChange={(e) => setCurrentText({ ...currentText, meter: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select a meter</option>
                  {VEDIC_METERS.map(meter => (
                    <option key={meter} value={meter}>{meter}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={currentText.tags?.join(', ')}
                  onChange={(e) => setCurrentText({
                    ...currentText,
                    tags: e.target.value.split(',').map(tag => tag.trim())
                  })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="e.g., prayer, ritual, meditation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notes
                </label>
                <textarea
                  value={currentText.notes}
                  onChange={(e) => setCurrentText({ ...currentText, notes: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Add any additional notes or context"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={currentText.is_published}
                  onChange={(e) => setCurrentText({ ...currentText, is_published: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="is_published"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Publish this text
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {currentText.id ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}