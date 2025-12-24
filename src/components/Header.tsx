import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full bg-background border-b border-primary/10">
      <div className="max-w-[120rem] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-heading text-2xl font-bold text-primary">
            CareerSati
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`font-paragraph text-base transition-colors ${
                isActive('/') ? 'text-primary font-semibold' : 'text-primary/70 hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`font-paragraph text-base transition-colors ${
                isActive('/explore') ? 'text-primary font-semibold' : 'text-primary/70 hover:text-primary'
              }`}
            >
              Explore Careers
            </Link>
            <Link
              to="/guidance"
              className={`font-paragraph text-base transition-colors ${
                isActive('/guidance') ? 'text-primary font-semibold' : 'text-primary/70 hover:text-primary'
              }`}
            >
              Guidance
            </Link>
          </nav>

          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search careers..."
                className="w-48 lg:w-64 px-4 py-2 pr-10 rounded-lg border border-primary/20 bg-white text-primary font-paragraph text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/60 hover:text-primary"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
