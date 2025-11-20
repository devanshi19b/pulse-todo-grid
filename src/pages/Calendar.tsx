import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const today = new Date();
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Sample task data for demo
  const hasTask = (day: number) => {
    return [5, 12, 18, 24].includes(day);
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  return (
    <div className="min-h-screen pb-20 md:pb-8 md:pl-20">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="glass-card rounded-3xl p-8 neon-glow-purple">
          <h1 className="text-4xl font-bold mb-2">Calendar</h1>
          <p className="text-muted-foreground">View your tasks in calendar format</p>
        </div>

        {/* Calendar Card */}
        <div className="glass-card rounded-3xl p-6 neon-glow-blue">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{monthYear}</h2>
            <div className="flex gap-2">
              <Button
                onClick={previousMonth}
                variant="outline"
                size="icon"
                className="neon-glow-blue border-primary/30 hover:bg-primary/20"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                onClick={nextMonth}
                variant="outline"
                size="icon"
                className="neon-glow-blue border-primary/30 hover:bg-primary/20"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-primary py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}
            {days.map((day) => (
              <div
                key={day}
                className={cn(
                  "aspect-square p-2 rounded-xl glass-card border transition-all cursor-pointer hover-scale",
                  isToday(day) && "neon-glow-blue border-primary",
                  hasTask(day) && "border-neon-purple/50"
                )}
              >
                <div className="flex flex-col h-full">
                  <span
                    className={cn(
                      "text-sm font-medium mb-1",
                      isToday(day) && "text-primary font-bold"
                    )}
                  >
                    {day}
                  </span>
                  {hasTask(day) && (
                    <div className="flex gap-1 flex-wrap">
                      <div className="w-2 h-2 rounded-full bg-neon-purple neon-glow-purple" />
                      <div className="w-2 h-2 rounded-full bg-primary neon-glow-blue" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="glass-card rounded-2xl p-6 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary neon-glow-blue" />
            <span className="text-sm text-muted-foreground">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-neon-purple neon-glow-purple" />
            <span className="text-sm text-muted-foreground">Has Tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
