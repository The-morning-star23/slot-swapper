import React, { useState, useEffect } from 'react';
import type { IEvent } from '../types';
import api from '../services/api';
import axios from 'axios';

interface SwapModalProps {
  desiredSlot: IEvent;
  onClose: () => void;
  onSwapSuccess: () => void;
}

const SwapModal: React.FC<SwapModalProps> = ({ desiredSlot, onClose, onSwapSuccess }) => {
  const [mySlots, setMySlots] = useState<IEvent[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMySwappableSlots = async () => {
      try {
        const response = await api.get('/events/my-events');
        const swappable = response.data.filter(
          (event: IEvent) => event.status === 'SWAPPABLE'
        );
        setMySlots(swappable);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch your swappable slots.');
      } finally {
        setLoading(false);
      }
    };
    fetchMySwappableSlots();
  }, []);

  const handleSubmitRequest = async () => {
    if (!selectedSlotId) {
      setError('You must select one of your slots to offer.');
      return;
    }
    setError(null);

    try {
      await api.post('/swaps/request', {
        mySlotId: selectedSlotId,
        theirSlotId: desiredSlot._id,
      });
      alert('Swap request sent successfully!');
      onSwapSuccess();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      let msg = 'Failed to send swap request.';
      if (axios.isAxiosError(err) && err.response) {
        msg = err.response.data?.msg || msg;
      }
      setError(msg);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-lg">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Request Swap</h3>
        
        <div className="mb-4">
          <p className="text-gray-700">You are requesting:</p>
          <p className="text-lg font-medium text-indigo-600">{desiredSlot.title}</p>
          <p className="text-sm text-gray-500">
            From: <strong>{typeof desiredSlot.owner === 'object' ? desiredSlot.owner.name : '...'}</strong>
          </p>
        </div>

        <hr className="my-4" />
        
        <div className="mb-4">
          <label htmlFor="slot-select" className="block text-sm font-medium text-gray-700 mb-2">
            Offer one of your slots:
          </label>
          {loading && <p className="text-gray-500">Loading your slots...</p>}
          
          {mySlots.length > 0 ? (
            <select 
              id="slot-select"
              value={selectedSlotId} 
              onChange={(e) => setSelectedSlotId(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Select your slot --</option>
              {mySlots.map((slot) => (
                <option key={slot._id} value={slot._id}>
                  {slot.title} ({new Date(slot.startTime).toLocaleString()})
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-500">You have no "SWAPPABLE" slots to offer.</p>
          )}
        </div>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <div className="flex justify-end space-x-3 mt-6">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmitRequest} 
            disabled={!selectedSlotId || mySlots.length === 0}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
          >
            Send Request
          </button>
        </div>
      </div>
    </>
  );
};

export default SwapModal;