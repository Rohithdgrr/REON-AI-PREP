
"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

export function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('todo-list-tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
        console.error("Could not load tasks from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('todo-list-tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error("Could not save tasks to localStorage", error);
    }
  }, [tasks]);

  const handleAddTask = () => {
    if (inputValue.trim() === '') return;
    const newTask: Task = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const handleToggleTask = (id: number) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleRemoveTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div className="mt-4 space-y-4 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Add a new task..."
        />
        <Button onClick={handleAddTask}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-4">
          {tasks.length > 0 ? tasks.map(task => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-2 rounded-md bg-muted/50"
            >
              <Checkbox
                id={`task-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => handleToggleTask(task.id)}
              />
              <label
                htmlFor={`task-${task.id}`}
                className={cn(
                  "flex-1 text-sm cursor-pointer",
                  task.completed && "line-through text-muted-foreground"
                )}
              >
                {task.text}
              </label>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => handleRemoveTask(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )) : (
            <div className="text-center text-muted-foreground py-16">
                <p>No tasks yet.</p>
                <p className="text-xs">Add a task to get started.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
