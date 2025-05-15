import { useState } from "react";
import { Plus, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Button,
  Textarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Badge,
} from "@/shared/ui";
import { useTranslation } from "@/i18n/useTranslation";
import { trpc } from "@/trpc/trpc";

interface LanguageOption {
  id: "enUS" | "deDE" | "ruRU";
  label: string;
}

const productFormSchema = z.object({
  name: z.object({
    enUS: z.string().min(3),
    deDE: z.string().min(3),
    ruRU: z.string().min(3),
  }),
  description: z.object({
    enUS: z.string().min(10),
    deDE: z.string().min(10),
    ruRU: z.string().min(10),
  }),
  images: z.array(z.string()),
  category: z.enum([
    "office",
    "kitchen",
    "bedroom",
    "homeDecor",
    "storage",
    "textiles",
    "other",
  ]),
  price: z.coerce.number().positive(),
  company: z.string().min(1),
  colors: z.array(z.string()),
  inventory: z.coerce.number().int().nonnegative(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// Predefined color options
const COLOR_OPTIONS = [
  { value: "#000000", label: "Black" },
  { value: "#FFFFFF", label: "White" },
  { value: "#FF0000", label: "Red" },
  { value: "#00FF00", label: "Green" },
  { value: "#0000FF", label: "Blue" },
  { value: "#FFFF00", label: "Yellow" },
  { value: "#FFA500", label: "Orange" },
  { value: "#800080", label: "Purple" },
  { value: "#A52A2A", label: "Brown" },
  { value: "#808080", label: "Gray" },
  { value: "#FFC0CB", label: "Pink" },
  { value: "#40E0D0", label: "Turquoise" },
];

export function AddProductModal({ readOnly }: { readOnly?: boolean }) {
  const [open, setOpen] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<
    "enUS" | "deDE" | "ruRU"
  >("enUS");
  const [descriptionLanguage, setDescriptionLanguage] = useState<
    "enUS" | "deDE" | "ruRU"
  >("enUS");
  const [images, setImages] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const uploadImage = trpc.product.uploadImage.useMutation();
  const createProduct = trpc.product.create.useMutation();

  const { t } = useTranslation();

  const PRODUCT_CATEGORIES = [
    { id: "office", name: t("products.categoryType.office") },
    { id: "kitchen", name: t("products.categoryType.kitchen") },
    { id: "bedroom", name: t("products.categoryType.bedroom") },
    { id: "homeDecor", name: t("products.categoryType.homeDecor") },
    { id: "storage", name: t("products.categoryType.storage") },
    { id: "textiles", name: t("products.categoryType.textiles") },
    { id: "other", name: t("products.categoryType.other") },
  ];

  const languages: LanguageOption[] = [
    { id: "enUS", label: "English" },
    { id: "deDE", label: "Deutsch" },
    { id: "ruRU", label: "Русский" },
  ];

  // Initialize form with default values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: {
        enUS: "",
        deDE: "",
        ruRU: "",
      },
      description: {
        enUS: "",
        deDE: "",
        ruRU: "",
      },
      images: [],
      category: "other",
      price: 0,
      company: "",
      colors: [],
      inventory: 0,
    },
  });

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => reject(error);

      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        const fileArray = Array.from(e.target.files);

        for (const file of fileArray) {
          const base64Image = await convertToBase64(file);

          const imageUrl = await uploadImage.mutateAsync({
            image: base64Image,
            folder: "products",
          });

          setImages((prev) => [...prev, imageUrl]);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  async function onSubmit(data: ProductFormValues) {
    console.log("Form submitted:", { ...data });

    createProduct.mutate({
      ...data,
      images: images,
    });

    setOpen(false);
    setImages([]);
    form.reset();
  }

  const addColor = (color: { value: string; label: string }) => {
    const currentColors = form.getValues("colors") || [];
    if (!currentColors.includes(color.value)) {
      form.setValue("colors", [...currentColors, color.value]);
    }
    setShowColorPicker(false);
  };

  const removeColor = (colorToRemove: string) => {
    const currentColors = form.getValues("colors") || [];
    form.setValue(
      "colors",
      currentColors.filter((color) => color !== colorToRemove)
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.productsContent.addProduct")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("admin.productsContent.createProduct")}</DialogTitle>
          <DialogDescription>
            {t("admin.productsContent.addProductDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Image Upload Section */}
            <div className="rounded-xl border p-4">
              <div className="grid grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative rounded-xl border bg-muted/20"
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Product image ${index + 1}`}
                      className="h-32 w-full rounded-xl object-cover"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-6 w-6 rounded-full bg-background/80"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">
                        {t("admin.productsContent.removeImage")}
                      </span>
                    </Button>
                  </div>
                ))}
                <Label
                  htmlFor="image-upload"
                  className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground hover:bg-muted/50"
                >
                  <Upload className="mb-2 h-6 w-6" />
                  {t("admin.productsContent.addImage")}
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </Label>
              </div>
            </div>

            {/* Product Name with Language Tabs */}
            <div className="space-y-2">
              <Tabs
                value={activeLanguage}
                onValueChange={(value) =>
                  setActiveLanguage(value as "enUS" | "deDE" | "ruRU")
                }
              >
                <TabsList className="mb-2">
                  {languages.map((lang) => (
                    <TabsTrigger
                      key={lang.id}
                      value={lang.id}
                    >
                      {lang.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {languages.map((lang) => (
                  <TabsContent
                    key={lang.id}
                    value={lang.id}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name={`name.${lang.id}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="pl-3">
                            {t("admin.productsContent.productName")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t(
                                "admin.productsContent.productNamePlaceholder"
                              )}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="pl-3">
                            {t("admin.productsContent.productNameError")}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Product Description with Language Tabs */}
            <div className="space-y-2">
              <Tabs
                value={descriptionLanguage}
                onValueChange={(value) =>
                  setDescriptionLanguage(value as "enUS" | "deDE" | "ruRU")
                }
              >
                <TabsList className="mb-2">
                  {languages.map((lang) => (
                    <TabsTrigger
                      key={lang.id}
                      value={lang.id}
                    >
                      {lang.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {languages.map((lang) => (
                  <TabsContent
                    key={lang.id}
                    value={lang.id}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name={`description.${lang.id}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="pl-3">
                            {t("admin.productsContent.productDescription")}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t(
                                "admin.productsContent.productDescriptionPlaceholder"
                              )}
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="pl-3">
                            {t("admin.productsContent.productDescriptionError")}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="pl-3">
                      {t("admin.productsContent.category")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "admin.productsContent.selectCategory"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="pl-3">
                      {t("admin.productsContent.company")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("admin.productsContent.company")}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="pl-3">
                      {t("admin.productsContent.price")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inventory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="pl-3">
                      {t("admin.productsContent.inventory")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        type="number"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="colors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="pl-3">
                      {t("admin.productsContent.color")}
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((color, index) => (
                            <Badge
                              key={index}
                              className="flex items-center gap-1 px-3 py-1 border-1 border-green-100"
                              style={{ backgroundColor: color }}
                            >
                              <span
                                className={
                                  color === "#FFFFFF" || color === "#FFFF00"
                                    ? "text-black"
                                    : "text-white"
                                }
                              >
                                {COLOR_OPTIONS.find(
                                  (opt) => opt.value === color
                                )?.label || color}
                              </span>
                              <X
                                className={
                                  color === "#FFFFFF" || color === "#FFFF00"
                                    ? "text-black h-3 w-3 cursor-pointer"
                                    : "text-white h-3 w-3 cursor-pointer"
                                }
                                onClick={() => removeColor(color)}
                              />
                            </Badge>
                          ))}
                        </div>
                        <div className="relative">
                          {showColorPicker && (
                            <div className="absolute z-10 bottom-0.5 w-64 rounded-md border bg-background p-3 shadow-lg">
                              <div className="grid grid-cols-4 gap-2">
                                {COLOR_OPTIONS.map((color) => (
                                  <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => addColor(color)}
                                    className="h-8 w-8 rounded-full border"
                                    style={{ backgroundColor: color.value }}
                                    title={color.label}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-1"
                            onClick={() => setShowColorPicker(!showColorPicker)}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            {t("admin.productsContent.addColor") || "Add Color"}
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button
                disabled={readOnly}
                type="submit"
              >
                {t("common.submit")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
