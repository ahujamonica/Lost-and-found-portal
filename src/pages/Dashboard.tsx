import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useItems } from '@/hooks/useItems';
import { ItemCard } from '@/components/ItemCard';
import { ItemFormDialog } from '@/components/ItemFormDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Package } from 'lucide-react';
import { Item } from '@/hooks/useItems';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { items, createItem, updateItem, deleteItem } = useItems();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | undefined>(undefined);

  const myItems = items.filter(item => item.user_id === user?.id);
  const myLostItems = myItems.filter(item => item.status === 'lost');
  const myFoundItems = myItems.filter(item => item.status === 'found');

  const handleSubmit = async (data: any) => {
    if (editingItem) {
      await updateItem(editingItem.id, data);
    } else {
      await createItem(data);
    }
    setEditingItem(undefined);
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteItem(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Manage your lost and found items</p>
        </div>
        <Button onClick={() => { setEditingItem(undefined); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Post New Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Items</CardTitle>
            <CardDescription>All your posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{myItems.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lost Items</CardTitle>
            <CardDescription>Items you've lost</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{myLostItems.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Found Items</CardTitle>
            <CardDescription>Items you've found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{myFoundItems.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Items ({myItems.length})</TabsTrigger>
          <TabsTrigger value="lost">Lost ({myLostItems.length})</TabsTrigger>
          <TabsTrigger value="found">Found ({myFoundItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
          {myItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No items posted yet</p>
              <Button className="mt-4" onClick={() => setDialogOpen(true)}>
                Post Your First Item
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="lost" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myLostItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
          {myLostItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No lost items posted</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="found" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myFoundItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
          {myFoundItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No found items posted</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ItemFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingItem(undefined);
        }}
        onSubmit={handleSubmit}
        item={editingItem}
      />
    </div>
  );
};
