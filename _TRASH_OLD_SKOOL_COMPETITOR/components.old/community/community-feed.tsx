"use client"

import { useState } from "react"
import { CommunityHeader } from "./community-header"
import { LeftSidebar } from "./left-sidebar"
import { MainFeed } from "./main-feed"
import { RightSidebar } from "./right-sidebar"

export function CommunityFeed() {
  const [selectedGroup, setSelectedGroup] = useState("marketing-mastery")
  const [selectedCategory, setSelectedCategory] = useState("All")

  return (
    <div className="min-h-screen bg-black text-white">
      <CommunityHeader selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />

      <div className="flex max-w-[1400px] mx-auto">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 p-4">
          <LeftSidebar selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />
        </div>

        {/* Main Feed */}
        <div className="flex-1 max-w-2xl mx-auto p-4">
          <MainFeed selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block w-80 p-4">
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}
