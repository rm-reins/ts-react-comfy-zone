import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTranslation } from "@/i18n/useTranslation";

const generateData = () => {
  const data = [];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonth = new Date().getMonth();

  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonth - 11 + i) % 12;
    data.push({
      name: months[monthIndex],
      revenue: Math.floor(Math.random() * 5000) + 1000,
      profit: Math.floor(Math.random() * 2000) + 500,
    });
  }

  return data;
};

export function SalesChart() {
  const { t } = useTranslation();
  const [data, setData] = useState<
    { name: string; revenue: number; profit: number }[]
  >([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setData(generateData());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            name={t("admin.dashboardContent.revenue")}
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="profit"
            name={t("admin.dashboardContent.profit")}
            stroke="#82ca9d"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
