import React from 'react';

const StatusBadge = ({ estado }) => {
  const isActive = estado === 'A';
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
      {isActive ? 'Activo' : 'Inactivo'}
    </span>
  );
};

export default React.memo(StatusBadge);