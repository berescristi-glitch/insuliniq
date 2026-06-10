import Link from "next/link";
import Image from "next/image";
import { Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface RecipeCardProps {
  recipe: {
    slug: string;
    title: string;
    description?: string | null;
    image_url?: string | null;
    prep_time_minutes?: number | null;
    cook_time_minutes?: number | null;
    servings?: number | null;
    category?: string | null;
    tags?: string[] | null;
  };
}

const CATEGORY_ACCENT: Record<string, string> = {
  breakfast:      "#508368",  // sage-500
  lunch:          "#277a4a",  // forest-500
  dinner:         "#277a4a",  // forest-500
  snack:          "#bf7c0f",  // honey-500
  dessert:        "#c2502b",  // clay-500
  "low-gi":       "#508368",  // sage-500
  mediterranean:  "#277a4a",  // forest-500
  smoothie:       "#508368",  // sage-500
};

function recipeAccent(category?: string | null): string {
  if (!category) return "#277a4a";
  const key = category.toLowerCase();
  for (const [k, v] of Object.entries(CATEGORY_ACCENT)) {
    if (key.includes(k)) return v;
  }
  return "#277a4a";
}

function totalTime(prep?: number | null, cook?: number | null): number | null {
  if (!prep && !cook) return null;
  return (prep ?? 0) + (cook ?? 0);
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const minutes = totalTime(recipe.prep_time_minutes, recipe.cook_time_minutes);

  return (
    <Link href={`/recipes/${recipe.slug}`} className="group block h-full">
      <article
        className="h-full rounded-xl overflow-hidden border bg-card hover:shadow-md transition-shadow flex flex-col border-t-[6px]"
        style={{ borderTopColor: recipeAccent(recipe.category) }}
      >
        {recipe.image_url ? (
          <div className="relative h-44 w-full bg-muted">
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="h-44 w-full bg-sage-50 flex items-center justify-center">
            <span className="text-3xl" aria-hidden>🥗</span>
          </div>
        )}

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {recipe.category && (
              <Badge variant="secondary" className="text-xs capitalize">
                {recipe.category}
              </Badge>
            )}
            {minutes && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {minutes} min
              </span>
            )}
            {recipe.servings && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                {recipe.servings} servings
              </span>
            )}
          </div>

          <h3 className="font-semibold text-foreground group-hover:text-forest-700 transition-colors line-clamp-2 flex-1">
            {recipe.title}
          </h3>

          {recipe.description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {recipe.description}
            </p>
          )}

          {recipe.tags && recipe.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {recipe.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
