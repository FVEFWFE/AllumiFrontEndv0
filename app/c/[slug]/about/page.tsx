'use client';

import { useState } from 'react';
import { Users, Globe, Calendar, Shield, Award, BookOpen, Target, Sparkles, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { generateCommunity, generateUsers } from '@/lib/mock-data';

export default function AboutPage() {
  const [community] = useState(() => generateCommunity());
  const [admins] = useState(() => generateUsers(3));
  const [copied, setCopied] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`https://allumi.com/c/${community.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rules = [
    { id: 1, title: 'Be respectful', description: 'Treat all members with respect and kindness' },
    { id: 2, title: 'No spam', description: 'Avoid posting repetitive or promotional content' },
    { id: 3, title: 'Stay on topic', description: 'Keep discussions relevant to the community focus' },
    { id: 4, title: 'Share value', description: 'Contribute meaningful content that helps others' },
    { id: 5, title: 'No harassment', description: 'Zero tolerance for bullying or harassment' },
  ];

  const features = [
    { icon: BookOpen, label: 'Courses', value: '12 courses' },
    { icon: Users, label: 'Members', value: `${community.memberCount} active` },
    { icon: Award, label: 'Certification', value: 'Available' },
    { icon: Target, label: 'Focus', value: community.category },
  ];

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-br from-emerald-600/20 to-purple-600/20 border-b border-gray-800">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full flex items-end p-6">
          <div className="flex items-end gap-4">
            <Image
              src={community.avatar}
              alt={community.name}
              width={96}
              height={96}
              className="w-24 h-24 rounded-lg border-4 border-gray-900"
            />
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-white">{community.name}</h1>
              <p className="text-gray-300">{community.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-gray-900/30 rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                About This Community
              </h2>
              <p className="text-gray-300 leading-relaxed">{community.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.label} className="bg-gray-800/50 rounded-lg p-3">
                      <Icon className="w-5 h-5 text-emerald-400 mb-2" />
                      <div className="text-xs text-gray-500">{feature.label}</div>
                      <div className="text-sm font-semibold text-white">{feature.value}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Community Rules */}
            <div className="bg-gray-900/30 rounded-lg border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  Community Rules
                </h2>
                <button
                  onClick={() => setShowRulesModal(true)}
                  className="text-sm text-emerald-400 hover:text-emerald-300"
                >
                  Edit Rules
                </button>
              </div>
              
              <div className="space-y-3">
                {rules.map((rule, index) => (
                  <div key={rule.id} className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{rule.title}</h3>
                      <p className="text-sm text-gray-400">{rule.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-500">
                  By participating in this community, you agree to follow these rules. 
                  Violations may result in warnings or removal from the community.
                </p>
              </div>
            </div>

            {/* Admins */}
            <div className="bg-gray-900/30 rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Community Admins</h2>
              <div className="space-y-3">
                {admins.map((admin, index) => (
                  <div key={admin.id} className="flex items-center gap-3">
                    <Image
                      src={admin.avatar}
                      alt={admin.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{admin.name}</h3>
                        {index === 0 && (
                          <span className="px-2 py-0.5 bg-emerald-600/20 text-emerald-400 text-xs rounded-full">
                            Owner
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">@{admin.username}</p>
                    </div>
                    <button className="px-3 py-1 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
                      Message
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-gray-900/30 rounded-lg border border-gray-800 p-6">
              <h3 className="font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Members</span>
                  <span className="font-semibold text-white">{community.memberCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Online Now</span>
                  <span className="font-semibold text-emerald-400">{Math.floor(community.memberCount * 0.1)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="font-semibold text-white">{new Date(community.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="font-semibold text-white">{community.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Privacy</span>
                  <span className="font-semibold text-white">{community.isPrivate ? 'Private' : 'Public'}</span>
                </div>
              </div>
            </div>

            {/* Invite Link */}
            <div className="bg-gray-900/30 rounded-lg border border-gray-800 p-6">
              <h3 className="font-semibold text-white mb-4">Share Community</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`allumi.com/c/${community.slug}`}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 text-sm"
                />
                <button
                  onClick={copyInviteLink}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Share this link to invite new members
              </p>
            </div>

            {/* External Links */}
            <div className="bg-gray-900/30 rounded-lg border border-gray-800 p-6">
              <h3 className="font-semibold text-white mb-4">Links</h3>
              <div className="space-y-2">
                <a
                  href="#"
                  className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">Website</span>
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Schedule a Call</span>
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Edit Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Edit Community Rules</h2>
                <button
                  onClick={() => setShowRulesModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {rules.map((rule, index) => (
                <div key={rule.id} className="bg-gray-800/50 rounded-lg p-4">
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={rule.title}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                      placeholder="Rule title"
                    />
                    <textarea
                      value={rule.description}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                      placeholder="Rule description"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button className="text-sm text-gray-400 hover:text-white">Move up</button>
                      <button className="text-sm text-gray-400 hover:text-white">Move down</button>
                      <button className="text-sm text-red-400 hover:text-red-300 ml-auto">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                + Add New Rule
              </button>
            </div>

            <div className="p-6 border-t border-gray-800 flex gap-3">
              <button
                onClick={() => setShowRulesModal(false)}
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowRulesModal(false)}
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