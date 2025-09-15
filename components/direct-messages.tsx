'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X, ChevronLeft, Send, Paperclip, Smile, Search, Plus,
  MoreVertical, Check, CheckCheck, Lock, Circle, Image as ImageIcon,
  Minimize2, Maximize2, MessageSquare, Film
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

// Mock data for conversations
const mockConversations = [
  {
    id: '1',
    user: {
      name: 'Sarah Chen',
      username: 'sarahchen',
      avatar: 'https://i.pravatar.cc/150?img=5',
      level: 7,
      isOnline: true,
      lastSeen: new Date(),
    },
    lastMessage: {
      content: 'Thanks for the attribution tips! Already seeing results 🚀',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
      isRead: false,
      sender: 'them',
    },
    unreadCount: 2,
    isPinned: true,
    isTyping: false,
  },
  {
    id: '2',
    user: {
      name: 'Marcus Rodriguez',
      username: 'marcusr',
      avatar: 'https://i.pravatar.cc/150?img=8',
      level: 5,
      isOnline: false,
      lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    lastMessage: {
      content: 'Check out this course module',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
      isRead: true,
      sender: 'me',
    },
    unreadCount: 0,
    isPinned: false,
    isTyping: false,
  },
  {
    id: '3',
    user: {
      name: 'Jessica Kim',
      username: 'jessk',
      avatar: 'https://i.pravatar.cc/150?img=9',
      level: 3,
      isOnline: true,
      lastSeen: new Date(),
    },
    lastMessage: {
      content: 'is typing...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isRead: true,
      sender: 'them',
    },
    unreadCount: 0,
    isPinned: false,
    isTyping: true,
  },
];

// Mock messages for a conversation
const mockMessages = [
  {
    id: '1',
    content: 'Hey! I saw your post about attribution tracking',
    sender: 'them',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: true,
    type: 'text',
  },
  {
    id: '2',
    content: 'Yeah! It\'s been a game changer for understanding our revenue sources',
    sender: 'me',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
    isRead: true,
    type: 'text',
  },
  {
    id: '3',
    content: 'Can you share more details? I\'m struggling to set it up',
    sender: 'them',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    isRead: true,
    type: 'text',
  },
  {
    id: '4',
    content: 'Sure! Here\'s the link to my setup guide: https://allumi.com/guide/attribution?ref=dm-sarah',
    sender: 'me',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: true,
    type: 'text',
    hasAttribution: true,
  },
  {
    id: '5',
    content: 'Thanks for the attribution tips! Already seeing results 🚀',
    sender: 'them',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isRead: false,
    type: 'text',
  },
];

interface DirectMessagesProps {
  isOpen: boolean;
  onClose: () => void;
  userLevel?: number;
}

function LevelBadge({ level }: { level: number }) {
  const colors = [
    'bg-gray-500',
    'bg-gray-400',
    'bg-green-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-pink-500',
  ];
  
  return (
    <div className={cn(
      "inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white",
      colors[level - 1]
    )}>
      {level}
    </div>
  );
}

export function DirectMessages({ isOpen, onClose, userLevel = 2 }: DirectMessagesProps) {
  const [view, setView] = useState<'list' | 'chat'>('list');
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversations, setConversations] = useState(mockConversations);
  const [messages, setMessages] = useState(mockMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isLocked = userLevel < 2;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'me' as const,
      timestamp: new Date(),
      isRead: false,
      type: 'text' as const,
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Update conversation's last message
    if (selectedConversation) {
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id
          ? {
              ...conv,
              lastMessage: {
                content: message,
                timestamp: new Date(),
                isRead: false,
                sender: 'me',
              },
              isTyping: false,
            }
          : conv
      ));
    }
  };

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    setView('chat');
    
    // Mark messages as read
    setConversations(prev => prev.map(conv => 
      conv.id === conversation.id
        ? { ...conv, unreadCount: 0 }
        : conv
    ));
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort conversations: pinned first, then unread, then by time
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    if (a.unreadCount !== b.unreadCount) return b.unreadCount - a.unreadCount;
    return b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime();
  });

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  if (!isOpen) return null;

  // Minimized view
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="relative bg-gray-900 border border-gray-800 rounded-lg p-3 hover:bg-gray-800 transition-colors"
        >
          <MessageSquare className="h-5 w-5 text-white" />
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full text-xs text-white flex items-center justify-center">
              {totalUnread}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-gray-900 border-l border-gray-800 z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          {view === 'list' ? (
            <>
              <h2 className="text-lg font-semibold text-white">Messages</h2>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsMinimized(true)}
                  className="h-8 w-8 text-gray-400 hover:text-white"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onClose}
                  className="h-8 w-8 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setView('list')}
                  className="h-8 w-8 text-gray-400 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {selectedConversation && (
                  <>
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={selectedConversation.user.avatar} />
                        <AvatarFallback>{selectedConversation.user.name[0]}</AvatarFallback>
                      </Avatar>
                      {selectedConversation.user.isOnline && (
                        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-gray-900" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">
                          {selectedConversation.user.name}
                        </span>
                        <LevelBadge level={selectedConversation.user.level} />
                      </div>
                      <div className="text-xs text-gray-500">
                        {selectedConversation.user.isOnline
                          ? 'Active now'
                          : `Active ${formatDistanceToNow(selectedConversation.user.lastSeen)} ago`}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-gray-400 hover:text-white"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                    View profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                    Mute notifications
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                    Clear chat history
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-400 hover:bg-gray-700">
                    Block user
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
        
        {view === 'list' && (
          <div className="mt-3 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations"
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
            <Button
              size="icon"
              className="h-9 w-9 bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Level Lock */}
      {isLocked && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
              <Lock className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              Reach Level 2 to unlock messages
            </h3>
            <p className="mb-4 text-sm text-gray-400">
              You need {100 - (userLevel - 1) * 100} more points
            </p>
            <div className="mb-4">
              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 transition-all"
                  style={{ width: `${((userLevel - 1) / 1) * 100}%` }}
                />
              </div>
            </div>
            <Button variant="outline" className="border-gray-700 text-emerald-500">
              How to earn points
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      {!isLocked && view === 'list' && (
        <ScrollArea className="flex-1">
          <div className="p-2">
            {sortedConversations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No messages yet</p>
                <p className="text-sm text-gray-600 mt-2">Start a conversation</p>
              </div>
            ) : (
              sortedConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.user.avatar} />
                      <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
                    </Avatar>
                    {conversation.user.isOnline && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-gray-900" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-sm">
                          {conversation.user.name}
                        </span>
                        {conversation.isPinned && (
                          <Badge variant="outline" className="h-4 text-xs border-gray-700">
                            Pinned
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(conversation.lastMessage.timestamp, { addSuffix: false })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400 truncate">
                        {conversation.isTyping ? (
                          <span className="italic">is typing...</span>
                        ) : (
                          <>
                            {conversation.lastMessage.sender === 'me' && (
                              <span className="text-gray-500">You: </span>
                            )}
                            {conversation.lastMessage.content}
                          </>
                        )}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge className="h-5 min-w-[20px] px-1 bg-emerald-600">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      )}

      {/* Chat View */}
      {!isLocked && view === 'chat' && selectedConversation && (
        <>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.sender === 'me' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg px-3 py-2",
                      msg.sender === 'me'
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-800 text-gray-300"
                    )}
                  >
                    {msg.hasAttribution && (
                      <Badge variant="outline" className="mb-1 border-yellow-600 text-yellow-600">
                        Referral tracked
                      </Badge>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs opacity-70">
                        {formatDistanceToNow(msg.timestamp, { addSuffix: false })}
                      </span>
                      {msg.sender === 'me' && (
                        msg.isRead ? (
                          <CheckCheck className="h-3 w-3 opacity-70" />
                        ) : (
                          <Check className="h-3 w-3 opacity-70" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-gray-400 hover:text-white"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-gray-400 hover:text-white"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-gray-400 hover:text-white"
              >
                <Film className="h-4 w-4" />
              </Button>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Message @${selectedConversation.user.username}`}
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                maxLength={5000}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {message.length > 4500 && (
              <div className="text-right mt-1">
                <span className={cn(
                  "text-xs",
                  message.length >= 5000 ? "text-red-500" : "text-gray-500"
                )}>
                  {message.length}/5000
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}