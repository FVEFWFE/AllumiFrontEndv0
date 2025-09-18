'use client';

import { useState } from 'react';
import { Search, MapPin, Globe, Calendar, Award, MessageSquare, UserPlus } from 'lucide-react';
import { generateUsers } from '@/lib/mock-data';
import Image from 'next/image';

export default function MembersPage() {
  const [members] = useState(() => generateUsers(50));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'online' | 'new'>('all');

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'online') return matchesSearch && member.isOnline;
    if (filter === 'new') {
      const joinDate = new Date(member.joinedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return matchesSearch && joinDate > weekAgo;
    }
    
    return matchesSearch;
  });

  const getLevelColor = (level: number) => {
    if (level >= 7) return 'text-purple-400 border-purple-400';
    if (level >= 5) return 'text-blue-400 border-blue-400';
    if (level >= 3) return 'text-emerald-400 border-emerald-400';
    return 'text-gray-400 border-gray-400';
  };

  const getPointsToNextLevel = (points: number) => {
    const levels = [0, 5, 20, 65, 155, 515, 2015, 8015, 33015];
    for (let i = 1; i < levels.length; i++) {
      if (points < levels[i]) {
        return {
          level: i,
          pointsNeeded: levels[i] - points,
          progress: ((points - levels[i - 1]) / (levels[i] - levels[i - 1])) * 100
        };
      }
    }
    return { level: 9, pointsNeeded: 0, progress: 100 };
  };

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Members</h1>
            <p className="text-gray-400 mt-1">{members.length} total members • {members.filter(m => m.isOnline).length} online now</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'online', 'new'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {f === 'all' ? 'All Members' : f === 'online' ? 'Online' : 'New Members'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMembers.map((member) => {
            const levelInfo = getPointsToNextLevel(member.points);
            
            return (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="bg-gray-900/30 rounded-lg border border-gray-800 p-4 hover:bg-gray-900/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {member.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-gray-900" />
                    )}
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 ${getLevelColor(levelInfo.level)} bg-gray-900`}>
                      {levelInfo.level}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">@{member.username}</p>
                    
                    {/* Progress to next level */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>{member.points} points</span>
                        <span>{levelInfo.pointsNeeded} to level {levelInfo.level + 1}</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${levelInfo.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    {member.location && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {member.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Member Profile Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Profile Header */}
            <div className="relative p-6 border-b border-gray-800">
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute right-4 top-4 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Image
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  {selectedMember.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-3 border-gray-900" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{selectedMember.name}</h2>
                  <p className="text-gray-400">@{selectedMember.username}</p>
                  {selectedMember.bio && (
                    <p className="text-gray-300 mt-2">{selectedMember.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                    {selectedMember.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedMember.location}
                      </span>
                    )}
                    {selectedMember.website && (
                      <span className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        {selectedMember.website}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(selectedMember.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Follow
                  </button>
                  <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </button>
                </div>
              </div>
            </div>
            
            {/* Activity Graph */}
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-3">Daily Activity</h3>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 365 }, (_, i) => {
                    const activity = Math.random();
                    const opacity = activity > 0.8 ? '100' : activity > 0.5 ? '60' : activity > 0.2 ? '30' : '10';
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-sm bg-emerald-500 opacity-${opacity} hover:opacity-100 transition-opacity`}
                        title={`Activity ${i + 1} days ago`}
                      />
                    );
                  }).slice(0, 52 * 7)}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Activity over the past year. Each square represents a day.
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Statistics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400">{selectedMember.points}</div>
                  <div className="text-sm text-gray-400">Points</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400">
                    {getPointsToNextLevel(selectedMember.points).level}
                  </div>
                  <div className="text-sm text-gray-400">Level</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400">
                    {Math.floor(Math.random() * 50) + 10}
                  </div>
                  <div className="text-sm text-gray-400">Posts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}