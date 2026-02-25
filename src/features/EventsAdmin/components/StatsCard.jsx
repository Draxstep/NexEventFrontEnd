import React from 'react';
import { Calendar, Power } from 'lucide-react';

const StatsCard = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm">Total Eventos</p>
          <p className="text-3xl font-bold mt-1">{stats.total}</p>
        </div>
        <Calendar className="w-8 h-8 text-blue-200" />
      </div>
    </div>
    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-100 text-sm">Activos</p>
          <p className="text-3xl font-bold mt-1">{stats.activos}</p>
        </div>
        <div className="bg-white/20 p-2 rounded-full">
           <span className="font-bold text-lg">A</span>
        </div>
      </div>
    </div>
    <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-100 text-sm">Inactivos</p>
          <p className="text-3xl font-bold mt-1">{stats.inactivos}</p>
        </div>
        <Power className="w-8 h-8 text-gray-200" />
      </div>
    </div>
  </div>
);

export default React.memo(StatsCard);