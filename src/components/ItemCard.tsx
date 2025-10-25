import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Tag, MessageCircle, Edit, Trash } from 'lucide-react';
import { Item } from '@/hooks/useItems';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface ItemCardProps {
  item: Item;
  onChat?: (item: Item) => void;
  onEdit?: (item: Item) => void;
  onDelete?: (id: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onChat, onEdit, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user?.id === item.user_id;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg animate-fade-in">
      {item.image_url && (
        <div className="aspect-video overflow-hidden bg-muted">
          <img 
            src={item.image_url} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{item.title}</CardTitle>
          <Badge variant={item.status === 'lost' ? 'destructive' : 'default'}>
            {item.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Tag className="h-4 w-4" />
          <span>{item.category}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{item.location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(item.created_at), 'MMM dd, yyyy')}</span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        {!isOwner && onChat && (
          <Button onClick={() => onChat(item)} className="flex-1" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat
          </Button>
        )}
        
        {isOwner && (
          <>
            {onEdit && (
              <Button onClick={() => onEdit(item)} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button 
                onClick={() => onDelete(item.id)} 
                variant="destructive" 
                size="sm"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};
