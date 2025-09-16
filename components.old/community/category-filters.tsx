"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CategoryFiltersProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

export function CategoryFilters({ selectedCategory, setSelectedCategory }: CategoryFiltersProps) {
  const categories = ["All", "General", "Updates", "Questions", "Resources", "Events"]
  const sortOptions = ["Default", "New", "Top", "Unread"]

  return (
    <div className="flex items-center justify-between bg-zinc-900/30 backdrop-blur-md rounded-xl p-3 border border-white/10">
      <div className="flex items-center gap-2 overflow-x-auto">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/10"
            }
          >
            {category}
          </Button>
        ))}
      </div>

      <Select defaultValue="Default">
        <SelectTrigger className="w-32 bg-transparent border-white/10 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-white/10">
          {sortOptions.map((option) => (
            <SelectItem key={option} value={option} className="text-white hover:bg-white/10">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
