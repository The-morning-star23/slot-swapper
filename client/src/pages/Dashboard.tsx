import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { IEvent } from '../types';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events/my-events');
      setEvents(response.data);
    } catch (err) {
      console.error(err); // <-- Also added here for consistency
      setError('Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const newEvent = { title, startTime, endTime };
      const response = await api.post('/events', newEvent);
      setEvents([response.data, ...events]);
      setTitle('');
      setStartTime('');
      setEndTime('');
    } catch (err: unknown) {
      let msg = 'Failed to create event.';
      if (axios.isAxiosError(err) && err.response) {
        msg = err.response.data?.msg || msg;
      }
      setError(msg);
    }
  };

  // --- 3. Handle Status Update (Make Swappable) ---
  const handleSetStatus = async (id: string, status: 'BUSY' | 'SWAPPABLE') => {
    try {
      const response = await api.put(`/events/${id}/status`, { status });
      setEvents(
        events.map((event) =>
          event._id === id ? { ...event, status: response.data.status } : event
        )
      );
    } catch (err) {
      console.error(err); // <-- FIX 1: Use the 'err' variable
      alert('Failed to update status.');
    }
  };

  // --- 4. Handle Delete Event ---
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter((event) => event._id !== id));
    } catch (err) {
      console.error(err); // <-- FIX 2: Use the 'err' variable
      alert('Failed to delete event. Is it part of a pending swap?');
    }
  };

  if (loading) {
    return <div>Loading your dashboard...</div>;
  }
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'BUSY':
        return 'bg-gray-200 text-gray-800';
      case 'SWAPPABLE':
        return 'bg-green-200 text-green-800';
      case 'SWAP_PENDING':
        return 'bg-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* --- Create Event Form --- */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create New Event</h2>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="md:col-span-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            className="md:col-span-4 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow focus:outline-none"
          >
            Create Event
          </button>
        </form>
      </div>

      {/* --- Event List --- */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Events</h2>
        {events.length === 0 ? (
          <p className="text-gray-600">You have no events.</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event._id} className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="flex items-center mb-2">
                    <strong className="text-lg text-gray-900">{event.title}</strong>
                    <span className={`text-xs font-medium ml-3 px-2 py-0.5 rounded-full ${getStatusClass(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  {event.status === 'BUSY' && (
                    <button onClick={() => handleSetStatus(event._id, 'SWAPPABLE')} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md shadow-sm">
                      Make Swappable
                    </button>
                  )}
                  {event.status === 'SWAPPABLE' && (
                    <button onClick={() => handleSetStatus(event._id, 'BUSY')} className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-md shadow-sm">
                      Make Busy
                    </button>
                  )}
                  {event.status !== 'SWAP_PENDING' && (
                    <button onClick={() => handleDelete(event._id)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md shadow-sm">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;