import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import { FaArrowRight, FaClock, FaHeart, FaRegHeart, FaUsers } from 'react-icons/fa';
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
    <article className="group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-lg border border-slate-200 hover:border-blue-400 flex flex-col justify-between transition-all">
      <div>
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="bg-blue-600 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
              {recipe.category}
            </span>
            <span className="bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-medium px-2.5 py-0.5 rounded-md">
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
            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-rose-600 transition cursor-pointer shrink-0 disabled:opacity-50"
          >
            {recipe.favorite ? (
              <FaHeart className="text-sm" aria-hidden="true" />
            ) : (
              <FaRegHeart className="text-sm text-slate-400" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="p-5">
          <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2">
            {recipe.title}
          </h2>

          <p className="text-slate-600 text-sm leading-relaxed">
            {displayDescription}
          </p>

          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              {expanded ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-xs text-slate-600 mb-3">
          <span className="inline-flex items-center justify-center gap-1.5 font-medium">
            <FaClock className="text-blue-600" aria-hidden="true" />
            {recipe.prepTime} min
          </span>
          <span className="inline-flex items-center justify-center gap-1.5 font-medium border-l border-slate-200">
            <FaUsers className="text-cyan-600" aria-hidden="true" />
            {recipe.servings} porc.
          </span>
        </div>

        <Link
          to={`/recipes/${recipe.id}`}
          className="inline-flex items-center justify-center gap-2 w-full bg-slate-900 group-hover:bg-blue-600 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
        >
          Ver receta
          <FaArrowRight className="text-xs" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};

export default RecipeCard;