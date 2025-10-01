import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorCardProps {
  title: string;
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function ErrorCard({ title, message, onRetry, isRetrying = false }: ErrorCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto border-destructive/50">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">{message}</p>
        
        <Button
          onClick={onRetry}
          disabled={isRetrying}
          className="flex items-center gap-2 mx-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Trying again...' : 'Try Again'}
        </Button>
      </CardContent>
    </Card>
  );
}