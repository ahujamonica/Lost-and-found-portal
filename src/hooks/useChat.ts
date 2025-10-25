import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  item_id: string | null;
  message: string;
  timestamp: string;
  read: boolean;
}

export const useChat = (userId: string, otherUserId: string, itemId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
          .order('timestamp', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error: any) {
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, otherUserId]);

  const sendMessage = async (message: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: userId,
          receiver_id: otherUserId,
          item_id: itemId || null,
          message
        }]);

      if (error) throw error;

      const { error: convError } = await supabase
        .from('conversations')
        .upsert({
          user1_id: userId < otherUserId ? userId : otherUserId,
          user2_id: userId < otherUserId ? otherUserId : userId,
          item_id: itemId || null
        });

      if (convError) throw convError;
    } catch (error: any) {
      toast.error('Failed to send message');
    }
  };

  return { messages, loading, sendMessage };
};
