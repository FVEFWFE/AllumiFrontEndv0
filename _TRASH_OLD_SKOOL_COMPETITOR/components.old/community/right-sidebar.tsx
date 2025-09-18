"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, MessageCircle, UserPlus } from "lucide-react"

export function RightSidebar() {
  const members = [
    { name: "Sarah J", avatar: "/placeholder-yzygh.png", level: 5, online: true },
    { name: "Mike C", avatar: "/placeholder-2o8he.png", level: 3, online: true },
    { name: "Alex R", avatar: "/placeholder-ivwdb.png", level: 7, online: false },
    { name: "Emma W", avatar: "/placeholder-mij62.png", level: 4, online: true },
    { name: "David K", avatar: "/placeholder-uc2l4.png", level: 6, online: false },
    { name: "Lisa M", avatar: "/placeholder-yg2mk.png", level: 2, online: true },
    { name: "Tom B", avatar: "/placeholder.svg?height=32&width=32", level: 8, online: false },
    { name: "Anna S", avatar: "/placeholder.svg?height=32&width=32", level: 3, online: true },
  ]

  return (
    <div className="space-y-6">
      {/* Group Info */}
      <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
        <div className="p-4 -mt-6">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-12 w-12 border-2 border-black">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback className="bg-emerald-500 text-white">🚀</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-white">Marketing Mastery</h3>
              <p className="text-sm text-zinc-400">yourdomain.com/marketing</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Members</span>
              <span className="text-white">1,247 • 89 online</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Admins</span>
              <span className="text-white">3</span>
            </div>
          </div>

          <p className="text-sm text-zinc-300 mt-3 leading-relaxed">
            Master the art of digital marketing with proven strategies and real-world case studies.
          </p>

          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-xs text-zinc-500 text-center">Powered by Allumi</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl p-4 border border-white/10">
        <h3 className="text-sm font-semibold text-zinc-400 mb-3">TODAY'S STATS</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-white">Revenue</span>
            </div>
            <span className="text-sm font-semibold text-emerald-400">$2,847</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-white">New Members</span>
            </div>
            <span className="text-sm font-semibold text-white">12</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-white">Active Discussions</span>
            </div>
            <span className="text-sm font-semibold text-white">28</span>
          </div>

          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-zinc-400">Top Traffic Source</span>
              <span className="text-xs font-medium text-white">YouTube</span>
            </div>
            <Progress value={75} className="h-1 bg-white/10" />
          </div>
        </div>
      </div>

      {/* Members Preview */}
      <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-400">MEMBERS</h3>
          <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-white/10">
            View all
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {members.map((member, index) => (
            <div key={index} className="relative group cursor-pointer">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-emerald-500 text-white text-xs">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Badge className="absolute -bottom-1 -right-1 h-4 w-4 p-0 bg-purple-500 text-white text-xs">
                {member.level}
              </Badge>
              {member.online && (
                <div className="absolute top-0 right-0 h-3 w-3 bg-emerald-400 rounded-full border-2 border-black"></div>
              )}

              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="bg-zinc-800 border border-white/10 rounded-lg p-3 text-xs whitespace-nowrap">
                  <div className="font-medium text-white">{member.name}</div>
                  <div className="text-zinc-400">Level {member.level}</div>
                  <div className="text-zinc-400">{member.online ? "Online" : "Offline"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Members
        </Button>
      </div>
    </div>
  )
}
