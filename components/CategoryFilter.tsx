import Link from "next/link";
import { Category } from "@/lib/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
  currentSearch?: string;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  currentSearch,
}: CategoryFilterProps) {
  const createCategoryUrl = (slug?: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (currentSearch) params.set("search", currentSearch);
    const queryString = params.toString();
    return `/events${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={createCategoryUrl()}
        className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
          !selectedCategory
            ? "bg-brand-primary text-white shadow-md shadow-violet-900/20"
            : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
        }`}
      >
        All Categories
      </Link>
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.slug;
        return (
          <Link
            key={cat.id}
            href={createCategoryUrl(cat.slug)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              isActive
                ? "bg-brand-primary text-white shadow-md shadow-violet-900/20"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
}
