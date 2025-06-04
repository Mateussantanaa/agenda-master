import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Clock } from 'lucide-react';

interface TimerProps {
  onTimeUpdate: (seconds: number) => void;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  initialSeconds?: number;
}

export function Timer({ onTimeUpdate, isRunning, onStart, onPause, onStop, initialSeconds = 0 }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          const newSeconds = prev + 1;
          onTimeUpdate(newSeconds);
          return newSeconds;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeUpdate]);

  // Sempre atualizar quando os segundos mudarem
  useEffect(() => {
    onTimeUpdate(seconds);
  }, [seconds, onTimeUpdate]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (totalSeconds: number) => {
    if (totalSeconds === 0) return '0 segundos';
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
    
    return parts.join(' ');
  };

  const handleStart = () => {
    onStart();
  };

  const handlePause = () => {
    onPause();
  };

  const handleStop = () => {
    // Garantir que os segundos finais sejam enviados
    onTimeUpdate(seconds);
    onStop();
  };

  const handleReset = () => {
    setSeconds(0);
    onTimeUpdate(0);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center space-x-2">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <span className="text-3xl font-mono font-bold">
          {formatTime(seconds)}
        </span>
      </div>

      <div className="flex space-x-2">
        {!isRunning ? (
          <Button onClick={handleStart} size="sm">
            <Play className="h-4 w-4 mr-1" />
            {seconds > 0 ? 'Continuar' : 'Iniciar'}
          </Button>
        ) : (
          <Button onClick={handlePause} size="sm" variant="outline">
            <Pause className="h-4 w-4 mr-1" />
            Pausar
          </Button>
        )}
        
        <Button onClick={handleStop} size="sm" variant="outline">
          <Square className="h-4 w-4 mr-1" />
          Parar
        </Button>

        {seconds > 0 && (
          <Button onClick={handleReset} size="sm" variant="ghost">
            Zerar
          </Button>
        )}
      </div>

      {seconds > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          <div>Tempo estudado: {formatDuration(seconds)}</div>
          <div className="text-xs mt-1">
            ({(seconds / 60).toFixed(2)} minutos)
          </div>
        </div>
      )}
    </div>
  );
}