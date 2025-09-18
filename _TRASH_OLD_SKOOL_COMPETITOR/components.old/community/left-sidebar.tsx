"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface LeftSidebarProps {
  selectedGroup: string
  setSelectedGroup: (group: string) => void
}

export function LeftSidebar({ selectedGroup, setSelectedGroup }: LeftSidebarProps) {
  const groups = [
    {
      id: "marketing-mastery",
      name: "Marketing Mastery",
      icon: "🚀",
      members: 1247,
      unread: 5,
      image: "/placeholder-2z78j.png",
    },
    {
      id: "content-creators",
      name: "Content Creators",
      icon: "🎬",
      members: 892,
      unread: 2,
      image: "/placeholder-okk97.png",
    },
    {
      id: "entrepreneurs",
      name: "Entrepreneurs",
      icon: "💼",
      members: 2156,
      unread: 0,
      image: "/placeholder-rwq0i.png",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl p-4 border border-white/10">
        <h3 className="text-sm font-semibold text-zinc-400 mb-3">YOUR GROUPS</h3>
        <div className="space-y-2">
          {groups.map((group) => (
            <Button
              key={group.id}
              variant="ghost"
              onClick={() => setSelectedGroup(group.id)}
              className={`w-full justify-start p-3 h-auto ${
                selectedGroup === group.id
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={group.image || "/placeholder.svg"} />
                  <AvatarFallback className="bg-emerald-500 text-white text-sm">{group.icon}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{group.name}</div>
                  <div className="text-xs text-zinc-400">{group.members} members</div>
                </div>
                {group.unread > 0 && (
                  <Badge className="bg-emerald-500 text-white text-xs h-5 w-5 p-0">{group.unread}</Badge>
                )}
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl p-4 border border-white/10">
        <h3 className="text-sm font-semibold text-zinc-400 mb-3">QUICK ACTIONS</h3>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
            📝 Create Post
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
            👥 Browse Members
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
            📊 View Analytics
          </Button>
        </div>
      </div>
    </div>
  )
}
