"use client";

import { useState } from "react";
import { Country, CountryDropdown } from "./CountryDropdown";
import { useSearchParams } from "next/navigation";
import { pushFilters } from "@/lib/utils";

const CountrySelect = () => {
  const searchParams = useSearchParams(); //mi prendo i query params in sola lettura
  const [value, setValue] = useState(searchParams.get("country") || "");

  const handleChange = (country: Country | undefined) => {
    const newValue = country?.alpha3 || undefined;
    setValue(newValue || "");

    pushFilters({ country: newValue });
  };

  return (
    <CountryDropdown
      placeholder="Filter by country"
      defaultValue={value}
      onChange={handleChange}
      classList="h-12!"
      slim
    />
  );
};

export default CountrySelect;
