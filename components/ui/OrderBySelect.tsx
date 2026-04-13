"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pushFilters } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const OrderBySelect = () => {
  const searchParams = useSearchParams(); //mi prendo i query params in sola lettura

  //Mi prendo i parametri
  const paramsOrder = `${searchParams.get("orderBy") || "id"}:${searchParams.get("order") || "asc"}`;

  const [value, setValue] = useState(paramsOrder);
  const items = [
    { label: "Default", value: "id:asc" },
    { label: "Most likes", value: "likes_count:desc" },
    { label: "Least likes", value: "likes_count:asc" },
    { label: "Most comments", value: "comments_count:desc" },
    { label: "Least comments", value: "comments_count:asc" },
    { label: "More recent", value: "created_at:desc" },
    { label: "Less recent", value: "created_at:asc" },
  ];

  const handleChange = (value: string) => {
    setValue(value);
    const [orderBy, order] = value.split(":");

    pushFilters({
      order: order as "asc" | "desc",
      orderBy: orderBy as "created_at" | "count_likes" | "count_comments",
    });
  };

  return (
    <Select
      items={items}
      value={value}
      onValueChange={(value) => {
        if (value) handleChange(value);
      }}
    >
      <SelectTrigger className="w-45">
        <SelectValue placeholder="Order by" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default OrderBySelect;
