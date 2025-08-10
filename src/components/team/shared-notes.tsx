"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { useNotesStore } from "@/hooks/store/use-notes-store";
import { useAuthStore } from "@/hooks/store/use-auth-store";
import { Note } from "@/lib/schemas/note";
import { formatDate } from "@/lib/utils/date";

interface SharedNotesProps {
  subscriptionId: string;
}

export function SharedNotes({ subscriptionId }: SharedNotesProps) {
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notes, addNote, getNotesBySubscription, setNotes } = useNotesStore();
  const { user, canAccessFeature } = useAuthStore();
  
  const subscriptionNotes = getNotesBySubscription(subscriptionId);
  
  // Mock data initialization
  useEffect(() => {
    const mockNotes: Note[] = [
      {
        id: "note-1",
        content: "This subscription needs review next month",
        authorId: "user-1",
        authorName: "John Doe",
        subscriptionId,
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "note-2", 
        content: "Price increased by 20% - consider alternatives",
        authorId: "user-2",
        authorName: "Jane Smith",
        subscriptionId,
        createdAt: new Date("2024-01-20"),
      },
    ];
    setNotes(mockNotes);
  }, [subscriptionId, setNotes]);

  const handleSubmit = async () => {
    if (!newNote.trim() || !user) return;
    
    setIsSubmitting(true);
    try {
      const note: Note = {
        id: `note-${Date.now()}`,
        content: newNote,
        authorId: user.id,
        authorName: user.name || user.email,
        subscriptionId,
        createdAt: new Date(),
      };
      
      addNote(note);
      setNewNote("");
      toast.success("Note added and visible to all team members");
    } catch (error) {
      toast.error("Failed to add note");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!canAccessFeature("shared_notes")) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Team Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Add a note for your team..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
            />
            <Button
              onClick={handleSubmit}
              disabled={!newNote.trim() || isSubmitting}
              size="sm"
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>

          <div className="space-y-3">
            {subscriptionNotes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No notes yet. Be the first to add a team note!
              </p>
            ) : (
              subscriptionNotes
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .map((note) => (
                <div key={note.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {note.authorName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{note.authorName}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {formatDate(note.createdAt)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}