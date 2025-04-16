import { useState } from "react";
import { Checkbox, Accordion } from "radix-ui";
import { Button } from "@/shared/ui";
import { X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { PriceRangeSlider } from "./FilterSlider";
import { Product } from "@/trpc/types";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FiltersProps {
  products: Product[];
}

export default function Filters({ products }: FiltersProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const minPrice = products.length
    ? products.reduce((min, p) => Math.min(min, p.price), Infinity)
    : 0;

  const maxPrice = products.length
    ? products.reduce((max, p) => Math.max(max, p.price), 0)
    : 5000;

  const safeMinPrice = !isFinite(minPrice) ? 0 : Math.floor(minPrice / 50) * 50;
  const safeMaxPrice = !isFinite(maxPrice)
    ? 5000
    : Math.ceil(maxPrice / 50) * 50;

  const [priceRange, setPriceRange] = useState<[number, number]>([
    safeMinPrice,
    safeMaxPrice,
  ]);

  // Transform string arrays into FilterOption arrays
  const categoryOptions: FilterOption[] = [
    ...new Set(products.map((product) => product.category)),
  ].map((category) => {
    const count = products.filter(
      (product) => product.category === category
    ).length;
    return {
      id: category.toLowerCase().replace(/\s+/g, "-"),
      label: category,
      count,
    };
  });

  const colorOptions: FilterOption[] = [
    ...new Set(products.flatMap((product) => product.colors)),
  ].map((color) => ({
    id: color.toLowerCase().replace(/\s+/g, "-"),
    label: color,
  }));

  const companyOptions: FilterOption[] = [
    ...new Set(products.map((product) => product.company)),
  ].map((company) => {
    const count = products.filter(
      (product) => product.company === company
    ).length;
    return {
      id: company.toLowerCase().replace(/\s+/g, "-"),
      label: company,
      count,
    };
  });

  const toggleCategory = (categoryId: string, e?: React.MouseEvent) => {
    // Prevent event from bubbling up to accordion
    if (e) {
      e.stopPropagation();
    }

    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleColor = (colorId: string, e?: React.MouseEvent) => {
    // Prevent event from bubbling up to accordion
    if (e) {
      e.stopPropagation();
    }

    setSelectedColors((prev) =>
      prev.includes(colorId)
        ? prev.filter((id) => id !== colorId)
        : [...prev, colorId]
    );
  };

  const toggleCompany = (companyId: string, e?: React.MouseEvent) => {
    // Prevent event from bubbling up to accordion
    if (e) {
      e.stopPropagation();
    }

    setSelectedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedCompanies([]);
    setPriceRange([safeMinPrice, safeMaxPrice]);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedColors.length > 0 ||
    selectedCompanies.length > 0 ||
    priceRange[0] > safeMinPrice ||
    priceRange[1] < safeMaxPrice;

  const FiltersContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <Accordion.Root
        type="multiple"
        defaultValue={["categories", "price", "colors", "companies"]}
        className="w-full space-y-4"
      >
        <Accordion.Item
          value="categories"
          className="border-b pb-4"
        >
          <Accordion.Header className="w-full">
            <Accordion.Trigger className="flex w-full items-center justify-between py-2 text-base font-medium">
              Categories
              <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-in-out data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pt-2 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="space-y-3">
              {categoryOptions.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox.Root
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => {
                        // Stop propagation to prevent accordion from toggling
                        const event = window.event as MouseEvent;
                        event.stopPropagation();
                        toggleCategory(category.id);
                      }}
                      className="size-4 border border-input rounded flex items-center justify-center data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    >
                      <Checkbox.Indicator>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-medium leading-none cursor-pointer capitalize"
                    >
                      {category.label}
                    </label>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({category.count})
                  </span>
                </div>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item
          value="price"
          className="border-b pb-4"
        >
          <Accordion.Header className="w-full">
            <Accordion.Trigger className="flex w-full items-center justify-between py-2 text-base font-medium">
              Price Range
              <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-in-out data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pt-2 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="pt-1">
              <PriceRangeSlider
                min={safeMinPrice}
                max={safeMaxPrice}
                step={50}
                value={priceRange}
                onChange={handlePriceChange}
              />
            </div>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item
          value="colors"
          className="border-b pb-4"
        >
          <Accordion.Header className="w-full">
            <Accordion.Trigger className="flex w-full items-center justify-between py-2 text-base font-medium">
              Colors
              <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-in-out data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pt-2 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="space-y-3">
              {colorOptions.map((color) => (
                <div
                  key={color.id}
                  className="flex items-center"
                >
                  <Checkbox.Root
                    id={`color-${color.id}`}
                    checked={selectedColors.includes(color.id)}
                    onCheckedChange={() => {
                      // Stop propagation to prevent accordion from toggling
                      const event = window.event as MouseEvent;
                      event.stopPropagation();
                      toggleColor(color.id);
                    }}
                    className="size-4 border border-input rounded flex items-center justify-center data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  >
                    <Checkbox.Indicator>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label
                    htmlFor={`color-${color.id}`}
                    className="ml-2 text-sm font-medium cursor-pointer"
                  >
                    {color.label}
                  </label>
                </div>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item
          value="companies"
          className="border-b pb-4"
        >
          <Accordion.Header className="w-full">
            <Accordion.Trigger className="flex w-full items-center justify-between py-2 text-base font-medium">
              Companies
              <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-in-out data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pt-2 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="space-y-3">
              {companyOptions.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox.Root
                      id={`company-${company.id}`}
                      checked={selectedCompanies.includes(company.id)}
                      onCheckedChange={() => {
                        // Stop propagation to prevent accordion from toggling
                        const event = window.event as MouseEvent;
                        event.stopPropagation();
                        toggleCompany(company.id);
                      }}
                      className="size-4 border border-input rounded flex items-center justify-center data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    >
                      <Checkbox.Indicator>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <label
                      htmlFor={`company-${company.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {company.label}
                    </label>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({company.count})
                  </span>
                </div>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );

  return (
    <>
      {/* Desktop filters */}
      <div className="hidden md:block">
        <FiltersContent />
      </div>

      {/* Mobile filters */}
      <div className="md:hidden">
        <Button
          variant="outline"
          className="w-full flex items-center justify-between"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <span>Filters</span>
          <SlidersHorizontal className="h-4 w-4" />
        </Button>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="rounded-full h-8 w-8"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <div className="overflow-y-auto h-[calc(100vh-10rem)]">
                <FiltersContent />
              </div>
              <div className="mt-6 flex gap-3 sticky bottom-0 bg-background pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
