import { Card, CardContent } from "@/components/ui/card"

interface RecipeListProps {
  recipes: string
  isCreativeMode: boolean
}

export function RecipeList({ recipes, isCreativeMode }: RecipeListProps) {
  const recipeArray = recipes.split('\n\n').filter(recipe => recipe.trim() !== '')

  return (
    <div className="space-y-4">
      {recipeArray.map((recipe, index) => (
        <Card key={index} className={`bg-white shadow-md ${isCreativeMode ? 'border-yellow-500 border-2' : ''}`}>
          <CardContent className="p-4">
            <p className="whitespace-pre-wrap">{recipe}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}