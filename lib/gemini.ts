import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function recognizeIngredients(imageData: string): Promise<{ name: string }[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Identifica los ingredientes de cocina en esta imagen. Proporciona solo los nombres de los ingredientes en español, sin información adicional. Por ejemplo: aceite, azúcar, sal, tomates, espinaca, etc. Cuando identifiques un packaging, ignora las imágenes del packaging y solo lee cuál es el ingrediente que contiene. No incluyas ningún detalle adicional, solo el nombre del ingrediente. Si identificas que hay más de un ingrediente de la misma clase, indica la cantidad de cada uno. Por ejemplo: 2 aceites, 1 azúcar, 1 sal, 1 tomate, 1 espinaca, etc. Siempre coloca la cantidad antes del nombre del ingrediente. Si no se encuentras el ingrediente, no lo identifiques.";

    // Asegúrate de que imageData es una cadena base64 válida
    if (!imageData.startsWith('data:image')) {
      throw new Error('Formato de imagen no válido');
    }

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageData.split(',')[1], // Elimina el prefijo "data:image/..."
          mimeType: "image/jpeg"
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();

    // Procesar el texto para extraer solo los nombres de los ingredientes
    const ingredientNames = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => ({ name: line.startsWith('- ') ? line.slice(2) : line }))
      .filter(ingredient => ingredient.name && ingredient.name.trim() !== ''); // Filtrar ingredientes undefined o vacíos

    console.log('Ingredientes reconocidos:', ingredientNames);

    return ingredientNames;
  } catch (error) {
    console.error('Error en recognizeIngredients:', error);
    throw error;
  }
}

export async function generateRecipe(ingredients: string[]): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Crea una receta utilizando SOLO los siguientes ingredientes detectados: ${ingredients.join(', ')}. 

La receta debe seguir este formato:

## [Nombre de la Receta]

**Ingredientes:**
- [Lista de ingredientes con cantidades, SOLO usando los ingredientes proporcionados]

**Ingredientes complementarios (no incluidos en la lista principal):**
- [Lista de ingredientes adicionales sugeridos que no están en la lista principal, si los hay]

**Instrucciones:**
1. [Paso 1]
2. [Paso 2]
...

La receta debe ser creativa, sabrosa y fácil de seguir. Puedes utilizar todos o algunos de los ingredientes de la lista ${ingredients.join(', ')}. 

IMPORTANTE: 
1. NO incluyas ingredientes que no estén en la lista proporcionada en la sección principal de "Ingredientes".
2. Si crees que faltan ingredientes esenciales (como sal, aceite, etc.), menciónalos SOLO en la sección "Ingredientes complementarios".
3. En la sección "Ingredientes complementarios", explica claramente que estos ingredientes no están en la lista principal y son sugerencias para mejorar la receta.
4. Si la receta requiere ingredientes que no están en la lista proporcionada, asegúrate de mencionarlo claramente en la sección de "Ingredientes complementarios".
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recipe = response.text();

    console.log('Receta generada:', recipe);

    return recipe;
  } catch (error) {
    console.error('Error en generateRecipe:', error);
    throw error;
  }
}