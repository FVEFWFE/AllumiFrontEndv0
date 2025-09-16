'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipBack, SkipForward, Settings, Download, MessageSquare,
  ChevronLeft, ChevronRight, FileText, Link2, CheckCircle,
  Clock, Users, TrendingUp, DollarSign, BookOpen, Star,
  ThumbsUp, Share2, Bookmark, MoreVertical, Subtitles,
  PlayCircle, AlertCircle, Lock, Sparkles, Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'zip' | 'link';
  size?: string;
  url: string;
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    isInstructor?: boolean;
  };
  content: string;
  timestamp: Date;
  likes: number;
  isPinned?: boolean;
  replies?: Comment[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  videoUrl?: string;
  content?: string;
  duration: string;
  instructor: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  enrollmentsGenerated?: number;
  revenueGenerated?: number;
  completionRate?: number;
  resources: Resource[];
  nextLesson?: {
    id: string;
    title: string;
  };
  previousLesson?: {
    id: string;
    title: string;
  };
}

interface LessonViewerProps {
  lesson: Lesson;
  courseTitle: string;
  moduleTitle: string;
  currentProgress: number;
  totalLessons: number;
  onComplete: () => void;
  onNavigate: (lessonId: string) => void;
  isInstructor?: boolean;
  userLevel?: number;
}

