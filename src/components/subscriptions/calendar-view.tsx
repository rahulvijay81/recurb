"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Subscription } from "@/lib/schemas/subscription";

interface CalendarViewProps {
  subscriptions: Subscription[];
}

export function CalendarView({ subscriptions }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Renewal Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {emptyDays.map(day => (
            <div key={`empty-${day}`} className="p-2 h-20" />
          ))}
          
          {days.map(day => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const renewals = getRenewalsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={day}
                className={`p-1 h-20 border rounded-md ${isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}`}
              >
                <div className="text-sm font-medium mb-1">{day}</div>
                <div className="space-y-1">
                  {renewals.slice(0, 2).map(sub => (
                    <Badge
                      key={sub.id}
                      variant="secondary"
                      className="text-xs truncate block"
                      title={`${sub.name} - $${sub.amount}`}
                    >
                      {sub.name}
                    </Badge>
                  ))}
                  {renewals.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{renewals.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}