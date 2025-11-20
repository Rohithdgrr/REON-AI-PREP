
"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Trash2, Plus, Edit, Save, X, Notebook } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";


type Note = {
  id: number;
  title: string;
  content: string;
  lastModified: number;
};

export function SimpleNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem('simple-notes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error("Could not load notes from localStorage", error);
    }
  }, []);

  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    try {
      localStorage.setItem('simple-notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error("Could not save notes to localStorage", error);
    }
  };

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      lastModified: Date.now(),
    };
    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    setSelectedNote(newNote);
    setIsEditing(true);
  };
  
  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(false);
  }

  const handleUpdateNote = (id: number, title: string, content: string) => {
    // Also update the selected note in real-time
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote({ ...selectedNote, title, content, lastModified: Date.now() });
    }
  };

  const handleSaveEdits = () => {
    if (!selectedNote) return;
    const updatedNotes = notes.map(note =>
      note.id === selectedNote.id ? { ...selectedNote, lastModified: Date.now() } : note
    );
    saveNotes(updatedNotes);
    setIsEditing(false);
  }

  const handleDeleteNote = (id: number) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
    if(selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  if (!selectedNote) {
     return (
        <div className="mt-4 space-y-4 h-[calc(100%-80px)] flex flex-col">
            <Button onClick={handleAddNote} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> New Note
            </Button>
            <ScrollArea className="flex-1 -mr-4">
                <div className="space-y-2 pr-4">
                    {notes.length > 0 ? notes.sort((a,b) => b.lastModified - a.lastModified).map(note => (
                         <Card key={note.id} className="cursor-pointer hover:bg-muted" onClick={() => handleSelectNote(note)}>
                            <CardHeader className="p-3">
                                <CardTitle className="text-sm truncate">{note.title}</CardTitle>
                                <p className="text-xs text-muted-foreground pt-1">
                                    {new Date(note.lastModified).toLocaleDateString()}
                                </p>
                            </CardHeader>
                         </Card>
                    )) : (
                         <div className="text-center text-muted-foreground py-16 flex flex-col items-center">
                            <Notebook className="h-16 w-16 opacity-30 mb-4" />
                            <p>No notes yet!</p>
                            <p className="text-xs">Create a new note to get started.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
     );
  }

  return (
    <div className="mt-4 flex flex-col h-[calc(100%-80px)]">
      <div className="flex items-center justify-between mb-4">
         <Button variant="outline" size="sm" onClick={() => setSelectedNote(null)}>
            <X className="mr-2 h-4 w-4" /> All Notes
        </Button>
         <div className="flex gap-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>
                    <p>This will permanently delete the note titled "{selectedNote.title}".</p>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                         <DialogClose asChild>
                            <Button variant="destructive" onClick={() => handleDeleteNote(selectedNote.id)}>Delete</Button>
                         </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Button size="sm" onClick={() => {
                if (isEditing) {
                    handleSaveEdits();
                } else {
                    setIsEditing(true)
                }
            }}>
                {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                {isEditing ? 'Save' : 'Edit'}
            </Button>
        </div>
      </div>
      {isEditing ? (
        <div className="flex-1 flex flex-col gap-2">
          <Input 
            value={selectedNote.title} 
            onChange={(e) => handleUpdateNote(selectedNote.id, e.target.value, selectedNote.content)}
            className="text-lg font-semibold"
          />
          <Textarea 
            value={selectedNote.content}
            onChange={(e) => handleUpdateNote(selectedNote.id, selectedNote.title, e.target.value)}
            className="flex-1 resize-none"
          />
        </div>
      ) : (
        <ScrollArea className="flex-1 -mr-4">
          <div className="space-y-4 pr-4">
            <h2 className="text-2xl font-bold font-headline">{selectedNote.title}</h2>
            <p className="text-sm text-muted-foreground">Last modified: {new Date(selectedNote.lastModified).toLocaleString()}</p>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {selectedNote.content || <p className="italic text-muted-foreground">This note is empty. Click 'Edit' to start writing.</p>}
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
