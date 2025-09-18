"use client"
import { Search, MessageCircle, Bell, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CommunityHeaderProps {
  selectedGroup: string
  setSelectedGroup: (group: string) => void
}

export function CommunityHeader({ selectedGroup, setSelectedGroup }: CommunityHeaderProps) {
  const groups = [
    { id: "marketing-mastery", name: "Marketing Mastery", icon: "🚀" },
    { id: "content-creators", name: "Content Creators", icon: "🎬" },
    { id: "entrepreneurs", name: "Entrepreneurs", icon: "💼" },
  ]

  const currentGroup = groups.find((g) => g.id === selectedGroup) || groups[0]

  return (
    <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Group Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-white/10">
              <span className="text-xl">{currentGroup.icon}</span>
              <span className="font-semibold">{currentGroup.name}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-900 border-white/10">
            {groups.map((group) => (
              <DropdownMenuItem
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className="flex items-center gap-2 text-white hover:bg-white/10"
              >
                <span>{group.icon}</span>
                <span>{group.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search posts, comments, members..."
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-400 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
            <MessageCircle className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-emerald-500 text-xs">3</Badge>
          </Button>

          <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-emerald-500 text-xs">7</Badge>
          </Button>

          <Avatar className="h-8 w-8">
            <AvatarImage src="/user-profile-illustration.png" />
            <AvatarFallback className="bg-emerald-500 text-white">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
