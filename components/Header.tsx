import React from 'react';
import { ViewType } from '../types';

interface HeaderProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  onNewRequestClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setView,
  onNewRequestClick,
}) => {
  const buttonClass = (view: ViewType) =>
    `px-4 py-2 rounded ${
      currentView === view
        ? 'bg-blue-600 text-white'
        : 'bg-gray-200 dark:bg-gray-700'
    }`;

  return (
    <header className="flex flex-wrap gap-2 items-center p-4 border-b">
      <button className={buttonClass('kanban')} onClick={() => setView('kanban')}>
        Kanban
      </button>

      <button
        className={buttonClass('calendar')}
        onClick={() => setView('calendar')}
      >
        Calendar
      </button>

      <button
        className={buttonClass('equipment')}
        onClick={() => setView('equipment')}
      >
        Equipment
      </button>

      <button
        className={buttonClass('teams')}
        onClick={() => setView('teams')}
      >
        Teams
      </button>

      <button
        className={buttonClass('reports')}
        onClick={() => setView('reports')}
      >
        Reports
      </button>

      <div className="ml-auto">
        <button
          onClick={onNewRequestClick}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          + New Request
        </button>
      </div>
    </header>
  );
};