export function LessonViewer({
  lesson,
  courseTitle,
  moduleTitle,
  currentProgress,
  totalLessons,
  onComplete,
  onNavigate,
  isInstructor = false,
  userLevel = 5
}: LessonViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [comment, setComment] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Mock data
  const comments: Comment[] = [
    {
      id: '1',
      author: {
        name: lesson.instructor.name,
        avatar: lesson.instructor.avatar,
        isInstructor: true
      },
      content: 'Welcome to this lesson! Feel free to ask any questions in the comments.',
      timestamp: new Date('2024-01-15'),
      likes: 24,
      isPinned: true,
      replies: [
        {
          id: '1-1',
          author: { name: 'Alex Chen' },
          content: 'This is exactly what I needed to understand attribution!',
          timestamp: new Date('2024-01-16'),
          likes: 5
        }
      ]
    },
    {
      id: '2',
      author: { name: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?img=5' },
      content: 'The examples at 3:45 really helped clarify the concept. Thanks!',
      timestamp: new Date('2024-01-17'),
      likes: 12
    }
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, []);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (!isCompleted) {
      setIsCompleted(true);
      // Show completion celebration
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = value[0];
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newVolume = value[0];
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const container = document.getElementById('video-container');
    if (!container) return;

    if (!isFullscreen) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatRevenue = (amount?: number) => {
    if (!amount) return null;
    return `$${(amount / 100).toLocaleString()}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
            <span>{courseTitle}</span>
            <ChevronRight className="w-4 h-4" />
            <span>{moduleTitle}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{lesson.title}</span>
          </div>
          
          {/* Title and Progress */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
                <span>Lesson {currentProgress} of {totalLessons}</span>
                <span>•</span>
                <span>{lesson.duration}</span>
                {lesson.enrollmentsGenerated && isInstructor && (
                  <>
                    <span>•</span>
                    <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-600/50">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {lesson.enrollmentsGenerated} enrollments driven
                    </Badge>
                  </>
                )}
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => lesson.previousLesson && onNavigate(lesson.previousLesson.id)}
                disabled={!lesson.previousLesson}
                className="border-zinc-800"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => lesson.nextLesson && onNavigate(lesson.nextLesson.id)}
                disabled={!lesson.nextLesson}
                className="border-zinc-800"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          {lesson.type === 'video' && lesson.videoUrl && (
            <div 
              id="video-container"
              className="relative aspect-video bg-black rounded-lg overflow-hidden group"
              onMouseMove={handleMouseMove}
            >
              <video
                ref={videoRef}
                src={lesson.videoUrl}
                className="w-full h-full"
                onClick={togglePlayPause}
              />
              
              {/* Custom Controls Overlay */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity",
                showControls ? "opacity-100" : "opacity-0"
              )}>
                {/* Center Play Button */}
                {!isPlaying && (
                  <button
                    onClick={togglePlayPause}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </button>
                )}
                
                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                  {/* Progress Bar */}
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="w-full"
                  />
                  
                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={togglePlayPause}
                        className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 text-white" />
                        ) : (
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => skip(-10)}
                        className="text-white hover:text-zinc-300 transition-colors"
                      >
                        <SkipBack className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => skip(10)}
                        className="text-white hover:text-zinc-300 transition-colors"
                      >
                        <SkipForward className="w-5 h-5" />
                      </button>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={toggleMute}
                          className="text-white hover:text-zinc-300 transition-colors"
                        >
                          {isMuted ? (
                            <VolumeX className="w-5 h-5" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                        </button>
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          max={1}
                          step={0.1}
                          onValueChange={handleVolumeChange}
                          className="w-20"
                        />
                      </div>
                      
                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowTranscript(!showTranscript)}
                        className={cn(
                          "text-white hover:text-zinc-300 transition-colors",
                          showTranscript && "text-emerald-400"
                        )}
                      >
                        <Subtitles className="w-5 h-5" />
                      </button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-white hover:text-zinc-300 transition-colors">
                            <Settings className="w-5 h-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                          <DropdownMenuItem className="text-zinc-300">
                            Quality: Auto
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-zinc-800" />
                          <DropdownMenuItem 
                            onClick={() => changePlaybackRate(0.5)}
                            className={cn(
                              "text-zinc-300",
                              playbackRate === 0.5 && "text-emerald-400"
                            )}
                          >
                            0.5x Speed
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => changePlaybackRate(1)}
                            className={cn(
                              "text-zinc-300",
                              playbackRate === 1 && "text-emerald-400"
                            )}
                          >
                            1x Speed (Normal)
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => changePlaybackRate(1.5)}
                            className={cn(
                              "text-zinc-300",
                              playbackRate === 1.5 && "text-emerald-400"
                            )}
                          >
                            1.5x Speed
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => changePlaybackRate(2)}
                            className={cn(
                              "text-zinc-300",
                              playbackRate === 2 && "text-emerald-400"
                            )}
                          >
                            2x Speed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <button
                        onClick={toggleFullscreen}
                        className="text-white hover:text-zinc-300 transition-colors"
                      >
                        {isFullscreen ? (
                          <Minimize className="w-5 h-5" />
                        ) : (
                          <Maximize className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Completion Overlay */}
              {isCompleted && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center animate-in fade-in zoom-in">
                  <div className="text-center">
                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Lesson Complete!</h3>
                    <p className="text-zinc-400 mb-4">Great job! You've earned 10 XP</p>
                    <div className="flex items-center gap-2 justify-center">
                      <Button
                        onClick={() => lesson.nextLesson && onNavigate(lesson.nextLesson.id)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Continue to Next Lesson
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-zinc-900 border-zinc-800">
              <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600">
                Overview
              </TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-emerald-600">
                Resources
              </TabsTrigger>
              <TabsTrigger value="comments" className="data-[state=active]:bg-emerald-600">
                Comments ({comments.length})
              </TabsTrigger>
              {showTranscript && (
                <TabsTrigger value="transcript" className="data-[state=active]:bg-emerald-600">
                  Transcript
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <Card className="border-zinc-800 bg-zinc-900/50">
                <CardContent className="p-6">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-zinc-300">{lesson.description}</p>
                    
                    {lesson.content && (
                      <div className="mt-6" dangerouslySetInnerHTML={{ __html: lesson.content }} />
                    )}
                    
                    {/* Action Items */}
                    <div className="mt-8 p-4 bg-zinc-800/50 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-3">Action Items</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                          <span className="text-zinc-300">Set up your attribution dashboard</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Circle className="w-5 h-5 text-zinc-500 mt-0.5" />
                          <span className="text-zinc-300">Create UTM parameters for your next campaign</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Circle className="w-5 h-5 text-zinc-500 mt-0.5" />
                          <span className="text-zinc-300">Review the supplementary materials</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Mark Complete Button */}
                  {!isCompleted && (
                    <div className="mt-6 flex items-center justify-between">
                      <p className="text-sm text-zinc-500">
                        Mark this lesson as complete to unlock the next one
                      </p>
                      <Button 
                        onClick={() => {
                          setIsCompleted(true);
                          onComplete();
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Complete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resources" className="mt-6">
              <Card className="border-zinc-800 bg-zinc-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Downloadable Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lesson.resources.map(resource => (
                    <div 
                      key={resource.id}
                      className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-zinc-400" />
                        <div>
                          <p className="text-white font-medium">{resource.title}</p>
                          {resource.size && (
                            <p className="text-xs text-zinc-500">{resource.type.toUpperCase()} • {resource.size}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-emerald-400 hover:text-emerald-300"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="comments" className="mt-6">
              <Card className="border-zinc-800 bg-zinc-900/50">
                <CardContent className="p-6">
                  {/* Add Comment */}
                  <div className="mb-6">
                    <Textarea
                      placeholder="Ask a question or share your thoughts..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    <Button 
                      className="mt-2 bg-emerald-600 hover:bg-emerald-700"
                      disabled={!comment.trim()}
                    >
                      Post Comment
                    </Button>
                  </div>
                  
                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.map(comment => (
                      <div key={comment.id} className="space-y-3">
                        {comment.isPinned && (
                          <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-600/50">
                            📌 Pinned by instructor
                          </Badge>
                        )}
                        <div className="flex gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={comment.author.avatar} />
                            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-white">{comment.author.name}</span>
                              {comment.author.isInstructor && (
                                <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-600/50 text-xs">
                                  Instructor
                                </Badge>
                              )}
                              <span className="text-xs text-zinc-500">
                                {comment.timestamp.toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-zinc-300">{comment.content}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <button className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300">
                                <ThumbsUp className="w-4 h-4" />
                                {comment.likes}
                              </button>
                              <button className="text-sm text-zinc-500 hover:text-zinc-300">
                                Reply
                              </button>
                            </div>
                            
                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="mt-3 ml-6 space-y-3 border-l-2 border-zinc-800 pl-4">
                                {comment.replies.map(reply => (
                                  <div key={reply.id} className="flex gap-2">
                                    <Avatar className="w-8 h-8">
                                      <AvatarImage src={reply.author.avatar} />
                                      <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-medium text-white">{reply.author.name}</span>
                                        <span className="text-xs text-zinc-500">
                                          {reply.timestamp.toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="text-sm text-zinc-300">{reply.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transcript" className="mt-6">
              <Card className="border-zinc-800 bg-zinc-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Video Transcript</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4 pr-4">
                      <div>
                        <span className="text-xs text-zinc-500">00:00</span>
                        <p className="text-zinc-300 mt-1">
                          Welcome to this lesson on attribution modeling. Today we're going to explore how to track 
                          and optimize your revenue attribution across multiple channels.
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-zinc-500">00:15</span>
                        <p className="text-zinc-300 mt-1">
                          First, let's understand what attribution means in the context of digital marketing...
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-zinc-500">00:45</span>
                        <p className="text-zinc-300 mt-1">
                          The key difference between first-touch and last-touch attribution is...
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Your Progress */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white">Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-400">Course Completion</span>
                  <span className="text-white font-medium">
                    {Math.round((currentProgress / totalLessons) * 100)}%
                  </span>
                </div>
                <Progress value={(currentProgress / totalLessons) * 100} className="h-2" />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Lessons Completed</span>
                  <span className="text-white">{currentProgress - 1}/{totalLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Time Invested</span>
                  <span className="text-white">3h 24m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Est. Time Remaining</span>
                  <span className="text-white">45 min</span>
                </div>
              </div>
              
              {lesson.nextLesson && (
                <Button 
                  onClick={() => onNavigate(lesson.nextLesson!.id)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Next: {lesson.nextLesson.title}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </CardContent>
          </Card>
          
          {/* Course Info */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white">Course Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Instructor */}
              <div className="flex items-center gap-3">
                {lesson.instructor.avatar ? (
                  <img 
                    src={lesson.instructor.avatar} 
                    alt={lesson.instructor.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-zinc-600" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-white">{lesson.instructor.name}</p>
                  <p className="text-sm text-zinc-500">Instructor</p>
                </div>
              </div>
              
              {lesson.instructor.bio && (
                <p className="text-sm text-zinc-400">{lesson.instructor.bio}</p>
              )}
              
              {/* Stats */}
              <div className="space-y-2 pt-4 border-t border-zinc-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Difficulty</span>
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/50">
                    Intermediate
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Duration</span>
                  <span className="text-white">{lesson.duration}</span>
                </div>
                {lesson.completionRate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Avg Completion</span>
                    <span className="text-white">{lesson.completionRate}%</span>
                  </div>
                )}
              </div>
              
              {/* Attribution Stats (Instructor View) */}
              {isInstructor && (lesson.enrollmentsGenerated || lesson.revenueGenerated) && (
                <div className="space-y-2 pt-4 border-t border-zinc-800">
                  <h4 className="text-sm font-medium text-white mb-2">Lesson Performance</h4>
                  {lesson.enrollmentsGenerated && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Enrollments</span>
                      <span className="text-emerald-400">+{lesson.enrollmentsGenerated}</span>
                    </div>
                  )}
                  {lesson.revenueGenerated && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Revenue</span>
                      <span className="text-emerald-400">{formatRevenue(lesson.revenueGenerated)}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Export mock lesson data
export const mockLessonData: Lesson = {
  id: 'lesson1',
  title: 'Understanding Attribution Models',
  description: 'Learn the fundamentals of attribution modeling and how it impacts your marketing decisions. This lesson covers first-touch, last-touch, and multi-touch attribution models.',
  type: 'video',
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  duration: '15 min',
  instructor: {
    name: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Marketing analytics expert with 10+ years of experience in attribution modeling.'
  },
  enrollmentsGenerated: 45,
  revenueGenerated: 12500,
  completionRate: 87,
  resources: [
    {
      id: 'r1',
      title: 'Attribution Models Cheat Sheet',
      type: 'pdf',
      size: '2.3 MB',
      url: '#'
    },
    {
      id: 'r2',
      title: 'Excel Template - Attribution Calculator',
      type: 'doc',
      size: '1.1 MB',
      url: '#'
    },
    {
      id: 'r3',
      title: 'Additional Reading Materials',
      type: 'zip',
      size: '5.4 MB',
      url: '#'
    }
  ],
  nextLesson: {
    id: 'lesson2',
    title: 'Setting Up Tracking Parameters'
  },
  previousLesson: undefined,
  content: `
    <h2>Key Concepts</h2>
    <ul>
      <li>Understanding the customer journey</li>
      <li>Different attribution models and their use cases</li>
      <li>How to choose the right model for your business</li>
      <li>Common pitfalls to avoid</li>
    </ul>
    
    <h2>What You'll Learn</h2>
    <p>By the end of this lesson, you'll be able to:</p>
    <ol>
      <li>Explain the difference between various attribution models</li>
      <li>Identify which model best suits your business goals</li>
      <li>Set up basic attribution tracking</li>
      <li>Interpret attribution data to make better decisions</li>
    </ol>
  `
};