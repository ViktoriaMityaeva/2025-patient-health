import React from 'react';

interface StatusFilterProps {
  selectedStatus: string;
  onChange: (status: string) => void;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({ selectedStatus, onChange }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange('all')}
        className={`px-4 py-2 rounded-lg text-sm ${
          selectedStatus === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      <button
        onClick={() => onChange('active')}
        className={`px-4 py-2 rounded-lg text-sm ${
          selectedStatus === 'active'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Active
      </button>
      <button
        onClick={() => onChange('inactive')}
        className={`px-4 py-2 rounded-lg text-sm ${
          selectedStatus === 'inactive'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Inactive
      </button>
    </div>
  );
}