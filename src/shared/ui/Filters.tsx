import { useState, useEffect } from "react";
import { Checkbox, Accordion } from "radix-ui";
import { Button } from "@/shared/ui";
import { X, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { PriceRangeSlider } from "./FilterSlider";
import { Product } from "@/trpc/types";
import { useTranslation } from "@/i18n/useTranslation";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FiltersProps {
  products: Product[];
  initialCategories?: string[];
  initialColors?: string[];
  initialPriceRange?: [number, number];
  initialCompanies?: string[];
  onCategoriesChange?: (categories: string[]) => void;
  onColorsChange?: (colors: string[]) => void;
  onPriceChange?: (priceRange: [number, number]) => void;
  onCompaniesChange?: (companies: string[]) => void;
  onClearAll?: () => void;
}

export default function Filters({
  products,
  initialCategories = [],
  initialColors = [],
  initialPriceRange,
  initialCompanies = [],
  onCategoriesChange,
  onColorsChange,
  onPriceChange,
  onCompaniesChange,
  onClearAll,
}: FiltersProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { t } = useTranslation();

  // Use local state that syncs with external values
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategories);
  const [selectedColors, setSelectedColors] = useState<string[]>(initialColors);
  const [selectedCompanies, setSelectedCompanies] =
    useState<string[]>(initialCompanies);

  // Calculate price range from products
  const minPrice = products.length
    ? Math.floor(
        products.reduce((min, p) => Math.min(min, p.price), Infinity) / 50
      ) * 50
    : 0;

  const maxPrice = products.length
    ? Math.ceil(products.reduce((max, p) => Math.max(max, p.price), 0) / 50) *
      50
    : 5000;

  const safeMinPrice = !isFinite(minPrice) ? 0 : minPrice;
  const safeMaxPrice = !isFinite(maxPrice) ? 5000 : maxPrice;

  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialPriceRange || [safeMinPrice, safeMaxPrice]
  );

  // Sync local state with external props when they change
  useEffect(() => {
    setSelectedCategories(initialCategories);
  }, [initialCategories]);

  useEffect(() => {
    setSelectedColors(initialColors);
  }, [initialColors]);

  useEffect(() => {
    if (initialPriceRange) {
      const [min, max] = initialPriceRange;
      setPriceRange([
        Math.max(safeMinPrice, Math.min(min, safeMaxPrice)),
        Math.min(safeMaxPrice, Math.max(max, safeMinPrice)),
      ]);
    }
  }, [initialPriceRange, safeMinPrice, safeMaxPrice]);

  useEffect(() => {
    setSelectedCompanies(initialCompanies);
  }, [initialCompanies]);

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
    e?.stopPropagation();

    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(newCategories);
    onCategoriesChange?.(newCategories);
  };

  const toggleColor = (colorId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();

    const newColors = selectedColors.includes(colorId)
      ? selectedColors.filter((id) => id !== colorId)
      : [...selectedColors, colorId];

    setSelectedColors(newColors);
    onColorsChange?.(newColors);
  };

  const toggleCompany = (companyId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();

    const newCompanies = selectedCompanies.includes(companyId)
      ? selectedCompanies.filter((id) => id !== companyId)
      : [...selectedCompanies, companyId];

    setSelectedCompanies(newCompanies);
    onCompaniesChange?.(newCompanies);
  };

  const handlePriceChange = (value: [number, number]) => {
    const [min, max] = value;
    const newMin = Math.max(safeMinPrice, Math.min(min, safeMaxPrice));
    const newMax = Math.min(safeMaxPrice, Math.max(max, safeMinPrice));
    setPriceRange([newMin, newMax]);
    onPriceChange?.([newMin, newMax]);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedCompanies([]);
    setPriceRange([safeMinPrice, safeMaxPrice]);

    if (onClearAll) {
      onClearAll();
      return;
    }
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedColors.length > 0 ||
    selectedCompanies.length > 0 ||
    priceRange[0] > safeMinPrice ||
    priceRange[1] < safeMaxPrice;

  // Add a helper function to determine if a color is bright
  const isBrightColor = (hexColor: string): boolean => {
    // For named colors or non-hex values, default to false
    if (!hexColor.startsWith("#")) return false;

    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate brightness using YIQ formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 175;
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium">{t("common.filters")}</h3>
        {hasActiveFilters && (
          <button
            id="clear-all-filters"
            type="button"
            onClick={clearAllFilters}
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            {t("products.clearAll")}
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
              {t("products.categories")}
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
              {t("products.priceRange")}
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
              {t("products.colors")}
              <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-in-out data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pt-2 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="flex flex-wrap gap-2 pt-2">
              {colorOptions.map((color) => {
                const isSelected = selectedColors.includes(color.id);
                const isBright = isBrightColor(color.label);

                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleColor(color.id);
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border transition-opacity ${
                      isSelected ? "opacity-100" : "opacity-60"
                    }`}
                    style={{ backgroundColor: color.label }}
                    title={color.label}
                  >
                    {isSelected && (
                      <Check
                        className={`h-4 w-4 ${
                          isBright ? "text-gray-800" : "text-white"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item
          value="companies"
          className="border-b pb-4"
        >
          <Accordion.Header className="w-full">
            <Accordion.Trigger className="flex w-full items-center justify-between py-2 text-base font-medium">
              {t("products.companies")}
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
          <span>{t("common.filters")}</span>
          <SlidersHorizontal className="h-4 w-4" />
        </Button>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">{t("common.filters")}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="rounded-full h-8 w-8"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">{t("common.close")}</span>
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
