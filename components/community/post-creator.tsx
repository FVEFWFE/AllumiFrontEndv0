"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Video, Paperclip, Smile, Youtube } from "lucide-react"

export function PostCreator() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [content, setContent] = useState("")

  return (
    <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl p-4 border border-white/10">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/placeholder-rovzr.png" />
          <AvatarFallback className="bg-emerald-500 text-white">JD</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <Textarea
            placeholder="Write something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="min-h-[60px] bg-transparent border-none resize-none text-white placeholder:text-zinc-400 focus:ring-0 focus:outline-none"
          />

          {isExpanded && (
            <div className="mt-4 space-y-4">
              {/* Rich Text Toolbar */}
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/10">
                  <strong>B</strong>
                </Button>
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/10">
                  <em>I</em>
                </Button>
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/10">
                  <u>U</u>
                </Button>
                <div className="w-px h-4 bg-white/20 mx-1" />
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/10">
                  • List
                </Button>
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/10">
                  1. List
                </Button>
              </div>

              {/* Media Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/10">
                    <ImageIcon className="h-4 w-4 mr-1" />
                    Image
                  </Button>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/10">
                    <Video className="h-4 w-4 mr-1" />
                    Video
                  </Button>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/10">
                    <Youtube className="h-4 w-4 mr-1" />
                    YouTube
                  </Button>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/10">
                    <Paperclip className="h-4 w-4 mr-1" />
                    File
                  </Button>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/10">
                    <Smile className="h-4 w-4 mr-1" />
                    GIF
                  </Button>
                </div>

                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" disabled={!content.trim()}>
                  Post
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
