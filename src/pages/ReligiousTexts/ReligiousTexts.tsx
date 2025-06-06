import { Book } from "lucide-react";
import { ReligiousTextManager } from "../../components/ReligiousTextManager";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { useState } from "react";
import ReligiousTextsFilters from "../../components/ReligiousTextsPage/ReligiousTextsFilters/ReligiousTextsFilters";
import { ReligiousTextCard } from "../../components/ReligiousTextsPage/ReligiousTextCard/ReligiousTextCard";

export const VEDA_TYPES = [
  {
    id: "rigveda",
    name: "Rigveda",
    description:
      "The oldest of the four Vedas, containing hymns to the deities",
  },
  {
    id: "samaveda",
    name: "Samaveda",
    description: "Collection of melodies and chants",
  },
  {
    id: "yajurveda",
    name: "Yajurveda",
    description: "Prose mantras for liturgy and rituals",
  },
  {
    id: "atharvaveda",
    name: "Atharvaveda",
    description: "Spells and incantations for everyday life",
  },
];

export const dummyTexts = [
  {
    _id: '1',
    veda_type: 'rigveda',
    mandala_number: 1,
    sukta_number: 2,
    verse_number: 3,
    is_published: true,
    original_text: 'अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् ।',
    devanagari_text: 'अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् ।',
    transliteration: 'agnim īḷe purohitaṃ yajñasya devam ṛtvijam',
    translations: [
      {
        language_code: 'en',
        translation: 'I praise Agni, the chosen priest, god of the sacrifice...',
        translator: 'Ralph Griffith',
        is_verified: true,
      },
      {
        language_code: 'hi',
        translation: 'मैं अग्नि की स्तुति करता हूँ, जो यज्ञ का पुरोहित है...',
        translator: 'Dayanand Saraswati',
        is_verified: false,
      },
    ],
  },
  {
    _id: '2',
    veda_type: 'samaveda',
    book_number: 1,
    chapter_number: 1,
    verse_number: 1,
    is_published: false,
    original_text: 'ओम् सह नाववतु सह नौ भुनक्तु',
    devanagari_text: 'ॐ सह नाववतु। सह नौ भुनक्तु।',
    transliteration: 'om saha nāv avatu, saha nau bhunaktu',
    translations: [
      {
        language_code: 'en',
        translation: 'May He protect us both. May He nourish us both.',
        translator: 'Swami Chinmayananda',
        is_verified: true,
      },
    ],
  },
];



const ReligiousTexts = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedVeda, setSelectedVeda] = useState<any["veda_type"]>("rigveda");
  const [language, setLanguage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [id, setId] = useState("");
  const [mode, setMode] = useState<"add" | "edit">("add");

  return (
    <div>
      <PageHeader
        title="Vedic Texts Management"
        buttonText="Add New Text"
        icon={<Book className="h-6 w-6 mr-2 text-blue-500" />}
        onClick={() => {
          setShowForm(true);
        }}
      />

      <div className="grid grid-cols-4 gap-4">
        {VEDA_TYPES.map((veda) => (
          <button
            key={veda.id}
            onClick={() => setSelectedVeda(veda.id as any["veda_type"])}
            className={`p-4 rounded-lg text-center transition-colors ${
              selectedVeda === veda.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <h3 className="text-lg font-semibold">{veda.name}</h3>
            <p className="text-sm mt-2 opacity-80">{veda.description}</p>
          </button>
        ))}
      </div>

      <ReligiousTextsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setLanguage={setLanguage}
      />

      {dummyTexts.map((text) => (
        <ReligiousTextCard
          key={text._id}
          text={text}
          setId={setId}
          setMode={setMode}
          setShowForm={setShowForm}
        />
      ))}
      <ReligiousTextManager />
    </div>
  );
};

export default ReligiousTexts;
