import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LayoutDashboard, Users, TrendingUp, Package, ShoppingCart, Cloud } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/leads', icon: TrendingUp, label: 'Leads & Deals' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/orders', icon: ShoppingCart, label: 'Orders' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="w-full bg-white/60 backdrop-blur-sm border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-amber-500 rounded-lg text-white shadow">
              <Cloud className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-gray-900">CRM Cloud</div>
              <div className="text-xs text-gray-500">Just open it once and read it, please.</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm text-gray-600">{user?.name}</span>
              <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-white font-semibold">{user?.name?.[0]?.toUpperCase()}</div>
            </div>
            <button onClick={handleLogout} className="btn-secondary">Sign out</button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left quickbar */}
        <aside className="w-16 bg-white/30 border-r border-white/20 flex flex-col items-center py-6 gap-4">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) =>
              `w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${isActive ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-white/60'}`
            } title={label}>
              <Icon className="w-5 h-5" />
            </NavLink>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
