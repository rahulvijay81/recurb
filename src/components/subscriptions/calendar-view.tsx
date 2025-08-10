"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, Calendar, DollarSign, Clock } from "lucide-react";
import { Subscription } from "@/lib/schemas/subscription";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  subscriptions: Subscription[];
}

const categoryColors = {
  Entertainment: "bg-purple-100 text-purple-800 border-purple-200",
  Software: "bg-blue-100 text-blue-800 border-blue-200",
  Utilities: "bg-green-100 text-green-800 border-green-200",
  Health: "bg-red-100 text-red-800 border-red-200",
  Education: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Business: "bg-gray-100 text-gray-800 border-gray-200",
} as const;

export function CalendarView({ subscriptions }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getRenewalsForDate = (date: Date) => {
    return subscriptions.filter(sub => {
      const renewalDate = new Date(sub.nextBillingDate);
      return renewalDate.toDateString() === date.toDateString();
    });
  };

  const getTotalForDate = (date: Date) => {
    return getRenewalsForDate(date).reduce((sum, sub) => sum + sub.amount, 0);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const monthlyTotal = subscriptions
    .filter(sub => {
      const renewalDate = new Date(sub.nextBillingDate);
      return renewalDate.getMonth() === currentDate.getMonth() && 
             renewalDate.getFullYear() === currentDate.getFullYear();
    })
    .reduce((sum, sub) => sum + sub.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header with navigation and stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold min-w-[200px] text-center">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Monthly Total: <span className="font-semibold text-foreground">${monthlyTotal.toFixed(2)}</span></span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b bg-muted/30">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 3)}</span>
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {/* Empty cells for days before month starts */}
            {emptyDays.map(day => (
              <div key={`empty-${day}`} className="h-16 sm:h-24 lg:h-32 border-r border-b last:border-r-0 bg-muted/10" />
            ))}
            
            {/* Days of the month */}
            {days.map(day => {
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const renewals = getRenewalsForDate(date);
              const dayTotal = getTotalForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              const isPast = date < new Date() && !isToday;
              
              return (
                <Popover key={day}>
                  <PopoverTrigger asChild>
                    <div
                      className={cn(
                        "h-16 sm:h-24 lg:h-32 border-r border-b last:border-r-0 p-1 sm:p-2 cursor-pointer transition-colors hover:bg-muted/50",
                        isToday && "bg-primary/5 border-primary/20",
                        isPast && "bg-muted/20"
                      )}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={cn(
                          "text-xs sm:text-sm font-medium",
                          isToday && "text-primary font-semibold",
                          isPast && "text-muted-foreground"
                        )}>
                          {day}
                        </span>
                        {renewals.length > 0 && (
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            ${dayTotal.toFixed(0)}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {renewals.slice(0, 2).map(sub => {
                          const colorClass = categoryColors[sub.category as keyof typeof categoryColors] || categoryColors.Business;
                          return (
                            <div
                              key={sub.id}
                              className={cn(
                                "text-xs px-1 sm:px-1.5 py-0.5 rounded text-center truncate border",
                                colorClass
                              )}
                              title={`${sub.name} - $${sub.amount} (${sub.billingCycle})`}
                            >
                              <span className="sm:hidden">{sub.name.slice(0, 4)}</span>
                              <span className="hidden sm:inline">{sub.name}</span>
                            </div>
                          );
                        })}
                        {renewals.length > 2 && (
                          <div className="text-xs text-center text-muted-foreground bg-muted rounded px-1 sm:px-1.5 py-0.5">
                            +{renewals.length - 2}
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverTrigger>
                  
                  {renewals.length > 0 && (
                    <PopoverContent className="w-80" align="start">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <h4 className="font-semibold">
                            {date.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </h4>
                        </div>
                        
                        <div className="space-y-2">
                          {renewals.map(sub => (
                            <div key={sub.id} className="flex items-center justify-between p-2 rounded-lg border bg-card">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{sub.name}</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                  <span>{sub.category}</span>
                                  <span>•</span>
                                  <span className="capitalize">{sub.billingCycle}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">${sub.amount}</div>
                                <div className="text-xs text-muted-foreground">{sub.currency}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="pt-2 border-t">
                          <div className="flex justify-between items-center font-semibold">
                            <span>Total for this day:</span>
                            <span>${dayTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  )}
                </Popover>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}