"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share, TrendingUp } from "lucide-react"
import { CommentSection } from "./comment-section"

interface PostCardProps {
  post: {
    id: string
    author: {
      name: string
      username: string
      avatar: string
      level: number
      levelProgress: number
    }
    content: string
    timestamp: string
    category: string
    likes: number
    comments: number
    shares: number
    attribution?: {
      revenue: number
      conversions: number
      description: string
    }
    images: string[]
  }
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  return (
    <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
      {/* Post Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-emerald-500 text-white">
              {post.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <Badge className="absolute -bottom-1 -right-1 h-6 w-6 p-0 bg-purple-500 text-white text-xs">
            {post.author.level}
          </Badge>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white">{post.author.name}</span>
            <span className="text-zinc-400 text-sm">@{post.author.username}</span>
            {post.attribution && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <TrendingUp className="h-3 w-3 mr-1" />
                Generated ${post.attribution.revenue}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>{post.timestamp}</span>
            <span>•</span>
            <Badge variant="outline" className="border-white/20 text-zinc-400">
              {post.category}
            </Badge>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-white leading-relaxed">{post.content}</p>

        {post.images.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-2">
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt="Post attachment"
                className="rounded-lg max-h-64 w-full object-cover"
              />
            ))}
          </div>
        )}
      </div>

      {/* Attribution Info */}
      {post.attribution && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-emerald-400 text-sm">
            <TrendingUp className="h-4 w-4" />
            <span className="font-medium">{post.attribution.description}</span>
          </div>
        </div>
      )}

      {/* Engagement Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-2 ${
              isLiked ? "text-red-500 hover:text-red-400" : "text-zinc-400 hover:text-white"
            } hover:bg-white/10`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{likeCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-zinc-400 hover:text-white hover:bg-white/10"
          >
            <Share className="h-4 w-4" />
            <span>{post.shares}</span>
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <CommentSection postId={post.id} />
        </div>
      )}
    </div>
  )
}
