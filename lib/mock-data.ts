import { faker } from '@faker-js/faker';

// Types
export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  level: number;
  points: number;
  joinedAt: Date;
  bio: string;
  isOnline: boolean;
  role: 'owner' | 'admin' | 'moderator' | 'member';
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  avatar: string;
  cover: string;
  memberCount: number;
  postCount: number;
  revenue: number;
  isPublic: boolean;
  owner?: string;
  price: {
    monthly: number;
    annual: number;
  };
}

export interface Post {
  id: string;
  author: User;
  community: Community;
  title?: string;
  content: string;
  media?: Array<{
    type: 'image' | 'video' | 'youtube';
    url: string;
    thumbnail?: string;
  }>;
  category: string;
  likes: number;
  comments: number;
  createdAt: Date;
  isPinned: boolean;
  isLocked: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  likes: number;
  createdAt: Date;
  parentId?: string;
}

export interface AttributionSource {
  name: string;
  revenue: number;
  percentage: number;
  conversions: number;
  avgLTV: number;
  trend: 'up' | 'down' | 'stable';
  roi: number;
}

export interface Campaign {
  id: string;
  name: string;
  source: string;
  spend: number;
  revenue: number;
  roi: number;
  conversions: number;
  status: 'active' | 'paused' | 'completed';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: User;
  thumbnail: string;
  duration: string;
  modules: number;
  lessons: number;
  enrolled: number;
  rating: number;
  price: number;
  progress?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  host: User;
  startDate: Date;
  endDate: Date;
  attendees: number;
  maxAttendees: number;
  type: 'online' | 'physical' | 'hybrid';
  coverImage: string;
}

// Level thresholds
const LEVEL_POINTS = [0, 5, 20, 65, 155, 515, 2015, 8015, 33015];

function getLevel(points: number): number {
  for (let i = LEVEL_POINTS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_POINTS[i]) {
      return i + 1;
    }
  }
  return 1;
}

// Mock data generators
export function generateUser(overrides?: Partial<User>): User {
  const points = faker.number.int({ min: 0, max: 50000 });
  return {
    id: faker.string.uuid(),
    username: faker.internet.username(),
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    level: getLevel(points),
    points,
    joinedAt: faker.date.past({ years: 2 }),
    bio: faker.lorem.sentence(),
    isOnline: faker.datatype.boolean({ probability: 0.3 }),
    role: faker.helpers.arrayElement(['owner', 'admin', 'moderator', 'member'] as const),
    ...overrides,
  };
}

export function generateCommunity(overrides?: Partial<Community>): Community {
  const logo = faker.image.urlPicsumPhotos({ width: 100, height: 100 });
  return {
    id: faker.string.uuid(),
    name: faker.company.name() + ' Academy',
    slug: faker.helpers.slugify(faker.company.name()).toLowerCase(),
    description: faker.company.catchPhrase(),
    logo: logo,
    avatar: logo, // Use same image for avatar and logo
    cover: faker.image.urlPicsumPhotos({ width: 1200, height: 400 }),
    memberCount: faker.number.int({ min: 10, max: 5000 }),
    postCount: faker.number.int({ min: 100, max: 10000 }),
    revenue: faker.number.int({ min: 1000, max: 100000 }),
    isPublic: faker.datatype.boolean({ probability: 0.7 }),
    owner: faker.string.uuid(),
    price: {
      monthly: faker.helpers.arrayElement([49, 89, 149]),
      annual: faker.helpers.arrayElement([490, 890, 1490]),
    },
    ...overrides,
  };
}

export function generatePost(author: User, community: Community, overrides?: Partial<Post>): Post {
  const hasTitle = faker.datatype.boolean({ probability: 0.7 });
  const hasMedia = faker.datatype.boolean({ probability: 0.4 });
  
  return {
    id: faker.string.uuid(),
    author,
    community,
    title: hasTitle ? faker.lorem.sentence() : undefined,
    content: faker.lorem.paragraphs({ min: 1, max: 3 }),
    media: hasMedia ? [{
      type: faker.helpers.arrayElement(['image', 'video', 'youtube'] as const),
      url: faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
      thumbnail: faker.image.urlPicsumPhotos({ width: 400, height: 300 }),
    }] : undefined,
    category: faker.helpers.arrayElement(['General', 'Announcements', 'Questions', 'Resources', 'Wins']),
    likes: faker.number.int({ min: 0, max: 500 }),
    comments: faker.number.int({ min: 0, max: 100 }),
    createdAt: faker.date.recent({ days: 30 }),
    isPinned: faker.datatype.boolean({ probability: 0.1 }),
    isLocked: faker.datatype.boolean({ probability: 0.05 }),
    ...overrides,
  };
}

export function generateComment(postId: string, author: User, overrides?: Partial<Comment>): Comment {
  return {
    id: faker.string.uuid(),
    postId,
    author,
    content: faker.lorem.paragraph(),
    likes: faker.number.int({ min: 0, max: 50 }),
    createdAt: faker.date.recent({ days: 7 }),
    ...overrides,
  };
}

export function generateAttributionSource(overrides?: Partial<AttributionSource>): AttributionSource {
  const revenue = faker.number.int({ min: 1000, max: 50000 });
  const spend = faker.number.int({ min: 100, max: 10000 });
  const visitors = faker.number.int({ min: 1000, max: 10000 });
  const conversions = faker.number.int({ min: 10, max: 500 });
  
  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement(['YouTube', 'Google Ads', 'Instagram', 'Facebook', 'Direct', 'Email', 'Reddit', 'Twitter']),
    revenue,
    percentage: faker.number.int({ min: 5, max: 40 }),
    conversions,
    avgLTV: faker.number.int({ min: 50, max: 500 }),
    trend: faker.helpers.arrayElement(['up', 'down', 'stable'] as const),
    roi: Math.round((revenue / spend) * 100),
    spend,
    visitors,
    conversionRate: parseFloat((conversions / visitors * 100).toFixed(2)),
    avgOrderValue: Math.round(revenue / conversions),
    ...overrides,
  };
}

