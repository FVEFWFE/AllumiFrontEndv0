"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, Reply } from "lucide-react"

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")

  const sampleComments = [
    {
      id: "1",
      author: {
        name: "Emma Wilson",
        username: "emmaw",
        avatar: "/placeholder-rwhdj.png",
        level: 4,
      },
      content: "This is exactly what I needed to hear today! Thanks for sharing your journey.",
      timestamp: "1 hour ago",
      likes: 5,
      replies: [],
    },
    {
      id: "2",
      author: {
        name: "David Kim",
        username: "davidk",
        avatar: "/placeholder-urvza.png",
        level: 6,
      },
      content: "Amazing results! Could you share more details about your welcome sequence strategy?",
      timestamp: "45 minutes ago",
      likes: 3,
      replies: [
        {
          id: "2-1",
          author: {
            name: "Alex Rivera",
            username: "alexr",
            avatar: "/placeholder-5eiu1.png",
            level: 7,
          },
          content: "I'll create a detailed post about it tomorrow. The key is personalization and timing.",
          timestamp: "30 minutes ago",
          likes: 8,
        },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder-rovzr.png" />
          <AvatarFallback className="bg-emerald-500 text-white text-sm">JD</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] bg-white/5 border-white/10 text-white placeholder:text-zinc-400 resize-none"
          />
          <div className="flex justify-end mt-2">
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white" disabled={!newComment.trim()}>
              Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {sampleComments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            {/* Main Comment */}
            <div className="flex gap-3">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-emerald-500 text-white text-xs">
                    {comment.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Badge className="absolute -bottom-1 -right-1 h-4 w-4 p-0 bg-purple-500 text-white text-xs">
                  {comment.author.level}
                </Badge>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white text-sm">{comment.author.name}</span>
                  <span className="text-zinc-400 text-xs">@{comment.author.username}</span>
                  <span className="text-zinc-400 text-xs">•</span>
                  <span className="text-zinc-400 text-xs">{comment.timestamp}</span>
                </div>
                <p className="text-white text-sm leading-relaxed mb-2">{comment.content}</p>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white hover:bg-white/10 h-6 px-2"
                  >
                    <Heart className="h-3 w-3 mr-1" />
                    <span className="text-xs">{comment.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white hover:bg-white/10 h-6 px-2"
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    <span className="text-xs">Reply</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Replies */}
            {comment.replies.map((reply) => (
              <div key={reply.id} className="ml-11 flex gap-3">
                <div className="relative">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={reply.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-emerald-500 text-white text-xs">
                      {reply.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Badge className="absolute -bottom-1 -right-1 h-3 w-3 p-0 bg-purple-500 text-white text-xs">
                    {reply.author.level}
                  </Badge>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white text-sm">{reply.author.name}</span>
                    <span className="text-zinc-400 text-xs">@{reply.author.username}</span>
                    <span className="text-zinc-400 text-xs">•</span>
                    <span className="text-zinc-400 text-xs">{reply.timestamp}</span>
                  </div>
                  <p className="text-white text-sm leading-relaxed mb-2">{reply.content}</p>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-zinc-400 hover:text-white hover:bg-white/10 h-6 px-2"
                    >
                      <Heart className="h-3 w-3 mr-1" />
                      <span className="text-xs">{reply.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-zinc-400 hover:text-white hover:bg-white/10 h-6 px-2"
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      <span className="text-xs">Reply</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
