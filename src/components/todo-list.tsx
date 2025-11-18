
"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Trash2, Plus, Check } from 'lucide-react';
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

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    try {
        localStorage.setItem('todo-list-tasks', JSON.stringify(updatedTasks));
    } catch (error) {
        console.error("Could not save tasks to localStorage", error);
    }
  };

  const handleAddTask = () => {
    if (inputValue.trim() === '') return;
    const newTask: Task = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
    };
    saveTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const handleToggleTask = (id: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  const handleRemoveTask = (id: number) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    saveTasks(updatedTasks);
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const completedTasks = tasks.filter(t => t.completed);
  const incompleteTasks = tasks.filter(t => !t.completed);

  return (
    <div className="mt-4 space-y-4 h-[calc(100%-80px)] flex flex-col">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Add a new task..."
          className="h-10"
        />
        <Button onClick={handleAddTask} className="h-10 w-10 p-0 flex-shrink-0">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 -mr-4">
        <div className="space-y-2 pr-4">
          {tasks.length === 0 ? (
             <div className="text-center text-muted-foreground py-16 flex flex-col items-center">
                <Check className="h-16 w-16 opacity-30 mb-4" />
                <p>No tasks yet!</p>
                <p className="text-xs">Add a task above to get started.</p>
            </div>
          ) : (
            <>
              {incompleteTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-2 rounded-md bg-muted/50 transition-all hover:bg-muted"
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id)}
                    className="h-5 w-5"
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={cn("flex-1 text-sm cursor-pointer")}
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
              ))}
              {completedTasks.length > 0 && incompleteTasks.length > 0 && <hr className="my-4 border-border" />}
              {completedTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-2 rounded-md bg-muted/50 opacity-60 transition-all hover:bg-muted"
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id)}
                    className="h-5 w-5"
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={cn(
                      "flex-1 text-sm cursor-pointer",
                      "line-through text-muted-foreground"
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
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
