"use client";

import { useEffect, useMemo, useState } from "react";

import { searchIndonesiaRegencies, type IndonesiaRegency } from "@panenin/utils";

type LocationComboboxProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function LocationCombobox({
  value,
  onChange,
  placeholder = "Cari kabupaten atau kota",
  disabled = false,
}: LocationComboboxProps) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const options = useMemo(() => searchIndonesiaRegencies(query, 12), [query]);

  const handleSelect = (option: IndonesiaRegency) => {
    onChange(option.name);
    setQuery(option.name);
    setOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        className="w-full rounded-[10px] border border-[#e0e0de] bg-white px-[15px] py-[18px] text-[15px] font-medium leading-[22.5px] text-[#1a1a18] outline-none placeholder:text-[#6b6b68]"
      />

      {value ? (
        <p className="pt-2 text-[12px] leading-[18px] text-[#6b6b68]">
          Tersimpan: {value}
        </p>
      ) : null}

      {open ? (
        <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-[14px] border border-[#d8dfd4] bg-white shadow-[0_12px_30px_rgba(26,26,24,0.08)]">
          {options.length > 0 ? (
            options.map((option) => (
              <button
                type="button"
                key={option.id}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(option)}
                className={`flex w-full flex-col items-start gap-0.5 border-b border-[#eef1eb] px-4 py-3 text-left last:border-b-0 ${
                  option.name === value ? "bg-[#ebf5eb]" : "bg-white"
                }`}
              >
                <span className="text-[14px] font-medium leading-[21px] text-[#1a1a18]">
                  {option.name}
                </span>
                <span className="text-[12px] leading-[18px] text-[#6b6b68]">
                  {option.provinceName}
                </span>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-[13px] leading-[19px] text-[#6b6b68]">
              Kabupaten/kota tidak ditemukan. Coba kata kunci lain.
            </div>
          )}
        </div>
      ) : null}

      {open ? (
        <button
          type="button"
          aria-label="Tutup daftar lokasi"
          className="fixed inset-0 z-10 cursor-default"
          onClick={() => {
            setOpen(false);
            setQuery(value);
          }}
        />
      ) : null}
    </div>
  );
}
