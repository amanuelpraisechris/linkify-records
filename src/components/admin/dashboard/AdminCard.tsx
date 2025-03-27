
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface AdminCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  onClick: () => void;
  disabled?: boolean;
}

const AdminCard = ({
  title,
  description,
  icon: Icon,
  buttonText,
  onClick,
  disabled = false
}: AdminCardProps) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Icon className="h-5 w-5 mr-2 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        <Button 
          className="w-full" 
          onClick={onClick}
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminCard;
