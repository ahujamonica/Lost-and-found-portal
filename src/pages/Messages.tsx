import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ChatDialog } from '@/components/ChatDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  item_id: string | null;
  last_message_at: string;
  other_user_name: string;
  item_title: string | null;
}

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<{ userId: string; itemId?: string; title?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            items (title)
          `)
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
          .order('last_message_at', { ascending: false });

        if (error) throw error;

        const conversationsWithNames = await Promise.all(
          (data || []).map(async (conv: any) => {
            const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
            const { data: profile } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', otherUserId)
              .single();

            return {
              ...conv,
              other_user_id: otherUserId,
              other_user_name: profile?.name || 'Unknown User',
              item_title: conv.items?.title || null,
            };
          })
        );

        setConversations(conversationsWithNames);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">Your conversations</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {conversations.map((conv: any) => (
          <Card
            key={conv.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedChat({
              userId: conv.other_user_id,
              itemId: conv.item_id || undefined,
              title: conv.item_title || undefined,
            })}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {conv.other_user_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{conv.other_user_name}</h3>
                  {conv.item_title && (
                    <p className="text-sm text-muted-foreground">
                      About: {conv.item_title}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(conv.last_message_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <MessageCircle className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}

        {conversations.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No conversations yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start chatting with item owners to begin a conversation
            </p>
          </div>
        )}
      </div>

      {selectedChat && (
        <ChatDialog
          open={!!selectedChat}
          onOpenChange={() => setSelectedChat(null)}
          otherUserId={selectedChat.userId}
          itemId={selectedChat.itemId}
          itemTitle={selectedChat.title}
        />
      )}
    </div>
  );
};
