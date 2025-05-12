import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Pencil,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/shared/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
} from "@/shared/ui";
import { useTranslation } from "@/i18n/useTranslation";

// Sample data
const users = [
  {
    id: "USR001",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "Active",
    lastActive: "2 hours ago",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JD",
  },
  {
    id: "USR002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Editor",
    status: "Active",
    lastActive: "1 day ago",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JS",
  },
  {
    id: "USR003",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "User",
    status: "Inactive",
    lastActive: "1 week ago",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MJ",
  },
  {
    id: "USR004",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "Editor",
    status: "Active",
    lastActive: "3 hours ago",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SW",
  },
  {
    id: "USR005",
    name: "David Brown",
    email: "david.brown@example.com",
    role: "User",
    status: "Active",
    lastActive: "Just now",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "DB",
  },
];

interface UsersTableProps {
  readOnly?: boolean;
}

function UsersTable({ readOnly = false }: UsersTableProps) {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("admin.users")}</CardTitle>
        {readOnly && (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 border-amber-200"
          >
            {t("admin.readOnlyMode")}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-sm mr-2">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder={t("admin.usersContent.search")}
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
                    {t("admin.usersContent.name")}
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
                    onClick={() => handleSort("role")}
                    size="sm"
                  >
                    {t("admin.usersContent.role")}
                    {sortField === "role" &&
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
                    onClick={() => handleSort("status")}
                    size="sm"
                  >
                    {t("admin.usersContent.status")}
                    {sortField === "status" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-2 h-4 w-4 inline" />
                      ) : (
                        <ChevronDown className="ml-2 h-4 w-4 inline" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead>{t("admin.usersContent.lastActive")}</TableHead>
                <TableHead className="text-right text-sm">
                  {t("admin.usersContent.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                        />
                        <AvatarFallback>{user.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "Active" ? "default" : "secondary"
                      }
                      className={
                        user.status === "Active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell className="text-right text-nowrap">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={readOnly}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={readOnly}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default UsersTable;
