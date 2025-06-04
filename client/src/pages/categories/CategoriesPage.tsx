import * as React from 'react';
import { CategoryList } from './CategoryList';
import { CategoryForm } from './CategoryForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export function CategoriesPage() {
  const [showForm, setShowForm] = useState(false);

  const handleCategoryCreated = () => {
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categorias</h1>
          <p className="text-muted-foreground mt-2">
            Organize suas áreas de estudo
          </p>
        </div>
        
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <CategoryList />
      
      {showForm && (
        <CategoryForm 
          onClose={() => setShowForm(false)}
          onCategoryCreated={handleCategoryCreated}
        />
      )}
    </div>
  );
}
