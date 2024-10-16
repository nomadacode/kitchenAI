import { Card, CardContent } from "@/components/ui/card"

interface RecipeDisplayProps {
  recipeText: string;
}

export function RecipeDisplay({ recipeText }: RecipeDisplayProps) {
  const formatRecipe = (text: string) => {
    const sections = text.split('\n\n');
    return sections.map((section, index) => {
      if (section.startsWith('##')) {
        // Main recipe title
        return <h2 key={index} className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">{section.replace('##', '').trim()}</h2>;
      } else if (section.startsWith('**')) {
        // Section titles (ingredients, instructions, etc.)
        const [title, ...content] = section.split(':');
        return (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">{title.replace(/\*\*/g, '').trim()}:</h3>
            {formatContent(content.join(':').trim())}
          </div>
        );
      } else {
        // Other paragraphs
        return <div key={index} className="mb-4">{formatContent(section)}</div>;
      }
    });
  };

  const formatContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('-') || line.startsWith('•')) {
        // Bullet points
        return <li key={index} className="ml-4 text-gray-700 dark:text-gray-300">{formatBoldText(line.substring(1).trim())}</li>;
      } else if (line.match(/^\d+\./)) {
        // Numbered instructions
        return <p key={index} className="mb-2 text-gray-700 dark:text-gray-300">{formatBoldText(line.trim())}</p>;
      } else {
        // Regular text
        return <p key={index} className="mb-2 text-gray-700 dark:text-gray-300">{formatBoldText(line.trim())}</p>;
      }
    });
  };

  const formatBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <Card className="mb-6 shadow-lg bg-white dark:bg-gray-800">
      <CardContent className="p-6">
        {formatRecipe(recipeText)}
      </CardContent>
    </Card>
  );
}