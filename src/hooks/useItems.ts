import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Item {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  category: string;
  location: string;
  status: 'lost' | 'found';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useItems = (status?: 'lost' | 'found') => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      let query = supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      setItems((data as Item[]) || []);
    } catch (error: any) {
      toast.error('Failed to fetch items: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [status]);

  const createItem = async (itemData: Omit<Item, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('items')
        .insert([{ ...itemData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      toast.success('Item posted successfully!');
      fetchItems();
      return { data, error: null };
    } catch (error: any) {
      toast.error('Failed to create item: ' + error.message);
      return { data: null, error };
    }
  };

  const updateItem = async (id: string, updates: Partial<Item>) => {
    try {
      const { error } = await supabase
        .from('items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success('Item updated successfully!');
      fetchItems();
    } catch (error: any) {
      toast.error('Failed to update item: ' + error.message);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Item deleted successfully!');
      fetchItems();
    } catch (error: any) {
      toast.error('Failed to delete item: ' + error.message);
    }
  };

  return { items, loading, createItem, updateItem, deleteItem, refetch: fetchItems };
};
