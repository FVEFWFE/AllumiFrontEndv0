'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield, Edit2, Save, X, Plus, Trash2, GripVertical } from 'lucide-react';
import Link from 'next/link';

interface Rule {
  id: string;
  title: string;
  description: string;
  order: number;
}

export default function CommunityRulesPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [isOwner, setIsOwner] = useState(true); // For demo, owner can edit
  const [isEditing, setIsEditing] = useState(false);
  const [rules, setRules] = useState<Rule[]>([
    { id: '1', title: 'Be respectful', description: 'Treat all members with respect and kindness. Personal attacks, harassment, or hate speech will not be tolerated.', order: 1 },
    { id: '2', title: 'No spam or self-promotion', description: 'Do not post spam, advertisements, or excessive self-promotion without permission from moderators.', order: 2 },
    { id: '3', title: 'Stay on topic', description: 'Keep discussions relevant to the community theme and purpose. Off-topic posts may be removed.', order: 3 },
    { id: '4', title: 'No illegal content', description: 'Do not share copyrighted material, illegal content, or anything that violates laws or regulations.', order: 4 },
    { id: '5', title: 'Protect privacy', description: 'Do not share personal information about yourself or others without consent.', order: 5 },
  ]);
  const [editedRules, setEditedRules] = useState<Rule[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    // Load rules from localStorage for this community
    const storedRules = localStorage.getItem(`community-rules-${slug}`);
    if (storedRules) {
      setRules(JSON.parse(storedRules));
    }
  }, [slug]);

  const handleStartEdit = () => {
    setEditedRules([...rules]);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedRules([]);
    setIsEditing(false);
  };

  const handleSaveRules = () => {
    const sortedRules = editedRules.map((rule, index) => ({
      ...rule,
      order: index + 1
    }));
    setRules(sortedRules);
    localStorage.setItem(`community-rules-${slug}`, JSON.stringify(sortedRules));
    setIsEditing(false);
  };

  const handleAddRule = () => {
    const newRule: Rule = {
      id: `rule-${Date.now()}`,
      title: '',
      description: '',
      order: editedRules.length + 1
    };
    setEditedRules([...editedRules, newRule]);
  };

  const handleUpdateRule = (id: string, field: 'title' | 'description', value: string) => {
    setEditedRules(editedRules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const handleDeleteRule = (id: string) => {
    setEditedRules(editedRules.filter(rule => rule.id !== id));
  };

  const handleDragStart = (e: React.DragEvent, ruleId: string) => {
    setDraggedItem(ruleId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = editedRules.findIndex(r => r.id === draggedItem);
    const targetIndex = editedRules.findIndex(r => r.id === targetId);

    const newRules = [...editedRules];
    const [removed] = newRules.splice(draggedIndex, 1);
    newRules.splice(targetIndex, 0, removed);

    setEditedRules(newRules);
    setDraggedItem(null);
  };

  const displayRules = isEditing ? editedRules : rules;

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link href={`/c/${slug}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Community
          </Button>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-emerald-500" />
            <div>
              <h1 className="text-3xl font-bold">Community Rules</h1>
              <p className="text-muted-foreground">Guidelines for participating in this community</p>
            </div>
          </div>

          {isOwner && !isEditing && (
            <Button onClick={handleStartEdit} variant="outline">
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Rules
            </Button>
          )}

          {isEditing && (
            <div className="flex gap-2">
              <Button onClick={handleCancelEdit} variant="outline">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSaveRules} className="bg-emerald-500 hover:bg-emerald-600">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          {displayRules.map((rule, index) => (
            <Card 
              key={rule.id} 
              className="cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, rule.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, rule.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground mt-2" />
                  <div className="flex-1 space-y-3">
                    <div>
                      <Label htmlFor={`title-${rule.id}`}>Rule #{index + 1} Title</Label>
                      <Input
                        id={`title-${rule.id}`}
                        value={rule.title}
                        onChange={(e) => handleUpdateRule(rule.id, 'title', e.target.value)}
                        placeholder="Enter rule title..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`desc-${rule.id}`}>Description</Label>
                      <Textarea
                        id={`desc-${rule.id}`}
                        value={rule.description}
                        onChange={(e) => handleUpdateRule(rule.id, 'description', e.target.value)}
                        placeholder="Enter rule description..."
                        className="mt-1 min-h-[80px]"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDeleteRule(rule.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button 
            onClick={handleAddRule} 
            variant="outline" 
            className="w-full border-dashed"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Rule
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayRules.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No rules yet</h3>
                <p className="text-muted-foreground">
                  {isOwner ? 'Click "Edit Rules" to add community guidelines' : 'The community owner hasn\'t set any rules yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            displayRules.map((rule, index) => (
              <Card key={rule.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">{index + 1}.</span>
                    {rule.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {rule.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {!isEditing && displayRules.length > 0 && (
        <Card className="mt-8 bg-muted/50">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              By participating in this community, you agree to follow these rules. 
              Violations may result in warnings, content removal, or removal from the community.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}