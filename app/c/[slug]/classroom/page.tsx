'use client';

import { useState } from 'react';
import { 
  PlayCircle, Clock, Users, Star, Lock, CheckCircle, 
  BookOpen, Award, TrendingUp, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getMockData, formatNumber } from '@/lib/mock-data';

const mockData = getMockData();

function CourseCard({ course }: { course: any }) {
  const isLocked = course.price > 0 && !course.progress;
  
  return (
    <Card className="group cursor-pointer border-gray-800 bg-gray-900/50 backdrop-blur transition-all hover:border-emerald-600/50">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Lock className="h-12 w-12 text-gray-400" />
          </div>
        )}
        {course.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between text-sm text-white">
              <span>{course.progress}% complete</span>
              <Progress value={course.progress} className="w-24" />
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2">
          {course.price === 0 && (
            <Badge className="bg-emerald-600">Free</Badge>
          )}
          {course.price > 0 && !course.progress && (
            <Badge className="bg-gray-800">${course.price}</Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-white line-clamp-1">{course.title}</h3>
          <p className="mt-1 text-sm text-gray-400 line-clamp-2">{course.description}</p>
        </div>
        
        <div className="mb-3 flex items-center space-x-4 text-xs text-gray-500">
          <span className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            {course.duration}
          </span>
          <span className="flex items-center">
            <BookOpen className="mr-1 h-3 w-3" />
            {course.lessons} lessons
          </span>
          <span className="flex items-center">
            <Users className="mr-1 h-3 w-3" />
            {formatNumber(course.enrolled)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={course.instructor.avatar} />
              <AvatarFallback>{course.instructor.fullName[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-400">{course.instructor.fullName}</span>
          </div>
          <div className="flex items-center">
            <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span className="text-xs text-gray-400">{course.rating}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ModuleList() {
  const modules = [
    {
      id: 1,
      title: 'Getting Started',
      lessons: 5,
      duration: '45 min',
      completed: true,
    },
    {
      id: 2,
      title: 'Core Fundamentals',
      lessons: 8,
      duration: '1.5 hours',
      completed: true,
    },
    {
      id: 3,
      title: 'Advanced Strategies',
      lessons: 12,
      duration: '2 hours',
      completed: false,
      progress: 60,
    },
    {
      id: 4,
      title: 'Case Studies',
      lessons: 6,
      duration: '1 hour',
      completed: false,
      locked: true,
    },
  ];
  
  return (
    <div className="space-y-2">
      {modules.map((module) => (
        <Card key={module.id} className="border-gray-800 bg-gray-900/50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              {module.completed ? (
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              ) : module.locked ? (
                <Lock className="h-5 w-5 text-gray-500" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-600" />
              )}
              <div>
                <h4 className="font-medium text-white">{module.title}</h4>
                <p className="text-sm text-gray-500">
                  {module.lessons} lessons • {module.duration}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {module.progress !== undefined && (
                <Progress value={module.progress} className="w-24" />
              )}
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ClassroomPage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState('all');
  
  const myCourses = mockData.courses.filter(course => course.progress !== undefined);
  const availableCourses = mockData.courses.filter(course => course.progress === undefined);
  
  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Classroom</h1>
          <p className="text-gray-400">Learn from expert-created courses</p>
        </div>
        
        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-gray-400">Courses Enrolled</p>
                <p className="text-2xl font-bold text-white">{myCourses.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-emerald-500" />
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-gray-400">Hours Learned</p>
                <p className="text-2xl font-bold text-white">24.5</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-gray-400">Certificates</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-gray-400">Streak</p>
                <p className="text-2xl font-bold text-white">7 days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </CardContent>
          </Card>
        </div>
        
        {/* Course Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="border-gray-800 bg-gray-900">
            <TabsTrigger value="all" className="data-[state=active]:bg-emerald-600">
              All Courses
            </TabsTrigger>
            <TabsTrigger value="my" className="data-[state=active]:bg-emerald-600">
              My Courses
            </TabsTrigger>
            <TabsTrigger value="featured" className="data-[state=active]:bg-emerald-600">
              Featured
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            {myCourses.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-white">Continue Learning</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {myCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h2 className="mb-4 text-xl font-semibold text-white">Available Courses</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {availableCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="my" className="space-y-6">
            {myCourses.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="mb-4 h-12 w-12 text-gray-600" />
                  <p className="text-lg font-medium text-white">No courses enrolled yet</p>
                  <p className="mt-2 text-sm text-gray-400">Start learning by enrolling in a course</p>
                  <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                    Browse Courses
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="featured">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockData.courses.slice(0, 3).map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}