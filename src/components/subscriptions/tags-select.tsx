"use client";

import { MultiSelect } from "@/components/ui/multi-select";
import categories from "@/data/categories.json";

interface TagsSelectProps {
  value: string[];
  onChange: (tags: string[]) => void;
  className?: string;
}

export function TagsSelect({ value, onChange, className }: TagsSelectProps) {
  return (
    <MultiSelect
      options={categories}
      selected={value}
      onChange={onChange}
      placeholder="Select from categories or add custom tags"
      className={className}
    />
  );
}