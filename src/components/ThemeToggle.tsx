import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const iconColor = hovered ? '#777' : 'var(--card-foreground)';

  return (
    <button
      onClick={toggleTheme}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1000,
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        border: 'none',
        background: 'var(--card)',
        color: 'var(--card-foreground)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        cursor: 'pointer',
      }}
      aria-label="Toggle light/dark mode"
    >
      {theme === 'light' ? <Moon size={18} color={iconColor} /> : <Sun size={18} color={iconColor} />}
    </button>
  );
}
