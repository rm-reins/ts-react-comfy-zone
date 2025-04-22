import { ProductsGrid } from "@/features/products";
import { trpc } from "@/trpc/trpc";
import { Filters } from "@/shared/ui";
import { useSearchParams } from "react-router-dom";
import { Product } from "@/trpc/types";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  // TRPC query for products
  const { data, isLoading, error } = trpc.product.getAll.useQuery();
  const products = (data || []) as Product[];

  // Get filters from URL
  const categories =
    searchParams.get("categories")?.split(",").filter(Boolean) || [];
  const colors = searchParams.get("colors")?.split(",").filter(Boolean) || [];
  const minPrice = Number(searchParams.get("minPrice") || 0);
  const maxPrice = Number(searchParams.get("maxPrice") || 10000);
  const companies =
    searchParams.get("companies")?.split(",").filter(Boolean) || [];

  // Update URL when filters change
  const updateFilters = (filterType: string, value: string[] | number[]) => {
    const newParams = new URLSearchParams(searchParams);

    if (filterType === "price") {
      const [min, max] = value as number[];
      console.log(`Price range: min=${min}, max=${max}, defaults: 0-10000`);

      if (min === 0 && max === 10000) {
        newParams.delete("minPrice");
        newParams.delete("maxPrice");
      } else {
        newParams.set("minPrice", String(min));
        newParams.set("maxPrice", String(max));
      }
    } else if (Array.isArray(value) && value.length > 0) {
      newParams.set(filterType, value.join(","));
    } else {
      newParams.delete(filterType);
    }

    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    setSearchParams(newParams);
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-white dark:bg-green-600 rounded-xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with filters */}
        <div className="md:w-64 bg-white dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 shadow-sm">
          <Filters
            products={products}
            initialCategories={categories}
            onCategoriesChange={(cats: string[]) =>
              updateFilters("categories", cats)
            }
            initialColors={colors}
            onColorsChange={(cols: string[]) => updateFilters("colors", cols)}
            initialPriceRange={[minPrice, maxPrice]}
            onPriceChange={(price: [number, number]) =>
              updateFilters("price", price)
            }
            initialCompanies={companies}
            onCompaniesChange={(comp: string[]) =>
              updateFilters("companies", comp)
            }
            onClearAll={clearAllFilters}
          />
        </div>

        {/* Main content with products */}
        <div className="flex-1 bg-white dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 shadow-sm">
          <ProductsGrid
            products={products}
            isLoading={isLoading}
            error={error ? new Error(error.message) : undefined}
            filters={{ categories, colors, minPrice, maxPrice, companies }}
          />
        </div>
      </div>
    </div>
  );
}

export default Products;
