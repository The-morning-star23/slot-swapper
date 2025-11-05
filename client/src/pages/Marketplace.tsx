import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { IEvent } from '../types';
import SwapModal from '../components/SwapModal';

const Marketplace: React.FC = () => {
  const [availableSlots, setAvailableSlots] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<IEvent | null>(null);

  const fetchAvailableSlots = async () => {
    setLoading(true);
    try {
      const response = await api.get('/swaps/swappable-slots');
      setAvailableSlots(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch available slots.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const handleRequestClick = (slot: IEvent) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };
  
  const handleSwapSuccess = () => {
    fetchAvailableSlots();
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Marketplace</h2>
      
      {loading && <p className="text-gray-600">Loading available slots...</p>}
      {error && <p className="text-red-600">{error}</p>}
      
      {availableSlots.length === 0 && !loading && (
        <p className="text-gray-600">No swappable slots available right now.</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableSlots.map((slot) => (
          <div key={slot._id} className="bg-white p-5 rounded-lg shadow flex flex-col justify-between">
            <div>
              <strong className="text-lg text-indigo-700">{slot.title}</strong>
              <p className="text-sm text-gray-600 mt-2">
                {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Owner: <strong>{typeof slot.owner === 'object' ? slot.owner.name : 'Unknown'}</strong>
              </p>
            </div>
            <button 
              onClick={() => handleRequestClick(slot)}
              className="mt-4 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm"
            >
              Request Swap
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && selectedSlot && (
        <SwapModal 
          desiredSlot={selectedSlot}
          onClose={handleCloseModal}
          onSwapSuccess={handleSwapSuccess}
        />
      )}
    </div>
  );
};

export default Marketplace;