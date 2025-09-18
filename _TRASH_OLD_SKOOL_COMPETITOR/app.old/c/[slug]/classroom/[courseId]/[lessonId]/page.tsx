'use client';

import { useState, useRef } from 'react';
import { 
  PlayCircle, PauseCircle, SkipForward, SkipBack, Volume2, 
  Settings, Maximize2, CheckCircle, Lock, Download, 
  FileText, MessageSquare, Bookmark, ChevronLeft, ChevronRight,
  Clock, Award, Share2, MoreVertical, ThumbsUp, Flag
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LessonViewerProps {
  params: {
    slug: string;
    courseId: string;
    lessonId: string;
  };
}

export default function LessonViewer({ params }: LessonViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(3600); // 1 hour in seconds
  const [isCompleted, setIsCompleted] = useState(false);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('transcript');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock lesson data
  const lesson = {
    id: params.lessonId,
    title: 'Introduction to Attribution Marketing',
    description: 'Learn the fundamentals of attribution tracking and how to implement it in your community.',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '12:45',
    instructor: {
      name: 'Jan Jegen',
      avatar: 'https://picsum.photos/seed/instructor/100/100',
      title: 'Attribution Expert'
    },
    course: {
      title: 'Attribution Mastery',
      totalLessons: 12,
      currentLesson: 1
    },
    resources: [
      { name: 'Attribution Setup Guide.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'UTM Builder Template.xlsx', size: '145 KB', type: 'excel' },
      { name: 'Sample Dashboard.png', size: '890 KB', type: 'image' }
    ],
    nextLesson: {
      id: '2',
      title: 'Setting Up UTM Parameters'
    },
    previousLesson: null
  };

  // Mock course modules for sidebar
  const modules = [
    {
      id: '1',
      title: 'Getting Started',
      lessons: [
        { id: '1', title: 'Introduction to Attribution Marketing', duration: '12:45', completed: false, current: true },
        { id: '2', title: 'Setting Up UTM Parameters', duration: '15:30', completed: false, locked: false },
        { id: '3', title: 'Tracking Revenue Sources', duration: '18:20', completed: false, locked: true }
      ]
    },
    {
      id: '2',
      title: 'Advanced Strategies',
      lessons: [
        { id: '4', title: 'Multi-Touch Attribution', duration: '22:15', completed: false, locked: true },
        { id: '5', title: 'Custom Conversion Events', duration: '19:40', completed: false, locked: true },
        { id: '6', title: 'Attribution Reports', duration: '16:55', completed: false, locked: true }
      ]
    }
  ];

  // Mock transcript
  const transcript = [
    { time: '0:00', text: 'Welcome to Attribution Mastery. In this course, we\'ll explore how to track exactly where your revenue comes from.' },
    { time: '0:15', text: 'Attribution is the foundation of data-driven growth. Without it, you\'re flying blind.' },
    { time: '0:30', text: 'By the end of this course, you\'ll know exactly which channels drive the most valuable members.' },
    { time: '0:45', text: 'Let\'s start with the basics. Attribution tracking allows you to connect revenue to its source.' },
    { time: '1:00', text: 'This means you can see if a $99/month member came from YouTube, Twitter, or your email list.' }
  ];

  // Mock comments
  const comments = [
    {
      id: 1,
      user: { name: 'Sarah Chen', avatar: 'https://picsum.photos/seed/user1/100/100' },
      text: 'This is exactly what I needed! The attribution setup has already helped me identify my best channels.',
      time: '2 hours ago',
      likes: 12
    },
    {
      id: 2,
      user: { name: 'Mike Rodriguez', avatar: 'https://picsum.photos/seed/user2/100/100' },
      text: 'Quick question: How do you handle attribution for organic social media posts?',
      time: '5 hours ago',
      likes: 5,
      replies: [
        {
          user: { name: 'Jan Jegen', avatar: 'https://picsum.photos/seed/instructor/100/100' },
          text: 'Great question! I cover this in Lesson 3. The short answer: use link shorteners with UTM parameters.',
          time: '4 hours ago'
        }
      ]
    }
  ];

  const handleMarkComplete = () => {
    setIsCompleted(true);
    // Here you would update the database
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/c/${params.slug}/classroom`} className="text-gray-400 hover:text-white">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="text-sm text-gray-400">{lesson.course.title}</div>
                <h1 className="text-lg font-semibold text-white">{lesson.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Bookmark className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Share2 className="w-5 h-5" />
              </Button>
              <Progress value={(lesson.course.currentLesson / lesson.course.totalLessons) * 100} className="w-32" />
              <span className="text-sm text-gray-400">
                {lesson.course.currentLesson} / {lesson.course.totalLessons} lessons
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1">
          {/* Video Player */}
          <div className="relative bg-black aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full"
              src={lesson.videoUrl}
              poster="https://picsum.photos/seed/video/1920/1080"
            />
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="mb-3">
                <Progress value={(currentTime / duration) * 100} className="h-1" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <PauseCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
                  </Button>
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                    <SkipForward className="w-5 h-5" />
                  </Button>
                  <span className="text-sm text-white">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                    <Volume2 className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                    <Settings className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                    <Maximize2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Below Video */}
          <div className="p-6">
            {/* Lesson Info */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{lesson.title}</h2>
                  <p className="text-gray-400">{lesson.description}</p>
                </div>
                <Button
                  onClick={handleMarkComplete}
                  className={isCompleted ? 'bg-emerald-600' : ''}
                  variant={isCompleted ? 'default' : 'outline'}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    'Mark as Complete'
                  )}
                </Button>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={lesson.instructor.avatar} />
                  <AvatarFallback>JJ</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-white">{lesson.instructor.name}</div>
                  <div className="text-sm text-gray-400">{lesson.instructor.title}</div>
                </div>
                <Button variant="outline" size="sm">Follow</Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-gray-900/50">
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>

              <TabsContent value="transcript" className="mt-6">
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <CardTitle>Video Transcript</CardTitle>
                    <CardDescription>Auto-generated transcript with timestamps</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {transcript.map((item, index) => (
                          <div key={index} className="flex gap-4 group cursor-pointer hover:bg-gray-800/50 p-2 rounded">
                            <span className="text-sm text-emerald-500 font-mono">{item.time}</span>
                            <p className="text-gray-300">{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="mt-6">
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <CardTitle>Lesson Resources</CardTitle>
                    <CardDescription>Download materials and supplementary content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lesson.resources.map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-white">{resource.name}</div>
                              <div className="text-xs text-gray-400">{resource.size}</div>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <CardTitle>Your Notes</CardTitle>
                    <CardDescription>Take notes while watching the lesson</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Type your notes here..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[300px] bg-gray-800 border-gray-700 text-white"
                    />
                    <div className="mt-4 flex justify-end">
                      <Button>Save Notes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comments" className="mt-6">
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <CardTitle>Discussion</CardTitle>
                    <CardDescription>Ask questions and share insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Add Comment */}
                    <div className="mb-6">
                      <Textarea
                        placeholder="Add a comment..."
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <div className="mt-3 flex justify-end">
                        <Button>Post Comment</Button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="border-b border-gray-800 pb-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={comment.user.avatar} />
                              <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-white">{comment.user.name}</span>
                                <span className="text-xs text-gray-400">{comment.time}</span>
                              </div>
                              <p className="text-gray-300">{comment.text}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-white">
                                  <ThumbsUp className="w-4 h-4" />
                                  {comment.likes}
                                </button>
                                <button className="text-sm text-gray-400 hover:text-white">Reply</button>
                                <button className="text-sm text-gray-400 hover:text-white">
                                  <Flag className="w-4 h-4" />
                                </button>
                              </div>
                              {comment.replies && (
                                <div className="mt-4 ml-4 space-y-3">
                                  {comment.replies.map((reply, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                      <Avatar className="w-8 h-8">
                                        <AvatarImage src={reply.user.avatar} />
                                        <AvatarFallback>{reply.user.name[0]}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-semibold text-white text-sm">{reply.user.name}</span>
                                          <Badge className="bg-emerald-600">Instructor</Badge>
                                          <span className="text-xs text-gray-400">{reply.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-300">{reply.text}</p>
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
            </Tabs>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              {lesson.previousLesson ? (
                <Link href={`/c/${params.slug}/classroom/${params.courseId}/${lesson.previousLesson.id}`}>
                  <Button variant="outline">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous Lesson
                  </Button>
                </Link>
              ) : (
                <div />
              )}
              
              {lesson.nextLesson && (
                <Link href={`/c/${params.slug}/classroom/${params.courseId}/${lesson.nextLesson.id}`}>
                  <Button>
                    Next: {lesson.nextLesson.title}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Course Modules */}
        <div className="w-80 border-l border-gray-800 bg-gray-900/50">
          <div className="p-4 border-b border-gray-800">
            <h3 className="font-semibold text-white">Course Content</h3>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-4 space-y-4">
              {modules.map((module) => (
                <div key={module.id}>
                  <h4 className="font-medium text-white mb-2">{module.title}</h4>
                  <div className="space-y-1">
                    {module.lessons.map((moduleLesson) => (
                      <Link
                        key={moduleLesson.id}
                        href={`/c/${params.slug}/classroom/${params.courseId}/${moduleLesson.id}`}
                        className={`
                          block p-3 rounded-lg transition-colors
                          ${moduleLesson.current 
                            ? 'bg-emerald-600/20 border border-emerald-600/50' 
                            : moduleLesson.locked 
                              ? 'bg-gray-800/30 opacity-50 cursor-not-allowed'
                              : 'hover:bg-gray-800/50'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {moduleLesson.completed ? (
                              <CheckCircle className="w-5 h-5 text-emerald-500" />
                            ) : moduleLesson.locked ? (
                              <Lock className="w-5 h-5 text-gray-500" />
                            ) : moduleLesson.current ? (
                              <PlayCircle className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                            )}
                            <div>
                              <div className="text-sm text-white">{moduleLesson.title}</div>
                              <div className="text-xs text-gray-400">{moduleLesson.duration}</div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}