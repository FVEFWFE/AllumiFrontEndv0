'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Plus, Video, Users2, Mic, MessageSquare, Gamepad2 } from 'lucide-react';
import { generateEvents } from '@/lib/mock-data';

const eventFormats = [
  { id: 'meeting', icon: Video, label: 'Meeting', color: 'bg-blue-500' },
  { id: 'workshop', icon: Users2, label: 'Workshop', color: 'bg-purple-500' },
  { id: 'webinar', icon: Mic, label: 'Webinar', color: 'bg-green-500' },
  { id: 'discussion', icon: MessageSquare, label: 'Discussion', color: 'bg-yellow-500' },
  { id: 'game', icon: Gamepad2, label: 'Game Night', color: 'bg-pink-500' },
];

export default function CalendarPage() {
  const [events] = useState(() => generateEvents(12));
  const [view, setView] = useState<'month' | 'week' | 'list'>('month');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('meeting');

  // Get current month's calendar grid
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  const calendarDays = [];
  const current = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    calendarDays.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Calendar</h1>
            <p className="text-gray-400 mt-1">Upcoming events and meetings</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Event
          </button>
        </div>

        {/* View Switcher */}
        <div className="flex gap-2 mt-4">
          {(['month', 'week', 'list'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                view === v
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-6">
        {view === 'month' && (
          <div className="bg-gray-900/30 rounded-lg border border-gray-800 overflow-hidden">
            {/* Month Header */}
            <div className="grid grid-cols-7 bg-gray-900/50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-400 border-r border-gray-800 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((date, index) => {
                const dayEvents = getEventsForDay(date);
                const isToday = date.toDateString() === today.toDateString();
                const isCurrentMonth = date.getMonth() === currentMonth;

                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border-r border-b border-gray-800 last:border-r-0 ${
                      !isCurrentMonth ? 'bg-gray-900/20' : ''
                    } ${isToday ? 'bg-emerald-900/10' : ''}`}
                  >
                    <div className={`text-sm mb-1 ${
                      !isCurrentMonth ? 'text-gray-600' : 'text-gray-300'
                    } ${isToday ? 'text-emerald-400 font-bold' : ''}`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs p-1 bg-emerald-600/20 text-emerald-300 rounded truncate cursor-pointer hover:bg-emerald-600/30"
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'list' && (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-gray-900/30 rounded-lg border border-gray-800 p-4 hover:bg-gray-900/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{event.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{event.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {event.attendees} attending
                      </span>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors">
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Create New Event</h2>
            
            {/* Event Format Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-3">Event Format</label>
              <div className="grid grid-cols-5 gap-2">
                {eventFormats.map((format) => {
                  const Icon = format.icon;
                  return (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                        selectedFormat === format.id
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-gray-800 text-gray-400 hover:border-gray-700'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-xs">{format.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Event Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                  rows={3}
                  placeholder="Enter event description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Time</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="Online or physical location"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}