export function generateAttributionData() {
  const sources = Array.from({ length: 7 }, () => generateAttributionSource());
  
  return {
    sources,
    totalRevenue: sources.reduce((sum, s) => sum + s.revenue, 0),
    totalConversions: sources.reduce((sum, s) => sum + s.conversions, 0),
    totalSpend: sources.reduce((sum, s) => sum + s.spend, 0),
    avgROI: Math.round(sources.reduce((sum, s) => sum + s.roi, 0) / sources.length),
  };
}

export function generateCampaign(overrides?: Partial<Campaign>): Campaign {
  const spend = faker.number.int({ min: 100, max: 10000 });
  const revenue = faker.number.int({ min: 0, max: 50000 });
  
  return {
    id: faker.string.uuid(),
    name: faker.company.catchPhrase(),
    source: faker.helpers.arrayElement(['YouTube', 'Google', 'Facebook', 'Instagram']),
    spend,
    revenue,
    roi: Math.round((revenue / spend) * 100),
    conversions: faker.number.int({ min: 0, max: 200 }),
    status: faker.helpers.arrayElement(['active', 'paused', 'completed'] as const),
    ...overrides,
  };
}

export function generateCourse(instructor: User, overrides?: Partial<Course>): Course {
  return {
    id: faker.string.uuid(),
    title: faker.company.catchPhrase() + ' Masterclass',
    description: faker.lorem.paragraph(),
    instructor,
    thumbnail: faker.image.urlPicsumPhotos({ width: 400, height: 225 }),
    duration: faker.number.int({ min: 1, max: 20 }) + ' hours',
    modules: faker.number.int({ min: 3, max: 12 }),
    lessons: faker.number.int({ min: 10, max: 50 }),
    enrolled: faker.number.int({ min: 10, max: 1000 }),
    rating: Number(faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 })),
    price: faker.helpers.arrayElement([0, 49, 99, 199, 499]),
    progress: faker.number.int({ min: 0, max: 100 }),
    ...overrides,
  };
}

export function generateEvent(host: User, overrides?: Partial<Event>): Event {
  const startDate = faker.date.future({ years: 0.5 });
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + faker.number.int({ min: 1, max: 4 }));
  
  const maxAttendees = faker.number.int({ min: 10, max: 500 });
  
  return {
    id: faker.string.uuid(),
    title: faker.company.catchPhrase() + ' Workshop',
    description: faker.lorem.paragraph(),
    host,
    startDate,
    endDate,
    attendees: faker.number.int({ min: 0, max: maxAttendees }),
    maxAttendees,
    type: faker.helpers.arrayElement(['online', 'physical', 'hybrid'] as const),
    coverImage: faker.image.urlPicsumPhotos({ width: 800, height: 400 }),
    ...overrides,
  };
}

// Generate collections
export function generateUsers(count: number): User[] {
  return Array.from({ length: count }, () => generateUser());
}

export function generateCommunities(count: number): Community[] {
  return Array.from({ length: count }, () => generateCommunity());
}

export function generatePosts(count: number, users: User[], community: Community): Post[] {
  return Array.from({ length: count }, () => {
    const author = faker.helpers.arrayElement(users);
    return generatePost(author, community);
  });
}

export function generateComments(count: number, postId: string, users: User[]): Comment[] {
  return Array.from({ length: count }, () => {
    const author = faker.helpers.arrayElement(users);
    return generateComment(postId, author);
  });
}

export function generateAttributionSources(count: number): AttributionSource[] {
  const sources = ['YouTube', 'Google Ads', 'Instagram', 'Facebook', 'Direct', 'Email', 'Reddit', 'Twitter'];
  return sources.slice(0, count).map(name => generateAttributionSource({ name }));
}

export function generateCampaigns(count: number): Campaign[] {
  return Array.from({ length: count }, () => generateCampaign());
}

export function generateCourses(count: number, instructors: User[]): Course[] {
  return Array.from({ length: count }, () => {
    const instructor = faker.helpers.arrayElement(instructors);
    return generateCourse(instructor);
  });
}

export function generateEvents(count: number, hosts: User[]): Event[] {
  return Array.from({ length: count }, () => {
    const host = faker.helpers.arrayElement(hosts);
    return generateEvent(host);
  });
}

// Singleton mock data
let mockData: {
  currentUser: User;
  communities: Community[];
  users: User[];
  posts: Post[];
  attributionSources: AttributionSource[];
  campaigns: Campaign[];
  courses: Course[];
  events: Event[];
} | null = null;

export function getMockData() {
  if (!mockData) {
    const users = generateUsers(50);
    // Generate communities including a demo community
    const communities = [
      // Add demo community first
      generateCommunity({
        id: 'demo',
        name: 'Demo Community',
        slug: 'demo',
        description: 'Experience the power of Allumi attribution tracking',
        memberCount: 1234,
        postCount: 567,
        revenue: 45678,
        owner: users[0].id, // Current user owns demo
      }),
      ...generateCommunities(4)
    ];
    const currentCommunity = communities[0];
    
    mockData = {
      currentUser: users[0],
      communities,
      users,
      posts: generatePosts(20, users, currentCommunity),
      attributionSources: generateAttributionSources(8),
      campaigns: generateCampaigns(10),
      courses: generateCourses(8, users.slice(0, 5)),
      events: generateEvents(6, users.slice(0, 3)),
    };
  }
  
  return mockData;
}

// Utility functions
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;
  return `${Math.floor(seconds / 31536000)}y ago`;
}