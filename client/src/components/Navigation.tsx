import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BookOpen, Calendar, FolderOpen, BarChart3, LogOut, User, Moon, Sun, MessageCircle, FileText, Trophy, CalendarDays, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';

export function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [extrasOpen, setExtrasOpen] = useState(false);

  const mainNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/tasks', label: 'Tarefas', icon: Calendar },
    { path: '/calendar', label: 'Calendário', icon: CalendarDays },
    { path: '/categories', label: 'Categorias', icon: FolderOpen },
  ];

  const extrasItems = [
    { path: '/achievements', label: 'Conquistas', icon: Trophy },
    { path: '/reports', label: 'Relatórios', icon: FileText },
    { path: '/chat', label: 'AI Chat', icon: MessageCircle },
  ];

  const handleLogout = () => {
    logout();
  };

  const isExtrasActive = extrasItems.some(item => location.pathname === item.path);

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Agenda Master</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Main navigation items */}
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}

            {/* Extras dropdown menu */}
            <Popover open={extrasOpen} onOpenChange={setExtrasOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isExtrasActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden lg:inline">Extras</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-1" align="end">
                <div className="space-y-1">
                  {extrasItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setExtrasOpen(false)}
                        className={cn(
                          'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
            
            <div className="ml-4 flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <span className="ml-2 hidden md:inline">{theme === 'light' ? 'Escuro' : 'Claro'}</span>
              </Button>
              
              <div className="flex items-center space-x-2 px-3 py-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground hidden md:inline">{user?.name}</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="ml-2 hidden md:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}