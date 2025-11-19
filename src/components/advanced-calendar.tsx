
"use client";

import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ChevronLeft, ChevronRight, PartyPopper, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';

const holidays: { date: string; name: string }[] = [
    // 2025 Gazetted Holidays
    { date: "2025-01-01", name: "New Year's Day" },
    { date: "2025-01-14", name: "Makar Sankranti / Pongal" },
    { date: "2025-01-26", name: "Republic Day" },
    { date: "2025-02-26", name: "Maha Shivratri" },
    { date: "2025-03-13", name: "Holika Dahan" },
    { date: "2025-03-14", name: "Holi" },
    { date: "2025-03-30", name: "Eid-ul-Fitr" },
    { date: "2025-04-03", name: "Mahavir Jayanti" },
    { date: "2025-04-10", name: "Good Friday" },
    { date: "2025-04-13", name: "Vaisakhi / Bishubu / Mesadi" },
    { date: "2025-05-18", name: "Buddha Purnima" },
    { date: "2025-06-07", name: "Eid-ul-Zuha (Bakrid)" },
    { date: "2025-06-27", name: "Rath Yatra" },
    { date: "2025-08-15", name: "Independence Day" },
    { date: "2025-10-02", name: "Mahatma Gandhi Jayanti" },
    { date: "2025-10-08", name: "Dussehra (Maha Navami)" },
    { date: "2025-10-20", name: "Diwali (Deepavali)" },
    { date: "2025-11-09", name: "Guru Nanak Jayanti / Kartik Purnima" },
    { date: "2025-12-25", name: "Christmas Day" },
    
    // Some 2024 holidays for context
    { date: "2024-08-15", name: "Independence Day" },
    { date: "2024-08-19", name: "Raksha Bandhan" },
    { date: "2024-08-26", name: "Janmashtami" },
    { date: "2024-10-02", name: "Gandhi Jayanti" },
    { date: "2024-10-12", name: "Dussehra" },
    { date: "2024-10-31", name: "Diwali" },
    { date: "2024-12-25", name: "Christmas Day" },
];

type SpecialDay = {
    date: string;
    name: string;
};

export function AdvancedCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([]);
  const [newSpecialDay, setNewSpecialDay] = useState({ date: '', name: '' });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOffset = (firstDayOfMonth.getDay() + 6) % 7; // 0=Mon, 1=Tue, ...

  const today = new Date();
  const isCurrentMonthView = today.getFullYear() === year && today.getMonth() === month;

  const holidaysInMonth = useMemo(() => {
    return holidays
        .filter(h => {
            const holidayDate = new Date(h.date);
            return holidayDate.getFullYear() === year && holidayDate.getMonth() === month;
        })
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [year, month]);

  const handleAddSpecialDay = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSpecialDay.date && newSpecialDay.name) {
        setSpecialDays(prev => [...prev, newSpecialDay].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        setNewSpecialDay({ date: '', name: '' });
    }
  }

  const handleRemoveSpecialDay = (dateToRemove: string) => {
    setSpecialDays(prev => prev.filter(d => d.date !== dateToRemove));
  }

  const DayCell = ({ day, weekdayIndex }: { day: number, weekdayIndex: number }) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const holiday = holidays.find(h => h.date === dateStr);
    const specialDay = specialDays.find(d => d.date === dateStr);
    const isToday = isCurrentMonthView && day === today.getDate();
    const isSunday = weekdayIndex === 6;

    const cellContent = (
      <div
        className={cn(
            "flex items-center justify-center h-10 w-10 rounded-full transition-all duration-200",
            isSunday && "text-red-500",
            isToday && "bg-primary/20 text-primary border-2 border-primary font-bold",
            holiday && "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-semibold",
            specialDay && "ring-2 ring-yellow-500 ring-offset-2 ring-offset-background",
        )}
      >
        {day}
      </div>
    );
    
    const tooltipContent = holiday?.name || specialDay?.name;

    if (tooltipContent) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{cellContent}</TooltipTrigger>
            <TooltipContent><p>{tooltipContent}</p></TooltipContent>
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
    <Card className="w-full max-w-md mx-auto p-4 sm:p-6 bg-card text-card-foreground">
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
        
        <div className="mt-6 space-y-4">
             <div>
                <h4 className="text-sm font-semibold mb-2">Holidays in this Month</h4>
                {holidaysInMonth.length > 0 ? (
                    <div className="space-y-2">
                        {holidaysInMonth.map(holiday => (
                            <div key={holiday.name} className="flex justify-between items-center text-xs p-2 bg-muted/50 rounded-md">
                                <span className="font-medium">{holiday.name}</span>
                                <Badge variant="outline">{new Date(holiday.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</Badge>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-muted-foreground text-center">No holidays listed for this month.</p>
                )}
             </div>

            <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><PartyPopper className="h-4 w-4 text-yellow-500"/> My Special Days</h4>
                 <form onSubmit={handleAddSpecialDay} className="flex items-end gap-2 mb-2">
                    <div className="flex-1 space-y-1">
                        <Label htmlFor="special-day-date" className="text-xs">Date</Label>
                        <Input id="special-day-date" type="date" value={newSpecialDay.date} onChange={e => setNewSpecialDay({...newSpecialDay, date: e.target.value})} className="h-9"/>
                    </div>
                     <div className="flex-1 space-y-1">
                        <Label htmlFor="special-day-name" className="text-xs">Event Name</Label>
                        <Input id="special-day-name" type="text" value={newSpecialDay.name} onChange={e => setNewSpecialDay({...newSpecialDay, name: e.target.value})} placeholder="e.g. Mock Test" className="h-9"/>
                    </div>
                    <Button type="submit" size="icon" className="h-9 w-9"><Plus className="h-4 w-4"/></Button>
                 </form>

                {specialDays.length > 0 ? (
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                        {specialDays.map(day => (
                            <div key={day.date} className="flex justify-between items-center text-xs p-2 bg-yellow-400/10 rounded-md">
                                <div className="flex flex-col">
                                    <span className="font-medium text-yellow-700 dark:text-yellow-300">{day.name}</span>
                                    <span className="text-muted-foreground">{new Date(day.date).toLocaleDateString(undefined, { year:'numeric', month: 'short', day: 'numeric' })}</span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveSpecialDay(day.date)}>
                                    <Trash2 className="h-4 w-4 text-destructive/70"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-muted-foreground text-center">No special days added yet.</p>
                )}
            </div>
        </div>
    </Card>
  );
}
