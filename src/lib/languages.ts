// List of supported languages for translations
export const SUPPORTED_LANGUAGES = [
  { code: 'sa', name: 'Sanskrit', script: 'Devanagari' },
  { code: 'en', name: 'English', script: 'Latin' },
  { code: 'hi', name: 'Hindi', script: 'Devanagari' },
  { code: 'bn', name: 'Bengali', script: 'Bengali' },
  { code: 'ta', name: 'Tamil', script: 'Tamil' },
  { code: 'te', name: 'Telugu', script: 'Telugu' },
  { code: 'kn', name: 'Kannada', script: 'Kannada' },
  { code: 'ml', name: 'Malayalam', script: 'Malayalam' },
  { code: 'gu', name: 'Gujarati', script: 'Gujarati' },
  { code: 'mr', name: 'Marathi', script: 'Devanagari' },
  { code: 'pa', name: 'Punjabi', script: 'Gurmukhi' },
  { code: 'or', name: 'Odia', script: 'Odia' },
  { code: 'as', name: 'Assamese', script: 'Bengali' },
  { code: 'ks', name: 'Kashmiri', script: 'Perso-Arabic' },
  { code: 'sd', name: 'Sindhi', script: 'Perso-Arabic' },
  { code: 'ur', name: 'Urdu', script: 'Perso-Arabic' },
  { code: 'ne', name: 'Nepali', script: 'Devanagari' },
  { code: 'si', name: 'Sinhala', script: 'Sinhala' },
  { code: 'my', name: 'Myanmar', script: 'Myanmar' },
  { code: 'km', name: 'Khmer', script: 'Khmer' },
  { code: 'th', name: 'Thai', script: 'Thai' },
  { code: 'lo', name: 'Lao', script: 'Lao' },
  { code: 'bo', name: 'Tibetan', script: 'Tibetan' },
  { code: 'dz', name: 'Dzongkha', script: 'Tibetan' },
  { code: 'pi', name: 'Pali', script: 'Various' }
];

export const TRANSLATION_TYPES = [
  { value: 'word_by_word', label: 'Word by Word' },
  { value: 'verse', label: 'Complete Verse' },
  { value: 'commentary', label: 'Commentary' }
];

export const VEDIC_METERS = [
  'Gayatri',
  'Ushnik',
  'Anushtup',
  'Brihati',
  'Pankti',
  'Trishtup',
  'Jagati',
  'Atijagatī',
  'Shakvari',
  'Atiśakvari',
  'Aṣṭi',
  'Atyaṣṭi',
  'Dhriti',
  'Atidhriti',
  'Kriti',
  'Prakṛti',
  'Ākṛti',
  'Vikṛti'
];

export const VEDA_TYPES = [
  {
    id: 'rigveda',
    name: 'Rigveda',
    description: 'The oldest of the four Vedas, containing hymns to the deities'
  },
  {
    id: 'samaveda',
    name: 'Samaveda',
    description: 'Collection of melodies and chants'
  },
  {
    id: 'yajurveda',
    name: 'Yajurveda',
    description: 'Prose mantras for liturgy and rituals'
  },
  {
    id: 'atharvaveda',
    name: 'Atharvaveda',
    description: 'Spells and incantations for everyday life'
  }
];

