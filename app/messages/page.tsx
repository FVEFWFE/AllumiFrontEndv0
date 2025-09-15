'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  Search, Send, Paperclip, Smile, MoreVertical, Phone, Video,
  Info, Archive, Trash2, Star, Bell, BellOff, Check, CheckCheck,
  Users, Settings, Plus, Filter, X, Image as ImageIcon, File
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock conversations data
  const conversations = [
    {
      id: '1',
      user: {
        name: 'Sarah Chen',
        avatar: 'https://picsum.photos/seed/sarah/100/100',
        status: 'online',
        username: 'sarahchen'
      },
      lastMessage: 'That attribution setup really helped!',
      time: '2 min ago',
      unread: 2,
      pinned: true
    },
    {
      id: '2',
      user: {
        name: 'Mike Rodriguez',
        avatar: 'https://picsum.photos/seed/mike/100/100',
        status: 'offline',
        username: 'mikerodriguez',
        lastSeen: '1 hour ago'
      },
      lastMessage: 'Can you review my UTM parameters?',
      time: '1 hour ago',
      unread: 0,
      pinned: false
    },
    {
      id: '3',
      user: {
        name: 'Emily Johnson',
        avatar: 'https://picsum.photos/seed/emily/100/100',
        status: 'away',
        username: 'emilyjohnson'
      },
      lastMessage: 'Thanks for the course recommendation!',
      time: '3 hours ago',
      unread: 0,
      pinned: false
    },
    {
      id: '4',
      user: {
        name: 'Alex Thompson',
        avatar: 'https://picsum.photos/seed/alex/100/100',
        status: 'online',
        username: 'alexthompson'
      },
      lastMessage: 'See you at the event tomorrow',
      time: 'Yesterday',
      unread: 5,
      pinned: false
    },
    {
      id: '5',
      user: {
        name: 'Community Support',
        avatar: 'https://picsum.photos/seed/support/100/100',
        status: 'online',
        username: 'support',
        verified: true
      },
      lastMessage: 'Welcome to Allumi! How can we help?',
      time: '2 days ago',
      unread: 0,
      pinned: true
    }
  ];

  // Mock messages for selected conversation
  const messages = selectedConversation ? [
    {
      id: '1',
      sender: 'them',
      text: 'Hey! I saw your post about attribution tracking',
      time: '10:30 AM',
      read: true
    },
    {
      id: '2',
      sender: 'me',
      text: 'Hi Sarah! Yes, I\'ve been working on implementing better tracking for our community',
      time: '10:32 AM',
      read: true
    },
    {
      id: '3',
      sender: 'them',
      text: 'That\'s awesome! I\'ve been struggling with the same thing. Could you share how you set up UTM parameters for different channels?',
      time: '10:35 AM',
      read: true
    },
    {
      id: '4',
      sender: 'me',
      text: 'Sure! I created a spreadsheet template that helps standardize all our UTM parameters. Let me share it with you',
      time: '10:37 AM',
      read: true,
      attachment: {
        type: 'file',
        name: 'UTM_Template.xlsx',
        size: '145 KB'
      }
    },
    {
      id: '5',
      sender: 'them',
      text: 'This is perfect! Thank you so much 🙏',
      time: '10:40 AM',
      read: true
    },
    {
      id: '6',
      sender: 'them',
      text: 'Quick question - how do you track conversions from organic social?',
      time: '10:42 AM',
      read: true
    },
    {
      id: '7',
      sender: 'me',
      text: 'For organic social, I use link shorteners with UTM parameters. Also, I created separate landing pages for each channel to better track the source',
      time: '10:45 AM',
      read: true
    },
    {
      id: '8',
      sender: 'them',
      text: 'That attribution setup really helped!',
      time: '10:48 AM',
      read: false
    }
  ] : [];

  const selectedUser = conversations.find(c => c.id === selectedConversation)?.user;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would send the message to your backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r border-gray-800 bg-gray-900/50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-white">Messages</h1>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                <Filter className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {conversations
              .filter(conv => 
                conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`
                    w-full p-3 rounded-lg mb-1 text-left transition-colors
                    ${selectedConversation === conversation.id 
                      ? 'bg-emerald-600/20 border border-emerald-600/50' 
                      : 'hover:bg-gray-800/50'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={conversation.user.avatar} />
                        <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
                      </Avatar>
                      {conversation.user.status === 'online' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-gray-900" />
                      )}
                      {conversation.user.status === 'away' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 rounded-full border-2 border-gray-900" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white truncate">
                            {conversation.user.name}
                          </span>
                          {conversation.user.verified && (
                            <Badge className="bg-blue-600 h-4 text-xs">✓</Badge>
                          )}
                          {conversation.pinned && (
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{conversation.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400 truncate">{conversation.lastMessage}</p>
                        {conversation.unread > 0 && (
                          <Badge className="bg-emerald-600 ml-2">{conversation.unread}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedUser?.avatar} />
                  <AvatarFallback>{selectedUser?.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-white">{selectedUser?.name}</h2>
                    {selectedUser?.verified && (
                      <Badge className="bg-blue-600">✓</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    {selectedUser?.status === 'online' 
                      ? 'Active now' 
                      : selectedUser?.lastSeen 
                        ? `Last seen ${selectedUser.lastSeen}`
                        : `@${selectedUser?.username}`
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                  <Video className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                  <Info className="w-5 h-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                    <DropdownMenuItem>
                      <Bell className="w-4 h-4 mr-2" />
                      Mute Notifications
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Archive className="w-4 h-4 mr-2" />
                      Archive Chat
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem className="text-red-400">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Conversation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {/* Date Separator */}
              <div className="flex items-center gap-4 my-4">
                <Separator className="flex-1 bg-gray-800" />
                <span className="text-xs text-gray-500">Today</span>
                <Separator className="flex-1 bg-gray-800" />
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`
                        px-4 py-2 rounded-2xl
                        ${msg.sender === 'me' 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-gray-800 text-white'
                        }
                      `}
                    >
                      <p className="text-sm">{msg.text}</p>
                      
                      {msg.attachment && (
                        <div className="mt-2 p-2 bg-black/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <File className="w-4 h-4" />
                            <div className="flex-1">
                              <p className="text-xs font-medium">{msg.attachment.name}</p>
                              <p className="text-xs opacity-70">{msg.attachment.size}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1 px-2">
                      <span className="text-xs text-gray-500">{msg.time}</span>
                      {msg.sender === 'me' && (
                        msg.read ? (
                          <CheckCheck className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Check className="w-3 h-3 text-gray-400" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={selectedUser?.avatar} />
                    <AvatarFallback>{selectedUser?.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{selectedUser?.name} is typing...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-800 bg-gray-900/50">
            <div className="flex items-end gap-2">
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                <ImageIcon className="w-5 h-5" />
              </Button>
              
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 min-h-[40px] max-h-[120px] bg-gray-800 border-gray-700 text-white resize-none"
                rows={1}
              />
              
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                <Smile className="w-5 h-5" />
              </Button>
              
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="p-4 bg-gray-900/50 rounded-full inline-flex mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Select a conversation</h2>
            <p className="text-gray-400">Choose a conversation from the list to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}