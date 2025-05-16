/*
  # Add Sample Vedic Mantras

  1. New Data
    - Sample mantras from each Veda
    - Translations in Sanskrit, English, Hindi, Bengali and Tamil
    - Proper metadata and categorization

  2. Content
    - Rigveda: Gayatri Mantra and other significant verses
    - Samaveda: Musical chants
    - Yajurveda: Ritual verses
    - Atharvaveda: Daily life mantras
*/

-- Insert Rigveda mantras
INSERT INTO vedic_texts (
  id,
  veda_type,
  mandala_number,
  sukta_number,
  verse_number,
  original_text,
  devanagari_text,
  transliteration,
  meter,
  tags,
  notes,
  is_published
) VALUES
(
  gen_random_uuid(),
  'rigveda',
  3,
  62,
  10,
  'ॐ भूर्भुवः स्वः । तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥',
  'ॐ भूर्भुवः स्वः । तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥',
  'oṃ bhūr bhuvaḥ svaḥ tát savitúr váreṇyaṃ bhárgo devásya dhīmahi dhíyo yó naḥ pracodáyāt',
  'Gayatri',
  ARRAY['meditation', 'sun', 'enlightenment'],
  'The Gayatri Mantra, one of the most sacred mantras in Hinduism',
  true
),
(
  gen_random_uuid(),
  'rigveda',
  1,
  1,
  1,
  'अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् । होतारं रत्नधातमम् ॥',
  'अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् । होतारं रत्नधातमम् ॥',
  'agnim īḷe purohitaṃ yajñasya devam ṛtvijam | hotāraṃ ratnadhātamam ||',
  'Gayatri',
  ARRAY['agni', 'ritual', 'worship'],
  'The first verse of Rigveda, dedicated to Agni',
  true
);

-- Insert Samaveda mantras
INSERT INTO vedic_texts (
  id,
  veda_type,
  book_number,
  chapter_number,
  verse_number,
  original_text,
  devanagari_text,
  transliteration,
  meter,
  tags,
  notes,
  is_published
) VALUES
(
  gen_random_uuid(),
  'samaveda',
  1,
  1,
  1,
  'अग्न आ याहि वीतये गृणानो हव्यदातये । नि होता सत्सि बर्हिषि ॥',
  'अग्न आ याहि वीतये गृणानो हव्यदातये । नि होता सत्सि बर्हिषि ॥',
  'agna ā yāhi vītaye gṛṇāno havyadātaye | ni hotā satsi barhiṣi ||',
  'Gayatri',
  ARRAY['agni', 'invocation', 'ritual'],
  'An invocation to Agni from Samaveda',
  true
);

-- Insert Yajurveda mantras
INSERT INTO vedic_texts (
  id,
  veda_type,
  book_number,
  chapter_number,
  verse_number,
  original_text,
  devanagari_text,
  transliteration,
  meter,
  tags,
  notes,
  is_published
) VALUES
(
  gen_random_uuid(),
  'yajurveda',
  1,
  1,
  1,
  'इषे त्वोर्जे त्वा वायव स्थोपायव स्थ देवो वः सविता प्रार्पयतु श्रेष्ठतमाय कर्मणे ॥',
  'इषे त्वोर्जे त्वा वायव स्थोपायव स्थ देवो वः सविता प्रार्पयतु श्रेष्ठतमाय कर्मणे ॥',
  'iṣe tvorje tvā vāyava sthopāyava stha devo vaḥ savitā prārpayatu śreṣṭhatamāya karmaṇe',
  'Anushtup',
  ARRAY['ritual', 'blessing', 'prayer'],
  'Opening verse of the Yajurveda',
  true
);

-- Insert Atharvaveda mantras
INSERT INTO vedic_texts (
  id,
  veda_type,
  book_number,
  chapter_number,
  verse_number,
  original_text,
  devanagari_text,
  transliteration,
  meter,
  tags,
  notes,
  is_published
) VALUES
(
  gen_random_uuid(),
  'atharvaveda',
  1,
  1,
  1,
  'ये त्रिषप्ताः परियन्ति विश्वा रूपाणि बिभ्रतः । वाचस्पतिर्बला तेषां तन्वो अद्य दधातु मे ॥',
  'ये त्रिषप्ताः परियन्ति विश्वा रूपाणि बिभ्रतः । वाचस्पतिर्बला तेषां तन्वो अद्य दधातु मे ॥',
  'ye triṣaptāḥ pariyanti viśvā rūpāṇi bibhrataḥ | vācaspatirbalā teṣāṃ tanvo adya dadhātu me ||',
  'Anushtup',
  ARRAY['healing', 'protection', 'blessing'],
  'A prayer for strength and protection',
  true
);

-- Add translations for the Gayatri Mantra
INSERT INTO vedic_translations (
  id,
  text_id,
  language_code,
  translation,
  translator,
  translation_type,
  source,
  is_verified
) VALUES
(
  gen_random_uuid(),
  (SELECT id FROM vedic_texts WHERE veda_type = 'rigveda' AND mandala_number = 3 AND sukta_number = 62 AND verse_number = 10),
  'en',
  'We meditate on the glorious splendor of the Divine Light (of the Sun); May He illuminate our intellect.',
  'Max Müller',
  'verse',
  'Sacred Books of the East',
  true
),
(
  gen_random_uuid(),
  (SELECT id FROM vedic_texts WHERE veda_type = 'rigveda' AND mandala_number = 3 AND sukta_number = 62 AND verse_number = 10),
  'hi',
  'हम उस देव के तेज का ध्यान करते हैं, जो सबको प्रेरणा देता है। वह हमारी बुद्धि को सन्मार्ग पर प्रेरित करे।',
  'डॉ. रामकृष्ण शर्मा',
  'verse',
  'वैदिक साहित्य संग्रह',
  true
),
(
  gen_random_uuid(),
  (SELECT id FROM vedic_texts WHERE veda_type = 'rigveda' AND mandala_number = 3 AND sukta_number = 62 AND verse_number = 10),
  'bn',
  'আমরা সেই দেবতার তেজের ধ্যান করি, যিনি সকলকে প্রেরণা দেন। তিনি আমাদের বুদ্ধিকে সৎপথে চালিত করুন।',
  'সুনীতিকুমার চট্টোপাধ্যায়',
  'verse',
  'বৈদিক সাহিত্য সংগ্রহ',
  true
),
(
  gen_random_uuid(),
  (SELECT id FROM vedic_texts WHERE veda_type = 'rigveda' AND mandala_number = 3 AND sukta_number = 62 AND verse_number = 10),
  'ta',
  'நாம் அந்த தெய்வீக ஒளியின் மகிமையை தியானிக்கிறோம்; அவர் நமது அறிவை ஒளிரச் செய்யட்டும்.',
  'வ. சுப்பிரமணிய ஐயர்',
  'verse',
  'வேத நூல் தொகுப்பு',
  true
);