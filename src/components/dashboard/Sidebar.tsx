import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Users, Settings, LogOut } from 'lucide-react';

export const Sidebar = ({ onLogout }: { onLogout?: () => void }) => {
  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Requests', path: '/dashboard/requests', icon: ClipboardList },
    { name: 'Profiles', path: '/dashboard/profiles', icon: Users },
  ];

  return (
    <aside className="w-64 bg-[#0B0B0B] border-r border-white/5 h-screen sticky top-0 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-xl">📄</div>
          <span className="font-bold text-xl tracking-tight text-white">FORMA Admin</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-white/15 text-white shadow-lg shadow-white/10'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 w-full text-white/50 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
