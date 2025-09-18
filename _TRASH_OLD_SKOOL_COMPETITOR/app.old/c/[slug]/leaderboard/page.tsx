'use client';

import { useState } from 'react';
import { Trophy, TrendingUp, Award, Crown, Medal, Star, Zap, Target, Flame } from 'lucide-react';
import { generateUsers } from '@/lib/mock-data';
import Image from 'next/image';

const levels = [
  { level: 1, name: 'Newcomer', points: 0, icon: Star, color: 'text-gray-400' },
  { level: 2, name: 'Explorer', points: 5, icon: Target, color: 'text-green-400' },
  { level: 3, name: 'Contributor', points: 20, icon: Zap, color: 'text-blue-400' },
  { level: 4, name: 'Achiever', points: 65, icon: Medal, color: 'text-purple-400' },
  { level: 5, name: 'Expert', points: 155, icon: Trophy, color: 'text-yellow-400' },
  { level: 6, name: 'Master', points: 515, icon: Crown, color: 'text-orange-400' },
  { level: 7, name: 'Legend', points: 2015, icon: Flame, color: 'text-red-400' },
  { level: 8, name: 'Mythic', points: 8015, icon: Award, color: 'text-pink-400' },
  { level: 9, name: 'Transcendent', points: 33015, icon: Crown, color: 'text-emerald-400' },
];

export default function LeaderboardPage() {
  const [members] = useState(() => {
    const users = generateUsers(100);
    // Sort by points descending
    return users.sort((a, b) => b.points - a.points);
  });
  
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('all');
  const [showLevelConfig, setShowLevelConfig] = useState(false);
  
  const topThree = members.slice(0, 3);
  const rest = members.slice(3, 30);

  const getCurrentLevel = (points: number) => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (points >= levels[i].points) {
        return levels[i];
      }
    }
    return levels[0];
  };

  const getNextLevel = (points: number) => {
    for (let i = 0; i < levels.length; i++) {
      if (points < levels[i].points) {
        return levels[i];
      }
    }
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
            <p className="text-gray-400 mt-1">Top performers in the community</p>
          </div>
          <button
            onClick={() => setShowLevelConfig(true)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Configure Levels
          </button>
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-2 mt-4">
          {(['all', 'month', 'week'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeframe === t
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {t === 'all' ? 'All Time' : t === 'month' ? 'This Month' : 'This Week'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Top 3 Podium */}
        <div className="mb-8">
          <div className="flex items-end justify-center gap-4">
            {/* Second Place */}
            <div className="flex flex-col items-center">
              <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4 w-40 hover:bg-gray-900/70 transition-all">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">🥈</div>
                  <Image
                    src={topThree[1].avatar}
                    alt={topThree[1].name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full mx-auto mb-2 border-4 border-gray-600"
                  />
                  <h3 className="font-semibold text-white truncate">{topThree[1].name}</h3>
                  <p className="text-sm text-gray-500">@{topThree[1].username}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-300">{topThree[1].points}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
              <div className="h-24 w-32 bg-gradient-to-t from-gray-700 to-gray-800 mt-2 rounded-t-lg" />
            </div>

            {/* First Place */}
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 rounded-lg border border-yellow-600/50 p-4 w-44 hover:from-yellow-900/40 hover:to-yellow-800/40 transition-all">
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">🥇</div>
                  <Image
                    src={topThree[0].avatar}
                    alt={topThree[0].name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full mx-auto mb-2 border-4 border-yellow-600"
                  />
                  <h3 className="font-semibold text-white truncate">{topThree[0].name}</h3>
                  <p className="text-sm text-gray-400">@{topThree[0].username}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{topThree[0].points}</div>
                  <div className="text-xs text-gray-400">points</div>
                </div>
              </div>
              <div className="h-32 w-36 bg-gradient-to-t from-yellow-700/50 to-yellow-800/50 mt-2 rounded-t-lg" />
            </div>

            {/* Third Place */}
            <div className="flex flex-col items-center">
              <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4 w-40 hover:bg-gray-900/70 transition-all">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">🥉</div>
                  <Image
                    src={topThree[2].avatar}
                    alt={topThree[2].name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full mx-auto mb-2 border-4 border-orange-700"
                  />
                  <h3 className="font-semibold text-white truncate">{topThree[2].name}</h3>
                  <p className="text-sm text-gray-500">@{topThree[2].username}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{topThree[2].points}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
              <div className="h-20 w-32 bg-gradient-to-t from-orange-900/50 to-orange-800/50 mt-2 rounded-t-lg" />
            </div>
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <div className="bg-gray-900/30 rounded-lg border border-gray-800 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-900/50 text-sm font-medium text-gray-400 border-b border-gray-800">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Member</div>
            <div className="col-span-2">Level</div>
            <div className="col-span-2">Points</div>
            <div className="col-span-2">Progress</div>
          </div>

          {rest.map((member, index) => {
            const rank = index + 4;
            const currentLevel = getCurrentLevel(member.points);
            const nextLevel = getNextLevel(member.points);
            const progress = nextLevel
              ? ((member.points - currentLevel.points) / (nextLevel.points - currentLevel.points)) * 100
              : 100;

            return (
              <div
                key={member.id}
                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
              >
                <div className="col-span-1 flex items-center">
                  <span className="text-lg font-bold text-gray-400">#{rank}</span>
                </div>
                
                <div className="col-span-5 flex items-center gap-3">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-white">{member.name}</div>
                    <div className="text-sm text-gray-500">@{member.username}</div>
                  </div>
                </div>
                
                <div className="col-span-2 flex items-center gap-2">
                  <currentLevel.icon className={`w-5 h-5 ${currentLevel.color}`} />
                  <span className={`font-medium ${currentLevel.color}`}>
                    {currentLevel.name}
                  </span>
                </div>
                
                <div className="col-span-2 flex items-center">
                  <span className="text-lg font-bold text-white">{member.points}</span>
                </div>
                
                <div className="col-span-2 flex items-center">
                  <div className="w-full">
                    {nextLevel && (
                      <div className="text-xs text-gray-500 mb-1">
                        {nextLevel.points - member.points} to {nextLevel.name}
                      </div>
                    )}
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level Configuration Modal */}
      {showLevelConfig && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Configure Levels</h2>
                <button
                  onClick={() => setShowLevelConfig(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-400 mt-1">Customize your community\'s level system</p>
            </div>

            <div className="p-6 space-y-4">
              {levels.map((level, index) => {
                const Icon = level.icon;
                return (
                  <div key={level.level} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <Icon className={`w-8 h-8 ${level.color}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-gray-500">Level {level.level}</span>
                          <span className="text-lg font-semibold text-white">→</span>
                          <input
                            type="text"
                            value={level.name}
                            className="px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white"
                            placeholder="Level name"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Points required:</span>
                          <input
                            type="number"
                            value={level.points}
                            className="w-24 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white"
                            disabled={index === 0}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 border-t border-gray-800 flex gap-3">
              <button
                onClick={() => setShowLevelConfig(false)}
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowLevelConfig(false)}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}