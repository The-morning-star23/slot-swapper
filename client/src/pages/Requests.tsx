import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { ISwapRequest } from '../types';
import axios from 'axios';

const Requests: React.FC = () => {
  const [incoming, setIncoming] = useState<ISwapRequest[]>([]);
  const [outgoing, setOutgoing] = useState<ISwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/swaps/my-requests');
      setIncoming(response.data.incoming);
      setOutgoing(response.data.outgoing);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleResponse = async (requestId: string, accept: boolean) => {
    try {
      await api.post(`/swaps/response/${requestId}`, { accept });
      alert(`Request ${accept ? 'accepted' : 'rejected'}!`);
      fetchRequests(); 
    } catch (err: unknown) {
      let msg = 'Failed to respond to request.';
      if (axios.isAxiosError(err) && err.response) {
        msg = err.response.data?.msg || msg;
      }
      alert(msg);
    }
  };

  if (loading) {
    return <div>Loading your requests...</div>;
  }
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600';
      case 'ACCEPTED':
        return 'text-green-600';
      case 'REJECTED':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {error && <p className="text-red-600 lg:col-span-2">{error}</p>}
      
      {/* --- INCOMING REQUESTS --- */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Incoming Requests</h2>
        {incoming.length === 0 ? (
          <p className="text-gray-600">You have no incoming requests.</p>
        ) : (
          incoming.map((req) => (
            <div key={req._id} className="bg-white p-5 rounded-lg shadow">
              <p className="text-gray-700 mb-3">
                <strong className="text-indigo-600">{req.fromUser.name}</strong> wants to swap:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                <li>
                  <strong>Their Slot:</strong> {req.offeredSlot.title} 
                  <span className="text-xs block text-gray-500">{new Date(req.offeredSlot.startTime).toLocaleString()}</span>
                </li>
                <li>
                  <strong>Your Slot:</strong> {req.desiredSlot.title} 
                  <span className="text-xs block text-gray-500">{new Date(req.desiredSlot.startTime).toLocaleString()}</span>
                </li>
              </ul>
              <p className={`mt-4 font-semibold ${getStatusClass(req.status)}`}>
                Status: {req.status}
              </p>
              
              {req.status === 'PENDING' && (
                <div className="mt-4 flex space-x-3">
                  <button onClick={() => handleResponse(req._id, true)} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md shadow-sm">
                    Accept
                  </button>
                  <button onClick={() => handleResponse(req._id, false)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md shadow-sm">
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* --- OUTGOING REQUESTS --- */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Outgoing Requests</h2>
        {outgoing.length === 0 ? (
          <p className="text-gray-600">You have no outgoing requests.</p>
        ) : (
          outgoing.map((req) => (
            <div key={req._id} className="bg-white p-5 rounded-lg shadow">
              <p className="text-gray-700 mb-3">
                You offered <strong className="text-indigo-600">{req.toUser.name}</strong> a swap:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                <li>
                  <strong>Your Slot:</strong> {req.offeredSlot.title}
                  <span className="text-xs block text-gray-500">{new Date(req.offeredSlot.startTime).toLocaleString()}</span>
                </li>
                <li>
                  <strong>Their Slot:</strong> {req.desiredSlot.title}
                  <span className="text-xs block text-gray-500">{new Date(req.desiredSlot.startTime).toLocaleString()}</span>
                </li>
              </ul>
              <p className={`mt-4 font-semibold ${getStatusClass(req.status)}`}>
                Status: {req.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Requests;