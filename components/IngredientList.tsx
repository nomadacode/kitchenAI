import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, X, Plus, Check } from 'lucide-react'

interface Ingredient {
  name: string;
  quantity?: string;
  weight?: string;
  info?: string;
}

interface IngredientListProps {
  ingredients: Ingredient[]
  onUpdateIngredient: (index: number, newValue: Ingredient) => void
  onAddIngredient: (ingredient: Ingredient) => void
  onRemoveIngredient: (index: number) => void
  recipeContent: string
  isCreativeMode: boolean
  onToggleCreativeMode: () => void
}

export function IngredientList({ 
  ingredients, 
  onUpdateIngredient, 
  onAddIngredient, 
  onRemoveIngredient,
  recipeContent,
  isCreativeMode,
  onToggleCreativeMode
}: IngredientListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState<Ingredient>({ name: '', quantity: '', weight: '', info: '' })
  const [newIngredient, setNewIngredient] = useState<Ingredient>({ name: '', quantity: '', weight: '', info: '' })

  const handleEdit = (index: number, value: Ingredient) => {
    setEditingIndex(index)
    setEditValue({
      name: value.name,
      quantity: value.quantity || '',
      weight: value.weight || '',
      info: value.info || ''
    })
  }

  const handleSave = (index: number) => {
    onUpdateIngredient(index, editValue)
    setEditingIndex(null)
    setEditValue({ name: '', quantity: '', weight: '', info: '' })
  }

  const handleAdd = () => {
    if (newIngredient.name.trim()) {
      onAddIngredient(newIngredient)
      setNewIngredient({ name: '', quantity: '', weight: '', info: '' })
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ingredients.map((ingredient, index) => (
          <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4">
              {editingIndex === index ? (
                <div className="space-y-2">
                  <Input
                    value={editValue.name}
                    onChange={(e) => setEditValue({ ...editValue, name: e.target.value })}
                    placeholder="Nombre del ingrediente"
                    className="w-full"
                  />
                  <Input
                    value={editValue.quantity}
                    onChange={(e) => setEditValue({ ...editValue, quantity: e.target.value })}
                    placeholder="Cantidad"
                    className="w-full"
                  />
                  <Input
                    value={editValue.weight}
                    onChange={(e) => setEditValue({ ...editValue, weight: e.target.value })}
                    placeholder="Peso"
                    className="w-full"
                  />
                  <Input
                    value={editValue.info}
                    onChange={(e) => setEditValue({ ...editValue, info: e.target.value })}
                    placeholder="Información adicional"
                    className="w-full"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button onClick={() => handleSave(index)} size="sm">
                      <Check className="h-4 w-4 mr-1" /> Guardar
                    </Button>
                    <Button onClick={() => setEditingIndex(null)} size="sm" variant="outline">
                      <X className="h-4 w-4 mr-1" /> Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold text-lg mb-2">{ingredient.name}</h3>
                  {ingredient.quantity && <p className="text-sm text-gray-600">Cantidad: {ingredient.quantity}</p>}
                  {ingredient.weight && <p className="text-sm text-gray-600">Peso: {ingredient.weight}</p>}
                  {ingredient.info && <p className="text-sm text-gray-600 mt-2">{ingredient.info}</p>}
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button onClick={() => handleEdit(index, ingredient)} size="sm" variant="outline">
                      <Pencil className="h-4 w-4 mr-1" /> Editar
                    </Button>
                    <Button onClick={() => onRemoveIngredient(index)} size="sm" variant="outline">
                      <X className="h-4 w-4 mr-1" /> Eliminar
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-white shadow-md">
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4">Agregar nuevo ingrediente</h3>
          <div className="space-y-2">
            <Input
              value={newIngredient.name}
              onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
              placeholder="Nombre del ingrediente"
              className="w-full"
            />
            <Input
              value={newIngredient.quantity}
              onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
              placeholder="Cantidad"
              className="w-full"
            />
            <Input
              value={newIngredient.weight}
              onChange={(e) => setNewIngredient({ ...newIngredient, weight: e.target.value })}
              placeholder="Peso"
              className="w-full"
            />
            <Input
              value={newIngredient.info}
              onChange={(e) => setNewIngredient({ ...newIngredient, info: e.target.value })}
              placeholder="Información adicional"
              className="w-full"
            />
            <Button onClick={handleAdd} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Agregar Ingrediente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}