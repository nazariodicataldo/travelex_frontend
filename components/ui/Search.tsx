"use client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { pushFilters } from "@/lib/utils";
import { Compass } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const Search = () => {
  const searchParams = useSearchParams(); //mi prendo i query params in sola lettura

  //rendo il componente controllato
  const [inputValue, setInputValue] = useState(
    searchParams.get("location") || "",
  );

  /* Funzione di debounce */
  const handleSearch = useDebouncedCallback(
    (value: string) => pushFilters({ location: value }),
    300,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val); // Aggiornamento immediato della UI
    handleSearch(val); // Debounce per URL e Store
  };

  return (
    <InputGroup className=" py-6 ">
      <InputGroupInput
        placeholder="Where does your soul need to go?"
        className="h-8"
        value={inputValue}
        type="search"
        onChange={handleChange}
      />
      <InputGroupAddon>
        <Compass className="size-5 text-primary" />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default Search;
