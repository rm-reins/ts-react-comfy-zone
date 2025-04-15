import { useState } from "react";
import { Checkbox, Accordion } from "radix-ui";
import { Button } from "@/shared/ui";
import { X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { PriceRangeSlider } from "./FilterSlider";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

// TODO: Fix slider dragging

export default function Filters() {
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 4900]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  const categories: FilterOption[] = [
    { id: "living-room", label: "Living Room", count: 124 },
    { id: "bedroom", label: "Bedroom", count: 86 },
    { id: "kitchen", label: "Kitchen & Dining", count: 57 },
    { id: "office", label: "Office", count: 43 },
    { id: "outdoor", label: "Outdoor", count: 29 },
  ];

  const colors: FilterOption[] = [
    { id: "black", label: "Black" },
    { id: "white", label: "White" },
    { id: "gray", label: "Gray" },
    { id: "brown", label: "Brown" },
    { id: "beige", label: "Beige" },
    { id: "blue", label: "Blue" },
    { id: "green", label: "Green" },
  ];

  const materials: FilterOption[] = [
    { id: "wood", label: "Wood" },
    { id: "metal", label: "Metal" },
    { id: "glass", label: "Glass" },
    { id: "fabric", label: "Fabric" },
    { id: "leather", label: "Leather" },
    { id: "marble", label: "Marble" },
    { id: "rattan", label: "Rattan" },
  ];

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleColor = (colorId: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorId)
        ? prev.filter((id) => id !== colorId)
        : [...prev, colorId]
    );
  };

  const toggleMaterial = (materialId: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialId)
        ? prev.filter((id) => id !== materialId)
        : [...prev, materialId]
    );
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setPriceRange([100, 4900]);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedColors.length > 0 ||
    selectedMaterials.length > 0 ||
    priceRange[0] > 100 ||
    priceRange[1] < 4900;

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
        defaultValue={["categories", "price", "colors"]}
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
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox.Root
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
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
                      className="text-sm font-medium leading-none cursor-pointer"
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
                min={0}
                max={5000}
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
              {colors.map((color) => (
                <div
                  key={color.id}
                  className="flex items-center"
                >
                  <Checkbox.Root
                    id={`color-${color.id}`}
                    checked={selectedColors.includes(color.id)}
                    onCheckedChange={() => toggleColor(color.id)}
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
          value="materials"
          className="border-b pb-4"
        >
          <Accordion.Header className="w-full">
            <Accordion.Trigger className="flex w-full items-center justify-between py-2 text-base font-medium">
              Materials
              <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-in-out data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pt-2 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="space-y-3">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center"
                >
                  <Checkbox.Root
                    id={`material-${material.id}`}
                    checked={selectedMaterials.includes(material.id)}
                    onCheckedChange={() => toggleMaterial(material.id)}
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
                    htmlFor={`material-${material.id}`}
                    className="ml-2 text-sm font-medium cursor-pointer"
                  >
                    {material.label}
                  </label>
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
