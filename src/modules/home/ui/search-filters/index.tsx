import { Category } from "@/payload-types";
import Categories from "./Categories";
import SearchInput from "./SearchInput";

export default function SearchFilters({ categories }: { categories: Category[] }) {
  return (
    <div className="flex w-full flex-col gap-4 border-b px-4 py-8 lg:px-12">
      <SearchInput />
      
      <div className="hidden lg:block">
        <Categories categories={categories}/>
      </div>
    </div>
  );
}
