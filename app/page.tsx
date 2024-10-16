'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ImageUploader } from '@/components/ImageUploader'
import { RecipeDisplay } from '@/components/RecipeDisplay'
import { recognizeIngredients, generateRecipe } from '@/lib/gemini'
import Lottie from 'lottie-react'
import loadingAnimation from '@/public/loading-animation.json'
import { useTheme } from 'next-themes'
import { Moon, Sun, ChefHat, Book, List, Settings } from 'lucide-react'

interface Ingredient {
  name: string;
}

export default function Home() {
  const [imageData, setImageData] = useState<string | null>(null)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [recipe, setRecipe] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const isGeneratingRecipe = useRef(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const processImage = useCallback(async (imageData: string) => {
    console.log('Procesando imagen')
    setIsLoading(true)
    setError(null)
    try {
      const recognizedIngredients = await recognizeIngredients(imageData)
      console.log('Ingredientes reconocidos:', recognizedIngredients)
      setIngredients(recognizedIngredients)
      toast({
        title: "Éxito",
        description: "Ingredientes reconocidos correctamente.",
      })
    } catch (error) {
      console.error('Error al reconocer ingredientes:', error)
      setError(`Error al reconocer ingredientes: ${error.message}`)
      toast({
        title: "Error",
        description: "No se pudieron reconocer los ingredientes. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const handleImageUpload = useCallback((imageData: string) => {
    console.log('Imagen subida')
    setImageData(imageData)
    setIngredients([])
    setRecipe(null)
    processImage(imageData)
  }, [processImage])

  const handleGenerateRecipes = useCallback(async () => {
    if (isGeneratingRecipe.current) return;
    isGeneratingRecipe.current = true;

    console.log('Generando receta')
    setIsLoading(true)
    setError(null)
    try {
      const ingredientNames = ingredients.map(i => i.name)
      const generatedRecipe = await generateRecipe(ingredientNames)
      console.log('Receta generada:', generatedRecipe)
      setRecipe(generatedRecipe)
      toast({
        title: "Éxito",
        description: "Receta generada correctamente.",
      })
    } catch (error) {
      console.error('Error al generar la receta:', error)
      setError(`Error al generar la receta: ${error.message}`)
      toast({
        title: "Error",
        description: "No se pudo generar la receta. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      isGeneratingRecipe.current = false;
    }
  }, [ingredients, toast])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#2C2C2C] text-white">
      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <ChefHat className="w-8 h-8 text-green-400" />
            <h1 className="text-2xl font-bold">KitchenAI</h1>
          </div>
          <nav className="flex space-x-4">
            <Button variant="ghost" className="text-green-400"><Book className="w-5 h-5 mr-2" /> Recetas</Button>
            <Button variant="ghost" className="text-green-400"><List className="w-5 h-5 mr-2" /> Ingredientes</Button>
            <Button variant="ghost" className="text-green-400"><Settings className="w-5 h-5 mr-2" /> Ajustes</Button>
          </nav>
          <Button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            variant="outline"
            size="icon"
            className="bg-gray-700 text-green-400"
          >
            {theme === 'dark' ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Cambiar tema</span>
          </Button>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-800 rounded-xl shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-green-400">Sube una imagen de tus ingredientes</h2>
              <ImageUploader onImageUpload={handleImageUpload} />
              {imageData && (
                <div className="mt-4 rounded-lg overflow-hidden">
                  <Image src={imageData} alt="Imagen de cocina" width={300} height={200} layout="responsive" className="rounded-lg" />
                </div>
              )}
            </CardContent>
          </Card>

          {ingredients.length > 0 && (
            <Card className="bg-gray-800 rounded-xl shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-green-400">Ingredientes Reconocidos</h2>
                <div className="grid grid-cols-2 gap-4">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-300">{ingredient.name}</p>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={handleGenerateRecipes} 
                  className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Lottie 
                        animationData={loadingAnimation} 
                        loop={true}
                        style={{ width: 24, height: 24 }}
                        className="mr-2"
                      />
                      Generando...
                    </div>
                  ) : 'Generar Receta'}
                </Button>
              </CardContent>
            </Card>
          )}

          {recipe && (
            <Card className="bg-gray-800 rounded-xl shadow-lg col-span-full">
              <CardContent className="p-6">
                <RecipeDisplay recipeText={recipe} />
              </CardContent>
            </Card>
          )}
        </main>

        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col items-center">
              <Lottie 
                animationData={loadingAnimation} 
                loop={true}
                style={{ width: 100, height: 100 }}
              />
              <p className="text-lg font-semibold text-green-400 mt-4">Procesando...</p>
            </div>
          </div>
        )}

        {error && (
          <Card className="mt-6 bg-red-900 rounded-xl shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-300">Error</h2>
              <p className="text-red-200">{error}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}