export const DEFAULT_MANTRAS = {
  rigveda: {
    original_text: 'ॐ भूर्भुवः स्वः । तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥',
    devanagari_text: 'ॐ भूर्भुवः स्वः । तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥',
    transliteration: 'oṃ bhūr bhuvaḥ svaḥ tát savitúr váreṇyaṃ bhárgo devásya dhīmahi dhíyo yó naḥ pracodáyāt',
    meter: 'Gayatri',
    tags: ['meditation', 'sun', 'enlightenment'],
    translations: {
      en: {
        text: 'We meditate on the glorious splendor of the Divine Light (of the Sun); May He illuminate our intellect.',
        translator: 'Max Müller'
      },
      hi: {
        text: 'हम उस देव के तेज का ध्यान करते हैं, जो सबको प्रेरणा देता है। वह हमारी बुद्धि को सन्मार्ग पर प्रेरित करे।',
        translator: 'डॉ. रामकृष्ण शर्मा'
      },
      bn: {
        text: 'আমরা সেই দেবতার তেজের ধ্যান করি, যিনি সকলকে প্রেরণা দেন। তিনি আমাদের বুদ্ধিকে সৎপথে চালিত করুন।',
        translator: 'সুনীতিকুমার চট্টোপাধ্যায়'
      }
    }
  },
  samaveda: {
    original_text: 'अग्न आ याहि वीतये गृणानो हव्यदातये । नि होता सत्सि बर्हिषि ॥',
    devanagari_text: 'अग्न आ याहि वीतये गृणानो हव्यदातये । नि होता सत्सि बर्हिषि ॥',
    transliteration: 'agna ā yāhi vītaye gṛṇāno havyadātaye | ni hotā satsi barhiṣi ||',
    meter: 'Gayatri',
    tags: ['agni', 'invocation', 'ritual'],
    translations: {
      en: {
        text: 'O Agni, come to our offerings, being praised as the giver of oblations; sit down as the priest on the sacred grass.',
        translator: 'Ralph T.H. Griffith'
      },
      hi: {
        text: 'हे अग्नि, हमारी स्तुति सुनकर यज्ञ में पधारो। हे होता, कुश के आसन पर विराजमान हों।',
        translator: 'पं. श्रीराम शर्मा आचार्य'
      },
      bn: {
        text: 'হে অগ্নি, আমাদের আহ্বানে আসুন, যজ্ঞে বসুন। হে হোতা, পবিত্র কুশাসনে আসন গ্রহণ করুন।',
        translator: 'গিরীন্দ্রশেখর বসু'
      }
    }
  },
  yajurveda: {
    original_text: 'इषे त्वोर्जे त्वा वायव स्थोपायव स्थ देवो वः सविता प्रार्पयतु श्रेष्ठतमाय कर्मणे ॥',
    devanagari_text: 'इषे त्वोर्जे त्वा वायव स्थोपायव स्थ देवो वः सविता प्रार्पयतु श्रेष्ठतमाय कर्मणे ॥',
    transliteration: 'iṣe tvorje tvā vāyava sthopāyava stha devo vaḥ savitā prārpayatu śreṣṭhatamāya karmaṇe',
    meter: 'Anushtup',
    tags: ['ritual', 'blessing', 'prayer'],
    translations: {
      en: {
        text: 'May the Lord of Creation (Savita) assign you for the most excellent work, O divine winds, you who are the source of nourishment and strength.',
        translator: 'Julius Eggeling'
      },
      hi: {
        text: 'हे वायु देव, आप अन्न और बल के लिए हैं। सविता देव आपको श्रेष्ठ कर्म के लिए प्रेरित करें।',
        translator: 'दयानन्द सरस्वती'
      },
      bn: {
        text: 'হে বায়ুদেব, আপনি অন্ন ও শক্তির উৎস। সবিতা দেব আপনাকে শ্রেষ্ঠ কর্মের জন্য প্রেরণা দিন।',
        translator: 'হরিদাস সিদ্ধান্তবাগীশ'
      }
    }
  },
  atharvaveda: {
    original_text: 'ये त्रिषप्ताः परियन्ति विश्वा रूपाणि बिभ्रतः । वाचस्पतिर्बला तेषां तन्वो अद्य दधातु मे ॥',
    devanagari_text: 'ये त्रिषप्ताः परियन्ति विश्वा रूपाणि बिभ्रतः । वाचस्पतिर्बला तेषां तन्वो अद्य दधातु मे ॥',
    transliteration: 'ye triṣaptāḥ pariyanti viśvā rūpāṇi bibhrataḥ | vācaspatirbalā teṣāṃ tanvo adya dadhātu me ||',
    meter: 'Anushtup',
    tags: ['healing', 'protection', 'blessing'],
    translations: {
      en: {
        text: 'The thrice-seven that go about, bearing all forms - may the Lord of Speech assign their powers to my body today.',
        translator: 'Maurice Bloomfield'
      },
      hi: {
        text: 'जो तीन बार सात शक्तियां सभी रूपों को धारण करती हैं, वाणी के स्वामी उनकी शक्तियों को आज मेरे शरीर में स्थापित करें।',
        translator: 'शांतिकुमार नानूराम व्यास'
      },
      bn: {
        text: 'যে তিনবার সাত শক্তি সমস্ত রূপ ধারণ করে, বাক্পতি তাদের শক্তি আজ আমার দেহে স্থাপন করুন।',
        translator: 'রমেশচন্দ্র দত্ত'
      }
    }
  }
};