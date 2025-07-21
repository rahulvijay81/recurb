"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

interface Note {
  id: string;
  content: string;
  author: string;
  authorInitials: string;
  createdAt: Date;
  subscriptionId: string;
}

interface SharedNotesProps {
  subscriptionId: string;
  notes?: Note[];
  onAddNote?: (content: string) => void;
}

export function SharedNotes({ subscriptionId, notes = [], onAddNote }: SharedNotesProps) {
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newNote.trim()) return;
    
    setIsSubmitting(true);
    try {
      onAddNote?.(newNote);
      setNewNote("");
      toast.success("Note added successfully");
    } catch (error) {
      toast.error("Failed to add note");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No notes yet. Be the first to add a team note!
              </p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {note.authorInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{note.author}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {note.createdAt.toLocaleDateString()}
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