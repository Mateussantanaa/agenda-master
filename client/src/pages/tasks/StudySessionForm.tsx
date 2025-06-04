import * as React from 'react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Timer } from '@/components/Timer';
import { useCreateStudySession } from '@/hooks/useStudySessions';

interface StudySessionFormProps {
  taskId: number;
  taskTitle: string;
  onClose: () => void;
}

export function StudySessionForm({ taskId, taskTitle, onClose }: StudySessionFormProps) {
  const [notes, setNotes] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isStopped, setIsStopped] = useState(false);

  const createSession = useCreateStudySession();

  const handleTimerStart = () => {
    console.log('Timer started');
    setIsTimerRunning(true);
    setHasStarted(true);
    setIsStopped(false);
  };

  const handleTimerPause = () => {
    console.log('Timer paused, current seconds:', timerSeconds);
    setIsTimerRunning(false);
  };

  const handleTimerStop = () => {
    console.log('Timer stopped, final seconds:', timerSeconds);
    setIsTimerRunning(false);
    setIsStopped(true);
  };

  const handleTimeUpdate = (seconds: number) => {
    console.log('Time updated to:', seconds, 'seconds');
    setTimerSeconds(seconds);
  };

  const formatDuration = (totalSeconds: number) => {
    if (totalSeconds === 0) return '0 segundos';
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    const parts = [];
    if (hours > 0) parts.push(`${hours} hora${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs} segundo${secs !== 1 ? 's' : ''}`);
    
    return parts.join(', ');
  };

  const handleSaveSession = async () => {
    console.log('Attempting to save session with:', timerSeconds, 'seconds');
    
    if (timerSeconds <= 0) {
      alert('O cronômetro deve ter pelo menos 1 segundo para salvar a sessão');
      return;
    }

    try {
      const durationMinutes = Number((timerSeconds / 60).toFixed(4)); // 4 casas decimais para precisão
      
      const sessionData = {
        task_id: taskId,
        duration_minutes: durationMinutes,
        duration_seconds: timerSeconds,
        notes: notes.trim() || null
      };

      console.log('Saving session with data:', sessionData);

      await createSession.mutateAsync(sessionData);
      
      console.log('Session saved successfully');
      alert(`Sessão de ${formatDuration(timerSeconds)} salva com sucesso!`);
      onClose();
    } catch (error) {
      console.error('Error creating study session:', error);
      alert('Erro ao salvar sessão. Tente novamente.');
    }
  };

  const canSaveSession = timerSeconds > 0;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cronômetro de Estudo</DialogTitle>
          <p className="text-sm text-muted-foreground">{taskTitle}</p>
        </DialogHeader>
        
        <div className="space-y-6">
          <Timer
            onTimeUpdate={handleTimeUpdate}
            isRunning={isTimerRunning}
            onStart={handleTimerStart}
            onPause={handleTimerPause}
            onStop={handleTimerStop}
          />

          <div className="space-y-2">
            <Label htmlFor="notes">Notas da sessão (opcional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="O que você estudou ou aprendeu?"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveSession} 
              disabled={createSession.isPending || !canSaveSession}
            >
              {createSession.isPending ? 'Salvando...' : 'Salvar Sessão'}
            </Button>
          </div>

          {!hasStarted && (
            <p className="text-sm text-muted-foreground text-center">
              Clique em "Iniciar" para começar a cronometrar o tempo de estudo
            </p>
          )}

          {timerSeconds > 0 && isTimerRunning && (
            <p className="text-sm text-blue-600 text-center">
              ⏱️ Cronômetro rodando... {formatDuration(timerSeconds)} já estudados
            </p>
          )}

          {timerSeconds > 0 && !isTimerRunning && hasStarted && (
            <p className="text-sm text-green-600 text-center">
              ✓ {formatDuration(timerSeconds)} de estudo {isStopped ? 'prontos para salvar' : 'pausados'}
            </p>
          )}

          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>💡 O tempo será salvo com precisão de segundos</p>
            {timerSeconds > 0 && (
              <p>Duração: {formatDuration(timerSeconds)} ({(timerSeconds / 60).toFixed(2)} minutos)</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}