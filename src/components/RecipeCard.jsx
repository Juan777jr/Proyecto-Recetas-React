import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import { FaClock, FaHeart, FaRegHeart, FaUsers } from 'react-icons/fa';
import { toggleFavoriteRecipe } from '../services/recipesApi';

const DESCRIPTION_LIMIT = 110;

const RecipeCard = ({ recipe, onToggleFavorite }) => {
  const [expanded, setExpanded] = useState(false);
  const [togglingFav, setTogglingFav] = useState(false);

  const isLong = recipe.description.length > DESCRIPTION_LIMIT;
  const displayDescription =
    !isLong || expanded
      ? recipe.description
      : `${recipe.description.slice(0, DESCRIPTION_LIMIT).trimEnd()}...`;

  const handleFavoriteClick = async () => {
    const nextFavorite = !recipe.favorite;

    try {
      setTogglingFav(true);
      const updated = await toggleFavoriteRecipe(recipe.id, nextFavorite);
      if (onToggleFavorite) {
        onToggleFavorite(updated);
      }
      toast.success(
        nextFavorite
          ? `Agregaste "${recipe.title}" a favoritas`
          : `Quitaste "${recipe.title}" de favoritas`
      );
    } catch (error) {
      toast.error(error.message || 'No se pudo actualizar favorita');
    } finally {
      setTogglingFav(false);
    }
  };

  return (
    <article className="bg-white rounded-xl shadow-sm border border-stone-200 p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              {recipe.category}
            </span>
            <span className="bg-stone-100 text-stone-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {recipe.difficulty}
            </span>
          </div>

          <button
            type="button"
            onClick={handleFavoriteClick}
            disabled={togglingFav}
            aria-label={
              recipe.favorite
                ? `Quitar ${recipe.title} de favoritas`
                : `Marcar ${recipe.title} como favorita`
            }
            aria-pressed={Boolean(recipe.favorite)}
            className="p-2 rounded-full hover:bg-stone-100 text-rose-600 transition cursor-pointer shrink-0 disabled:opacity-50"
          >
            {recipe.favorite ? (
              <FaHeart className="text-lg" aria-hidden="true" />
            ) : (
              <FaRegHeart className="text-lg text-stone-500" aria-hidden="true" />
            )}
          </button>
        </div>

        <h2 className="text-xl font-bold text-stone-900 mb-2">
          {recipe.title}
        </h2>

        <p className="text-stone-600 text-sm leading-relaxed">
          {displayDescription}
        </p>

        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-2 text-xs font-semibold text-amber-700 hover:text-amber-800 underline cursor-pointer"
          >
            {expanded ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-stone-100">
        <div className="flex items-center justify-between text-xs text-stone-500 mb-4">
          <span className="inline-flex items-center gap-1.5">
            <FaClock aria-hidden="true" />
            {recipe.prepTime} min
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FaUsers aria-hidden="true" />
            {recipe.servings} porciones
          </span>
        </div>

        <Link
          to={`/recipes/${recipe.id}`}
          className="block w-full text-center bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition"
        >
          Ver receta
        </Link>
      </div>
    </article>
  );
};

export default RecipeCard;