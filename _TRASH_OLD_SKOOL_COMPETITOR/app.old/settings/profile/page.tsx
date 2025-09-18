'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Camera, Save, Globe, Twitter, Github, Linkedin,
  Link as LinkIcon, MapPin, Calendar, Mail, AtSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const [profile, setProfile] = useState({
    username: 'janjegen',
    displayName: 'Jan Jegen',
    email: 'jan@allumi.com',
    bio: 'Building the attribution-first community platform. See exactly what drives revenue.',
    location: 'San Francisco, CA',
    website: 'https://allumi.com',
    twitter: 'janjegen',
    github: 'janjegen',
    linkedin: 'janjegen',
    avatar: 'https://picsum.photos/seed/profile/200/200',
    coverImage: 'https://picsum.photos/seed/cover/1200/300',
    memberSince: 'September 2025',
    verified: true,
    level: 9,
    points: 12450
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Profile Settings</h2>
        <p className="text-gray-400">Manage your public profile and personal information</p>
      </div>

      {isSaved && (
        <Alert className="mb-6 bg-emerald-600/20 border-emerald-600">
          <AlertDescription className="text-emerald-400">
            Your profile has been updated successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Images */}
      <Card className="border-gray-800 bg-gray-900/50 mb-6">
        <CardHeader>
          <CardTitle>Profile Images</CardTitle>
          <CardDescription>Your avatar and cover image</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cover Image */}
          <div>
            <Label>Cover Image</Label>
            <div className="mt-2 relative h-48 bg-gray-800 rounded-lg overflow-hidden">
              <Image
                src={profile.coverImage}
                alt="Cover"
                fill
                className="object-cover"
              />
              <button className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors">
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Avatar */}
          <div>
            <Label>Avatar</Label>
            <div className="mt-2 flex items-center gap-4">
              <div className="relative w-24 h-24">
                <Image
                  src={profile.avatar}
                  alt="Avatar"
                  fill
                  className="rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="text-sm text-gray-400">
                <p>Recommended: 200x200px JPG, PNG</p>
                <p>Max file size: 5MB</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="border-gray-800 bg-gray-900/50 mb-6">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Your public profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <div className="mt-1 flex items-center">
                <span className="px-3 py-2 bg-gray-800 border border-r-0 border-gray-700 rounded-l-lg text-gray-400">
                  @
                </span>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className="rounded-l-none bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">allumi.com/@{profile.username}</p>
            </div>
            
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                className="mt-1 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="mt-1 flex items-center gap-2">
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
              {profile.verified && (
                <Badge className="bg-emerald-600">Verified</Badge>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              className="mt-1 bg-gray-800 border-gray-700 text-white"
              placeholder="Tell us about yourself..."
            />
            <p className="mt-1 text-xs text-gray-500">{profile.bio.length}/500 characters</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <div className="mt-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                  placeholder="City, Country"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="website">Website</Label>
              <div className="mt-1 relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="website"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="border-gray-800 bg-gray-900/50 mb-6">
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>Connect your social media accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="twitter">Twitter</Label>
            <div className="mt-1 relative">
              <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="twitter"
                value={profile.twitter}
                onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
                placeholder="username"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="github">GitHub</Label>
            <div className="mt-1 relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="github"
                value={profile.github}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
                placeholder="username"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <div className="mt-1 relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="linkedin"
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
                placeholder="username"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Stats */}
      <Card className="border-gray-800 bg-gray-900/50 mb-6">
        <CardHeader>
          <CardTitle>Profile Statistics</CardTitle>
          <CardDescription>Your activity and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">Level {profile.level}</div>
              <div className="text-sm text-gray-400">Current Level</div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">{profile.points.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Points</div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-sm text-gray-400">Communities</div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">{profile.memberSince}</div>
              <div className="text-sm text-gray-400">Member Since</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" className="text-gray-400">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}