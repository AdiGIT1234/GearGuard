
import React, { useState } from 'react';
import { MaintenanceRequest } from '../types';

interface CalendarViewProps {
  requests: MaintenanceRequest[];
  onAddRequest: (date: Date) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ requests, onAddRequest }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const requestsByDate: { [key: string]: MaintenanceRequest[] } = {};
  requests.forEach(req => {
    const date = new Date(req.scheduledDate).toDateString();
    if (!requestsByDate[date]) {
      requestsByDate[date] = [];
    }
    requestsByDate[date].push(req);
  });

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-2xl font-bold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600 dark:text-gray-400">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="border border-gray-200 dark:border-gray-700 h-28 rounded"></div>
        ))}
        {days.map(day => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dateString = date.toDateString();
          const dayRequests = requestsByDate[dateString] || [];
          const isToday = new Date().toDateString() === dateString;
          return (
            <div
              key={day}
              onClick={() => onAddRequest(date)}
              className="border border-gray-200 dark:border-gray-700 h-28 rounded p-2 flex flex-col cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
            >
              <span className={`font-bold ${isToday ? 'bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center' : ''}`}>
                {day}
              </span>
              <div className="mt-1 overflow-y-auto text-xs">
                {dayRequests.map(req => (
                  <div key={req.id} className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded px-1 mb-1 truncate">
                    {req.subject}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
