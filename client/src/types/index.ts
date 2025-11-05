// This represents the structure of our Event model from the backend
export interface IEvent {
  _id: string;
  title: string;
  startTime: string; 
  endTime: string;
  status: 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING';
  
  owner: {
    _id: string;
    name: string;
    email: string;
  } | string;
  
  createdAt: string;
  updatedAt: string;
}

// Represents a SwapRequest from the backend
export interface ISwapRequest {
  _id: string;
  offeredSlot: IEvent; // The backend will populate this object
  desiredSlot: IEvent; // The backend will populate this object
  fromUser: { // The backend will populate this
    _id: string;
    name: string;
  };
  toUser: { // The backend will populate this
    _id: string;
    name: string;
  };
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}