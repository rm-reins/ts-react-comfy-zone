import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui";
import { trpc } from "@/trpc/trpc";
import { useTranslation } from "@/i18n/useTranslation";
import { Product } from "@/trpc/types";

function ProductsTable() {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const { data: products = [] } = trpc.product.getAll.useQuery<Product[]>();
  const { t, language } = useTranslation();

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredProducts = products?.filter(
    (product) =>
      product?.name[language]
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      product?.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = filteredProducts
    ? [...filteredProducts].sort((a, b) => {
        if (sortField === "name") {
          const aValue = a.name[language];
          const bValue = b.name[language];
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        const aValue = a[sortField as keyof typeof a];
        const bValue = b[sortField as keyof typeof b];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        return 0;
      })
    : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("admin.products")}</CardTitle>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.productsContent.addProduct")}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-sm mr-2">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder={t("admin.productsContent.search")}
              className="pl-8 w-full rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {t("common.filter")}
          </Button>
        </div>
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium hover:bg-transparent"
                    onClick={() => handleSort("name")}
                    size="sm"
                  >
                    {t("admin.productsContent.name")}
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-2 h-4 w-4 inline" />
                      ) : (
                        <ChevronDown className="ml-2 h-4 w-4 inline" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 font-medium hover:bg-transparent"
                    onClick={() => handleSort("category")}
                    size="sm"
                  >
                    {t("admin.productsContent.category")}
                    {sortField === "category" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-2 h-4 w-4 inline" />
                      ) : (
                        <ChevronDown className="ml-2 h-4 w-4 inline" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 font-medium hover:bg-transparent"
                    onClick={() => handleSort("price")}
                    size="sm"
                  >
                    {t("admin.productsContent.price")}
                    {sortField === "price" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-2 h-4 w-4 inline" />
                      ) : (
                        <ChevronDown className="ml-2 h-4 w-4 inline" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 font-medium hover:bg-transparent"
                    size="sm"
                    onClick={() => handleSort("inventory")}
                  >
                    {t("admin.productsContent.inventory")}
                    {sortField === "inventory" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-2 h-4 w-4 inline" />
                      ) : (
                        <ChevronDown className="ml-2 h-4 w-4 inline" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead className="text-right text-sm">
                  {t("admin.productsContent.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-medium">{product.name[language]}</p>
                      <p className="text-xs text-muted-foreground">
                        #{product._id}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {t(`products.categoryType.${product.category}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {product.price.toFixed(2)} €
                  </TableCell>
                  <TableCell className="text-sm">{product.inventory}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          {t("admin.productsContent.viewDetails")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {t("admin.productsContent.editProduct")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          {t("admin.productsContent.deleteProduct")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductsTable;
