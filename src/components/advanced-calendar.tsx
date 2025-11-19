"use client";

import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';

export function AdvancedCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOffset = (firstDayOfMonth.getDay() + 6) % 7; // 0=Mon, 1=Tue, ...

  const today = new Date();
  const isCurrentMonthView = today.getFullYear() === year && today.getMonth() === month;

  const days = Array.from({ length: startDayOffset + daysInMonth }, (_, i) => {
    if (i < startDayOffset) {
      return null; // Empty cell
    }
    const day = i - startDayOffset + 1;
    return {
      day,
      isToday: isCurrentMonthView && day === today.getDate(),
    };
  });

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let y = currentYear - 20; y <= currentYear + 10; y++) {
      yearOptions.push(y);
    }
    return yearOptions;
  }, []);

  const months = useMemo(() => [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ], []);


  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleMonthChange = (monthIndex: string) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), parseInt(monthIndex), 1));
  };

  const handleYearChange = (year: string) => {
    setCurrentDate(prev => new Date(parseInt(year), prev.getMonth(), 1));
  };
  
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Card className="w-full max-w-sm mx-auto p-4 sm:p-6 bg-card text-card-foreground">
        <div className="flex justify-between items-center mb-5 font-bold">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="text-primary hover:bg-accent h-9 w-9">
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="flex gap-2">
                <Select value={String(month)} onValueChange={handleMonthChange}>
                    <SelectTrigger className="w-[140px] focus:ring-primary">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((m, i) => <SelectItem key={i} value={String(i)}>{m}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={String(year)} onValueChange={handleYearChange}>
                    <SelectTrigger className="w-[100px] focus:ring-primary">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <Button variant="ghost" size="icon" onClick={handleNextMonth} className="text-primary hover:bg-accent h-9 w-9">
                <ChevronRight className="h-6 w-6" />
            </Button>
        </div>

        <div className="grid grid-cols-7 text-center font-semibold text-muted-foreground text-sm mb-2">
            {weekdays.map(day => <div key={day}>{day}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-2">
            {days.map((dayObj, index) => (
                <div 
                    key={index}
                    className={cn(
                        "flex items-center justify-center h-10 w-10 rounded-full transition-all duration-200",
                        dayObj ? "hover:bg-accent" : "",
                        dayObj?.isToday && "bg-primary/20 text-primary border-2 border-primary font-bold"
                    )}
                >
                    {dayObj?.day}
                </div>
            ))}
        </div>
        
        <div className="text-center mt-4 text-sm text-muted-foreground">
            Today: {today.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
    </Card>
  );
}
