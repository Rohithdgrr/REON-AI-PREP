
"use client";

import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ChevronLeft, ChevronRight, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';

const holidays: { date: string; name: string }[] = [
    { date: "2024-08-15", name: "Independence Day" },
    { date: "2024-08-19", name: "Raksha Bandhan" },
    { date: "2024-08-26", name: "Janmashtami" },
    { date: "2024-10-02", name: "Gandhi Jayanti" },
    { date: "2024-10-12", name: "Dussehra" },
    { date: "2024-10-31", name: "Diwali" },
    { date: "2024-12-25", name: "Christmas Day" },
    { date: "2025-01-14", name: "Makar Sankranti" },
    { date: "2025-01-26", name: "Republic Day" },
    { date: "2025-03-14", name: "Holi" },
];

export function AdvancedCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [specialDays, setSpecialDays] = useState<string[]>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSpecialDays(prev => 
        prev.includes(dateStr) 
            ? prev.filter(d => d !== dateStr)
            : [...prev, dateStr]
    );
  };
  
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOffset = (firstDayOfMonth.getDay() + 6) % 7; // 0=Mon, 1=Tue, ...

  const today = new Date();
  const isCurrentMonthView = today.getFullYear() === year && today.getMonth() === month;

  const upcomingHolidays = useMemo(() => {
    const now = new Date();
    return holidays
        .filter(h => new Date(h.date) >= now)
        .slice(0, 3);
  }, []);

  const DayCell = ({ day, weekdayIndex }: { day: number, weekdayIndex: number }) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const holiday = holidays.find(h => h.date === dateStr);
    const isToday = isCurrentMonthView && day === today.getDate();
    const isSunday = weekdayIndex === 6;
    const isSpecial = specialDays.includes(dateStr);

    const cellContent = (
      <div
        onClick={() => handleDayClick(day)}
        className={cn(
            "flex items-center justify-center h-10 w-10 rounded-full transition-all duration-200 cursor-pointer",
            "hover:bg-accent",
            isSunday && "text-red-500",
            isToday && "bg-primary/20 text-primary border-2 border-primary font-bold",
            holiday && "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-semibold",
            isSpecial && "ring-2 ring-yellow-500 ring-offset-2 ring-offset-background",
        )}
      >
        {day}
      </div>
    );

    if (holiday) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{cellContent}</TooltipTrigger>
            <TooltipContent><p>{holiday.name}</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return cellContent;
  };

  const days = Array.from({ length: startDayOffset + daysInMonth }, (_, i) => {
    if (i < startDayOffset) {
      return null;
    }
    const day = i - startDayOffset + 1;
    const weekdayIndex = (i % 7);
    return { day, weekdayIndex };
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
            {weekdays.map((day, i) => <div key={day} className={cn(i === 6 && "text-red-500/80")}>{day}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
            {days.map((dayObj, index) => (
                <div key={index} className="flex items-center justify-center">
                    {dayObj ? <DayCell day={dayObj.day} weekdayIndex={dayObj.weekdayIndex} /> : <div className="h-10 w-10" />}
                </div>
            ))}
        </div>
        
        <div className="mt-6 space-y-3">
             <h4 className="text-sm font-semibold">Upcoming Holidays</h4>
             {upcomingHolidays.length > 0 ? (
                <div className="space-y-2">
                    {upcomingHolidays.map(holiday => (
                        <div key={holiday.name} className="flex justify-between items-center text-xs p-2 bg-muted/50 rounded-md">
                            <span className="font-medium">{holiday.name}</span>
                            <Badge variant="outline">{new Date(holiday.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</Badge>
                        </div>
                    ))}
                </div>
             ) : (
                <p className="text-xs text-muted-foreground text-center">No upcoming holidays in the list.</p>
             )}
        </div>
        <div className="mt-4 text-xs text-muted-foreground text-center">Click on a date to mark it as a special day <PartyPopper className="inline h-4 w-4 text-yellow-500" /></div>
    </Card>
  );
}
