"use client"
import { PostCreator } from "./post-creator"
import { CategoryFilters } from "./category-filters"
import { PostCard } from "./post-card"

interface MainFeedProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

export function MainFeed({ selectedCategory, setSelectedCategory }: MainFeedProps) {
  const samplePosts = [
    {
      id: "1",
      author: {
        name: "Sarah Johnson",
        username: "sarahj",
        avatar: "/sarah-profile.jpg",
        level: 5,
        levelProgress: 75,
      },
      content:
        "Just launched my new course and already seeing amazing results! 🚀 The attribution tracking in Allumi is incredible - I can see exactly which posts are driving the most conversions.",
      timestamp: "2 hours ago",
      category: "Updates",
      likes: 24,
      comments: 8,
      shares: 3,
      attribution: {
        revenue: 1247,
        conversions: 5,
        description: "This post drove 5 new members worth $1,247",
      },
      images: ["/placeholder-roqqe.png"],
    },
    {
      id: "2",
      author: {
        name: "Mike Chen",
        username: "mikechen",
        avatar: "/mike-profile.jpg",
        level: 3,
        levelProgress: 45,
      },
      content:
        "Quick question for the community: What's your favorite tool for creating video thumbnails? I've been using Canva but wondering if there are better options out there.",
      timestamp: "4 hours ago",
      category: "Questions",
      likes: 12,
      comments: 15,
      shares: 1,
      images: [],
    },
    {
      id: "3",
      author: {
        name: "Alex Rivera",
        username: "alexr",
        avatar: "/placeholder-5eiu1.png",
        level: 7,
        levelProgress: 90,
      },
      content:
        "HUGE WIN! 🎉 Just hit $10K MRR thanks to the strategies I learned in this community. The attribution data shows that my welcome sequence is converting at 23% - absolutely insane!",
      timestamp: "6 hours ago",
      category: "General",
      likes: 89,
      comments: 23,
      shares: 12,
      attribution: {
        revenue: 2890,
        conversions: 12,
        description: "This post drove 12 new members worth $2,890",
      },
      images: ["/placeholder-cz3va.png"],
    },
  ]

  return (
    <div className="space-y-6">
      <PostCreator />
      <CategoryFilters selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

      <div className="space-y-4">
        {samplePosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
