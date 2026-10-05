import React from 'react';
import { NavLink } from 'react-router-dom';
import { CATEGORIES } from '../../data/mockData';
import { Sparkles, Utensils, Sparkle, Wind, Shirt, Cpu, Flame, Tag } from 'lucide-react';

const iconMap = {
  Sparkles: <Sparkles size={16} />,
  Utensils: <Utensils size={16} />,
  Sparkle: <Sparkle size={16} />,
  Wind: <Wind size={16} />,
  Shirt: <Shirt size={16} />,
  Cpu: <Cpu size={16} />
};

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none">
          {CATEGORIES.map(cat => (
            <NavLink
              key={cat.id}
              to={cat.id === 'all' ? '/products' : `/products?category=${cat.id}`}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
                }`
              }
            >
              {iconMap[cat.icon] || <Sparkles size={16} />}
              <span>{cat.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold shrink-0 pl-4 border-l border-slate-200">
          <NavLink
            to="/products?filter=hot"
            className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold"
          >
            <Flame size={15} />
            Flash Sale
          </NavLink>
          <NavLink
            to="/products?filter=promo"
            className="flex items-center gap-1 text-amber-600 hover:text-amber-700"
          >
            <Tag size={15} />
            Mã Giảm Giá
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
