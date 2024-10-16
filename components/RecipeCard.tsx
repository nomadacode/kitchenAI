import React from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RecipeCardProps {
  title: string;
  description: string;
  onViewRecipe: () => void;
}

export function RecipeCard({ title, description, onViewRecipe }: RecipeCardProps) {
  return (
    <Card className="shadow-lg bg-white">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-blue-700 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Button onClick={onViewRecipe} className="w-full bg-blue-500 hover:bg-blue-700 text-white">
          Ver Receta
        </Button>
      </CardContent>
    </Card>
  );
}