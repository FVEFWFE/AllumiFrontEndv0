"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { ArrowUpIcon, ArrowDownIcon, PlayIcon } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"

// Mock data for the dashboard
const revenueBySource = [
  { name: "YouTube", value: 12450, percentage: 35, color: "#FF6B6B" },
  { name: "Google Ads", value: 8200, percentage: 23, color: "#4ECDC4" },
  { name: "Instagram", value: 6100, percentage: 17, color: "#45B7D1" },
  { name: "Direct", value: 5300, percentage: 15, color: "#96CEB4" },
  { name: "Facebook", value: 3550, percentage: 10, color: "#FFEAA7" },
]

const roiBySource = [
  { name: "Black Friday Launch", roi: 420, spend: 2000, revenue: 8400 },
  { name: "YouTube Series", roi: 380, spend: 3000, revenue: 11400 },
  { name: "Instagram Reels", roi: 290, spend: 2100, revenue: 6090 },
  { name: "Facebook Ads", roi: 180, spend: 4500, revenue: 8100 },
  { name: "Google Ads", roi: 150, spend: 5500, revenue: 8250 },
]

const funnelData = [
  { name: "First Touch", value: 10000, fill: "#FF6B6B" },
  { name: "Signed Up", value: 1200, fill: "#4ECDC4" },
  { name: "Completed Onboarding", value: 980, fill: "#45B7D1" },
  { name: "First Purchase", value: 420, fill: "#96CEB4" },
  { name: "Lifetime Value", value: 127, fill: "#FFEAA7" },
]

const activityFeed = [
  { id: 1, text: "New member from YouTube ad", value: "$99/mo", time: "2 min ago", source: "YouTube" },
  { id: 2, text: "Upgrade from Instagram post", value: "$199/mo", time: "5 min ago", source: "Instagram" },
  { id: 3, text: "Renewal from email campaign", value: "$99/mo", time: "8 min ago", source: "Email" },
  { id: 4, text: "New member from podcast mention", value: "$149/mo", time: "12 min ago", source: "Podcast" },
  { id: 5, text: "Upgrade from YouTube series", value: "$299/mo", time: "15 min ago", source: "YouTube" },
]

export default function AttributionDemo() {
  const [isLive, setIsLive] = useState(false)
  const [currentActivity, setCurrentActivity] = useState(0)
  const [showFullDemo, setShowFullDemo] = useState(false)
  const [animatedRevenue, setAnimatedRevenue] = useState(0)
  const [timePeriod, setTimePeriod] = useState("30d")

  // Animate numbers on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLive(true)
      // Animate revenue counter
      let start = 0
      const end = 35600
      const duration = 2000
      const increment = end / (duration / 16)

      const counter = setInterval(() => {
        start += increment
        if (start >= end) {
          setAnimatedRevenue(end)
          clearInterval(counter)
        } else {
          setAnimatedRevenue(Math.floor(start))
        }
      }, 16)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Cycle through activity feed
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setCurrentActivity((prev) => (prev + 1) % activityFeed.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isLive])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-green-600">Revenue: ${payload[0]?.payload?.revenue?.toLocaleString()}</p>
          <p className="text-sm text-blue-600">ROI: {payload[0]?.value}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <div className={`w-3 h-3 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
              <span className="text-sm font-medium text-muted-foreground">
                {isLive ? "LIVE" : "LOADING"} ATTRIBUTION DATA
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              This Could Be Your Data
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            >
              See exactly where every paying member comes from. Track ROI by source, optimize what works, cut what
              doesn't.
            </motion.p>

            {/* Time Period Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center gap-2 mb-8"
            >
              {["7d", "30d", "90d"].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timePeriod === period
                      ? "bg-blue-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {period}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue by Source */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Revenue by Source</h3>
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowUpIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">+23%</span>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueBySource}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      animationBegin={800}
                      animationDuration={1000}
                    >
                      {revenueBySource.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, "Revenue"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                {revenueBySource.map((source, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="text-sm text-muted-foreground">{source.name}</span>
                    <span className="text-sm font-medium ml-auto">{source.percentage}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* ROI by Campaign */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">ROI by Campaign</h3>
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowUpIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">+15%</span>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roiBySource} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="roi"
                      fill="#4ECDC4"
                      animationBegin={1200}
                      animationDuration={1000}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Member Journey Funnel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Member Journey Funnel</h3>
                <div className="text-sm text-muted-foreground">$127 avg LTV</div>
              </div>

              <div className="space-y-3">
                {funnelData.map((step, index) => {
                  const percentage = index === 0 ? 100 : Math.round((step.value / funnelData[0].value) * 100)
                  return (
                    <motion.div
                      key={step.name}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 1.5 + index * 0.2 }}
                      className="relative"
                    >
                      <div
                        className="h-12 rounded-lg flex items-center justify-between px-4 text-white font-medium"
                        style={{ backgroundColor: step.fill }}
                      >
                        <span className="text-sm">{step.name}</span>
                        <span className="text-sm">
                          {step.name === "Lifetime Value" ? `$${step.value}` : step.value.toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </Card>
          </motion.div>

          {/* Real-Time Activity Feed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Real-Time Activity</h3>
                <div className={`flex items-center gap-2 ${isLive ? "text-green-600" : "text-gray-400"}`}>
                  <div className={`w-2 h-2 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                  <span className="text-sm font-medium">LIVE</span>
                </div>
              </div>

              <div className="space-y-3 h-64 overflow-hidden">
                <AnimatePresence mode="wait">
                  {activityFeed.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: index <= currentActivity ? 1 : 0.3,
                        x: 0,
                        scale: index === currentActivity ? 1.02 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`p-3 rounded-lg border ${
                        index === currentActivity
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                          : "bg-muted/50 border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.text}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                              {activity.source}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-green-600">{activity.value}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mb-8"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Key Insight</h3>
            <p className="text-lg mb-6 opacity-90">
              Your YouTube content drives 35% of revenue with 380% ROI, while Facebook ads only deliver 150% ROI.
              <br />
              <strong>Time to double down on what works.</strong>
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <ArrowUpIcon className="w-4 h-4" />
                <span>YouTube ROI: 380%</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownIcon className="w-4 h-4" />
                <span>Facebook ROI: 150%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center"
        >
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to See Your Real Data?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Stop guessing which content drives revenue. Get attribution insights that Skool can't provide, for half
              the price.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                onClick={() => window.open("/migrate-now", "_blank")}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 bg-transparent"
                onClick={() => setShowFullDemo(!showFullDemo)}
              >
                <PlayIcon className="w-4 h-4 mr-2" />
                {showFullDemo ? "Hide" : "See"} Full Demo
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Expanded Demo */}
        <AnimatePresence>
          {showFullDemo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 overflow-hidden"
            >
              <Card className="p-8">
                <h4 className="text-xl font-bold mb-4 text-center">Full Attribution Dashboard Preview</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">${animatedRevenue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Revenue Tracked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">287%</div>
                    <div className="text-sm text-muted-foreground">Average ROI</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">1,247</div>
                    <div className="text-sm text-muted-foreground">Members Attributed</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
