'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronDown, PlayCircle, FileText, Lock, 
  CheckCircle, Circle, Clock, TrendingUp, Users, DollarSign,
  BookOpen, Video, Download, MessageSquare, Star, Zap,
  Trophy, Target, Sparkles, BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  isInProgress?: boolean;
  completedAt?: Date;
  enrollmentsGenerated?: number;
  revenueGenerated?: number;
  engagementRate?: number;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  isExpanded: boolean;
  isLocked: boolean;
  completionPercentage: number;
  totalDuration: string;
  levelRequired?: number;
  dripDate?: Date;
}

interface Course {
  id: string;
  title: string;
  thumbnail?: string;
  description: string;
  modules: Module[];
  instructor: {
    name: string;
    avatar?: string;
  };
  totalLessons: number;
  completedLessons: number;
  totalDuration: string;
  enrollments: number;
  rating: number;
  revenueGenerated?: number;
  completionRate?: number;
  averageEngagement?: number;
  isSelected: boolean;
}

interface CourseModuleTreeProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
  onSelectLesson: (courseId: string, moduleId: string, lessonId: string) => void;
  currentUserId?: string;
  userLevel?: number;
  isInstructor?: boolean;
}

export function CourseModuleTree({
  courses: initialCourses,
  onSelectCourse,
  onSelectLesson,
  currentUserId = 'user1',
  userLevel = 5,
  isInstructor = false
}: CourseModuleTreeProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Auto-select first course if none selected
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
      onSelectCourse(courses[0].id);
    }
  }, [courses]);

  const toggleModule = (courseId: string, moduleId: string) => {
    const key = `${courseId}-${moduleId}`;
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    onSelectCourse(courseId);
  };

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video': return Video;
      case 'text': return FileText;
      case 'quiz': return Target;
      case 'assignment': return BookOpen;
      default: return PlayCircle;
    }
  };

  const getLessonStatusIcon = (lesson: Lesson) => {
    if (lesson.isLocked) return Lock;
    if (lesson.isCompleted) return CheckCircle;
    if (lesson.isInProgress) return Clock;
    return Circle;
  };

  const formatDuration = (duration: string) => {
    return duration;
  };

  const formatRevenue = (amount?: number) => {
    if (!amount) return null;
    return `$${(amount / 100).toLocaleString()}`;
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <div className="flex h-full">
      {/* Course List Sidebar */}
      <div className="w-64 border-r border-zinc-800 bg-zinc-950">
        <div className="p-4 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Your Courses
          </h3>
        </div>
        
        <ScrollArea className="h-[calc(100%-60px)]">
          <div className="p-2 space-y-2">
            {courses.map(course => {
              const isSelected = course.id === selectedCourseId;
              const progressPercentage = course.totalLessons > 0 
                ? Math.round((course.completedLessons / course.totalLessons) * 100)
                : 0;
              
              return (
                <button
                  key={course.id}
                  onClick={() => handleSelectCourse(course.id)}
                  className={cn(
                    "w-full p-3 rounded-lg transition-all text-left group",
                    isSelected 
                      ? "bg-emerald-600/20 border border-emerald-600/50" 
                      : "hover:bg-zinc-900 border border-transparent"
                  )}
                >
                  {/* Course Thumbnail */}
                  {course.thumbnail && (
                    <div className="aspect-video rounded-md overflow-hidden mb-2">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Course Title */}
                  <h4 className={cn(
                    "font-medium text-sm mb-1",
                    isSelected ? "text-white" : "text-zinc-300"
                  )}>
                    {course.title}
                  </h4>
                  
                  {/* Progress Bar */}
                  <div className="mb-2">
                    <Progress 
                      value={progressPercentage} 
                      className="h-1.5"
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                      {course.completedLessons}/{course.totalLessons} lessons • {progressPercentage}%
                    </p>
                  </div>
                  
                  {/* Attribution Metrics (if instructor) */}
                  {isInstructor && course.revenueGenerated && (
                    <div className="flex items-center gap-1 text-xs text-emerald-500">
                      <DollarSign className="w-3 h-3" />
                      <span>Generated {formatRevenue(course.revenueGenerated)}</span>
                    </div>
                  )}
                  
                  {/* Quick Stats */}
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.totalDuration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      {course.rating}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Module & Lesson Tree */}
      {selectedCourse && (
        <div className="flex-1 bg-zinc-950">
          {/* Course Header */}
          <div className="p-6 border-b border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedCourse.title}
                </h2>
                <p className="text-zinc-400 text-sm mb-3">
                  {selectedCourse.description}
                </p>
                
                {/* Course Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                    <span>{selectedCourse.modules.length} modules</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <PlayCircle className="w-4 h-4 text-blue-500" />
                    <span>{selectedCourse.totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span>{selectedCourse.totalDuration}</span>
                  </div>
                  {selectedCourse.enrollments > 0 && (
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span>{selectedCourse.enrollments.toLocaleString()} enrolled</span>
                    </div>
                  )}
                </div>
                
                {/* Instructor View Metrics */}
                {isInstructor && (
                  <div className="mt-3 p-3 bg-emerald-950/30 rounded-lg border border-emerald-900/50">
                    <div className="flex items-center gap-6 text-sm">
                      {selectedCourse.revenueGenerated && (
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-400">
                            Revenue: {formatRevenue(selectedCourse.revenueGenerated)}
                          </span>
                        </div>
                      )}
                      {selectedCourse.completionRate && (
                        <div className="flex items-center gap-1.5">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="text-yellow-400">
                            {selectedCourse.completionRate}% completion rate
                          </span>
                        </div>
                      )}
                      {selectedCourse.averageEngagement && (
                        <div className="flex items-center gap-1.5">
                          <BarChart3 className="w-4 h-4 text-blue-500" />
                          <span className="text-blue-400">
                            {selectedCourse.averageEngagement}% engagement
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Instructor */}
              <div className="flex items-center gap-2 text-sm">
                {selectedCourse.instructor.avatar ? (
                  <img 
                    src={selectedCourse.instructor.avatar} 
                    alt={selectedCourse.instructor.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-zinc-600" />
                  </div>
                )}
                <span className="text-zinc-400">{selectedCourse.instructor.name}</span>
              </div>
            </div>
          </div>
          
          {/* Modules List */}
          <ScrollArea className="h-[calc(100%-200px)]">
            <div className="p-4 space-y-3">
              {selectedCourse.modules.map((module, moduleIndex) => {
                const moduleKey = `${selectedCourse.id}-${module.id}`;
                const isExpanded = expandedModules.has(moduleKey);
                const isModuleLocked = module.isLocked || (module.levelRequired && module.levelRequired > userLevel);
                
                return (
                  <div 
                    key={module.id}
                    className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50"
                  >
                    {/* Module Header */}
                    <button
                      onClick={() => !isModuleLocked && toggleModule(selectedCourse.id, module.id)}
                      disabled={isModuleLocked}
                      className={cn(
                        "w-full p-4 flex items-center justify-between transition-colors",
                        isModuleLocked 
                          ? "opacity-50 cursor-not-allowed" 
                          : "hover:bg-zinc-800/50 cursor-pointer"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {isModuleLocked ? (
                          <Lock className="w-5 h-5 text-zinc-500" />
                        ) : isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-zinc-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-zinc-400" />
                        )}
                        
                        <div className="text-left">
                          <h3 className="font-semibold text-white flex items-center gap-2">
                            <span className="text-zinc-500">Module {moduleIndex + 1}:</span>
                            {module.title}
                            {module.completionPercentage === 100 && (
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                            )}
                          </h3>
                          {module.description && (
                            <p className="text-sm text-zinc-500 mt-0.5">
                              {module.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                            <span>{module.lessons.length} lessons</span>
                            <span>•</span>
                            <span>{module.totalDuration}</span>
                            {module.levelRequired && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-yellow-500">
                                  <Zap className="w-3 h-3" />
                                  Level {module.levelRequired}+
                                </span>
                              </>
                            )}
                            {module.dripDate && module.dripDate > new Date() && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-blue-500">
                                  <Clock className="w-3 h-3" />
                                  Unlocks {module.dripDate.toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {!isModuleLocked && module.completionPercentage > 0 && (
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={module.completionPercentage} 
                              className="w-24 h-2"
                            />
                            <span className="text-xs text-zinc-500">
                              {module.completionPercentage}%
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                    
                    {/* Lessons List */}
                    {isExpanded && !isModuleLocked && (
                      <div className="border-t border-zinc-800">
                        {module.lessons.map((lesson, lessonIndex) => {
                          const StatusIcon = getLessonStatusIcon(lesson);
                          const LessonIcon = getLessonIcon(lesson.type);
                          
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => !lesson.isLocked && onSelectLesson(selectedCourse.id, module.id, lesson.id)}
                              disabled={lesson.isLocked}
                              className={cn(
                                "w-full px-4 py-3 flex items-center justify-between transition-colors border-b border-zinc-800/50 last:border-0",
                                lesson.isLocked
                                  ? "opacity-50 cursor-not-allowed bg-zinc-900/30"
                                  : lesson.isInProgress
                                  ? "bg-emerald-950/20 hover:bg-emerald-950/30"
                                  : lesson.isCompleted
                                  ? "bg-zinc-900/30 hover:bg-zinc-800/30"
                                  : "hover:bg-zinc-800/50 cursor-pointer"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <StatusIcon className={cn(
                                  "w-5 h-5",
                                  lesson.isCompleted ? "text-emerald-500" :
                                  lesson.isInProgress ? "text-blue-500" :
                                  lesson.isLocked ? "text-zinc-600" :
                                  "text-zinc-500"
                                )} />
                                
                                <div className="text-left">
                                  <div className="flex items-center gap-2">
                                    <LessonIcon className="w-4 h-4 text-zinc-500" />
                                    <span className={cn(
                                      "text-sm",
                                      lesson.isCompleted ? "text-zinc-400" : "text-white"
                                    )}>
                                      {lessonIndex + 1}. {lesson.title}
                                    </span>
                                    {lesson.isInProgress && (
                                      <Badge className="text-xs bg-blue-600/20 text-blue-400 border-blue-600/50">
                                        In Progress
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-3 mt-0.5 text-xs text-zinc-500">
                                    <span>{lesson.duration}</span>
                                    {lesson.completedAt && (
                                      <>
                                        <span>•</span>
                                        <span>Completed {lesson.completedAt.toLocaleDateString()}</span>
                                      </>
                                    )}
                                    
                                    {/* Attribution Metrics */}
                                    {isInstructor && (
                                      <>
                                        {lesson.enrollmentsGenerated && lesson.enrollmentsGenerated > 0 && (
                                          <>
                                            <span>•</span>
                                            <span className="text-emerald-500">
                                              {lesson.enrollmentsGenerated} enrollments
                                            </span>
                                          </>
                                        )}
                                        {lesson.revenueGenerated && lesson.revenueGenerated > 0 && (
                                          <>
                                            <span>•</span>
                                            <span className="text-emerald-500">
                                              {formatRevenue(lesson.revenueGenerated)} revenue
                                            </span>
                                          </>
                                        )}
                                        {lesson.engagementRate && (
                                          <>
                                            <span>•</span>
                                            <span className="text-blue-500">
                                              {lesson.engagementRate}% engagement
                                            </span>
                                          </>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {!lesson.isLocked && (
                                <div className="flex items-center gap-2">
                                  {lesson.type === 'video' && (
                                    <PlayCircle className="w-4 h-4 text-zinc-500" />
                                  )}
                                  {lesson.type === 'quiz' && !lesson.isCompleted && (
                                    <Badge className="text-xs bg-purple-600/20 text-purple-400 border-purple-600/50">
                                      Quiz
                                    </Badge>
                                  )}
                                  {lesson.isCompleted && (
                                    <Sparkles className="w-4 h-4 text-emerald-500" />
                                  )}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

// Export mock data for testing
export const mockCourseData: Course[] = [
  {
    id: 'course1',
    title: 'Attribution Mastery',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    description: 'Master the art of tracking and optimizing your revenue attribution',
    instructor: {
      name: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    totalLessons: 24,
    completedLessons: 7,
    totalDuration: '4h 30m',
    enrollments: 1243,
    rating: 4.8,
    revenueGenerated: 458900,
    completionRate: 73,
    averageEngagement: 82,
    isSelected: true,
    modules: [
      {
        id: 'mod1',
        title: 'Getting Started',
        description: 'Foundation concepts and setup',
        isExpanded: true,
        isLocked: false,
        completionPercentage: 100,
        totalDuration: '45 min',
        lessons: [
          {
            id: 'lesson1',
            title: 'Welcome & Course Overview',
            type: 'video',
            duration: '5 min',
            isCompleted: true,
            isLocked: false,
            completedAt: new Date('2024-01-15'),
            enrollmentsGenerated: 45,
            revenueGenerated: 12500
          },
          {
            id: 'lesson2',
            title: 'Setting Up Your Attribution Dashboard',
            type: 'video',
            duration: '12 min',
            isCompleted: true,
            isLocked: false,
            completedAt: new Date('2024-01-16'),
            enrollmentsGenerated: 38,
            revenueGenerated: 9800
          },
          {
            id: 'lesson3',
            title: 'Understanding UTM Parameters',
            type: 'text',
            duration: '8 min',
            isCompleted: true,
            isLocked: false,
            completedAt: new Date('2024-01-17')
          }
        ]
      },
      {
        id: 'mod2',
        title: 'Core Fundamentals',
        description: 'Deep dive into attribution models',
        isExpanded: false,
        isLocked: false,
        completionPercentage: 60,
        totalDuration: '1h 30m',
        lessons: [
          {
            id: 'lesson4',
            title: 'First-Touch vs Last-Touch Attribution',
            type: 'video',
            duration: '15 min',
            isCompleted: true,
            isLocked: false,
            completedAt: new Date('2024-01-18')
          },
          {
            id: 'lesson5',
            title: 'Multi-Touch Attribution Models',
            type: 'video',
            duration: '18 min',
            isCompleted: true,
            isLocked: false,
            completedAt: new Date('2024-01-19'),
            enrollmentsGenerated: 52,
            revenueGenerated: 15600,
            engagementRate: 89
          },
          {
            id: 'lesson6',
            title: 'Data-Driven Attribution',
            type: 'video',
            duration: '20 min',
            isCompleted: true,
            isLocked: false,
            isInProgress: true
          },
          {
            id: 'lesson7',
            title: 'Knowledge Check',
            type: 'quiz',
            duration: '10 min',
            isCompleted: false,
            isLocked: false
          },
          {
            id: 'lesson8',
            title: 'Attribution Case Studies',
            type: 'text',
            duration: '15 min',
            isCompleted: false,
            isLocked: false
          }
        ]
      },
      {
        id: 'mod3',
        title: 'Advanced Strategies',
        description: 'Expert techniques and optimization',
        isExpanded: false,
        isLocked: false,
        completionPercentage: 0,
        totalDuration: '2h',
        levelRequired: 7,
        lessons: [
          {
            id: 'lesson9',
            title: 'Cross-Channel Attribution',
            type: 'video',
            duration: '25 min',
            isCompleted: false,
            isLocked: false
          },
          {
            id: 'lesson10',
            title: 'Offline to Online Attribution',
            type: 'video',
            duration: '22 min',
            isCompleted: false,
            isLocked: false
          },
          {
            id: 'lesson11',
            title: 'Building Custom Attribution Models',
            type: 'assignment',
            duration: '45 min',
            isCompleted: false,
            isLocked: false
          }
        ]
      },
      {
        id: 'mod4',
        title: 'Implementation & Optimization',
        isExpanded: false,
        isLocked: true,
        completionPercentage: 0,
        totalDuration: '1h 15m',
        dripDate: new Date('2024-02-01'),
        lessons: [
          {
            id: 'lesson12',
            title: 'Setting Up Conversion Tracking',
            type: 'video',
            duration: '30 min',
            isCompleted: false,
            isLocked: true
          },
          {
            id: 'lesson13',
            title: 'A/B Testing Your Attribution',
            type: 'video',
            duration: '25 min',
            isCompleted: false,
            isLocked: true
          },
          {
            id: 'lesson14',
            title: 'Final Project',
            type: 'assignment',
            duration: '20 min',
            isCompleted: false,
            isLocked: true
          }
        ]
      }
    ]
  },
  {
    id: 'course2',
    title: 'Community Growth Hacking',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
    description: 'Learn proven strategies to grow your community from 0 to 10k members',
    instructor: {
      name: 'Mike Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    totalLessons: 18,
    completedLessons: 3,
    totalDuration: '3h 15m',
    enrollments: 892,
    rating: 4.9,
    revenueGenerated: 324500,
    completionRate: 68,
    averageEngagement: 75,
    isSelected: false,
    modules: [
      {
        id: 'mod1',
        title: 'Foundation',
        isExpanded: false,
        isLocked: false,
        completionPercentage: 50,
        totalDuration: '1h',
        lessons: [
          {
            id: 'lesson1',
            title: 'Introduction to Community Growth',
            type: 'video',
            duration: '8 min',
            isCompleted: true,
            isLocked: false
          },
          {
            id: 'lesson2',
            title: 'Defining Your Target Audience',
            type: 'video',
            duration: '15 min',
            isCompleted: true,
            isLocked: false
          },
          {
            id: 'lesson3',
            title: 'Creating Your Value Proposition',
            type: 'text',
            duration: '12 min',
            isCompleted: true,
            isLocked: false
          },
          {
            id: 'lesson4',
            title: 'Community Platform Selection',
            type: 'video',
            duration: '10 min',
            isCompleted: false,
            isLocked: false
          }
        ]
      }
    ]
  }
];