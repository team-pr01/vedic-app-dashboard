import { useState } from "react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { Newspaper } from "lucide-react";
import Filters from "../../components/Reusable/Filters/Filters";
import NewsCard from "../../components/NewsPage/NewsCard/NewsCard";
import AddNewsForm from "../../components/NewsPage/AddNewsForm/AddNewsForm";

export const dummyArticles = [
  {
    id: "1",
    title: "React 19 Release: What's New?",
    excerpt:
      "React 19 introduces several new features and performance improvements...",
    content:
      "<p>React 19 is here! This version brings in Server Components, automatic memoization, and many more enhancements that improve performance and developer experience.</p>",
    status: "published",
    featured_image: "https://i.ibb.co/djKSDr0/react-19-news.jpg",
    tags: ["React", "JavaScript", "Web Development"],
    created_at: "2025-05-15T10:00:00Z",
  },
  {
    id: "2",
    title: "TypeScript Tips Every Developer Should Know",
    excerpt:
      "Mastering TypeScript can significantly boost your productivity...",
    content:
      "<p>Learn essential TypeScript techniques such as type narrowing, generics, and utility types to write robust and scalable code.</p>",
    status: "draft",
    featured_image: "https://i.ibb.co/0cK9D4V/typescript-news.jpg",
    tags: ["TypeScript", "Tips", "Programming"],
    created_at: "2025-04-28T14:30:00Z",
  },
  {
    id: "3",
    title: "The Future of Frontend: Trends to Watch in 2025",
    excerpt: "",
    content:
      "<p>From AI-assisted coding to component-level edge caching, frontend development is rapidly evolving. Here's what you need to prepare for in 2025.</p>",
    status: "archived",
    featured_image: "https://i.ibb.co/ZKFRs0B/frontend-future.jpg",
    tags: ["Frontend", "Trends", "2025"],
    created_at: "2025-03-10T08:45:00Z",
  },
  {
    id: "4",
    title: "Dark Mode Best Practices in Modern UI Design",
    excerpt: "Designing for dark mode isn’t just inverting colors...",
    content:
      "<p>Dark mode enhances user experience in low-light environments. This guide covers contrast ratios, accessibility, and design systems.</p>",
    status: "published",
    featured_image: "https://i.ibb.co/5vwxK7R/dark-mode-ui.jpg",
    tags: ["UI Design", "Dark Mode", "UX"],
    created_at: "2025-06-01T18:20:00Z",
  },
];

const News = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedVeda, setSelectedVeda] = useState<any["veda_type"]>("rigveda");
  const [language, setLanguage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [id, setId] = useState("");
  const [mode, setMode] = useState<"add" | "edit">("add");
  //   const { data: singleVastuData } = useGetSingleVastuQuery(id);

  const categories = [
    { value: "sa", label: "Sanskrit" },
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "bn", label: "Bengali" },
    // ... add more languages
  ];
  return (
    <div>
      <PageHeader
        title="News Articles"
        buttonText="Add Article"
        icon={<Newspaper className="w-6 h-6 mr-2 text-white" />}
        onClick={() => {
          setShowForm(true);
        }}
      />

      <div className="flex flex-col gap-10">
        <Filters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedOption={language}
        setSelectedOption={setLanguage}
        options={categories}
        placeholder="Search texts..."
        selectLabel="Select Category"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyArticles.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            setId={setId}
            setMode={setMode}
            setShowForm={setShowForm}
          />
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <AddNewsForm
          showForm={showForm}
          setShowForm={setShowForm}
          //   defaultValues={singleVastuData?.data}
          mode={mode}
        />
      )}
      </div>
    </div>
  );
};

export default News;
