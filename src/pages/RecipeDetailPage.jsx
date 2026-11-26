import { useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import {
  FaArrowLeft,
  FaClock,
  FaEdit,
  FaHeart,
  FaRegHeart,
  FaTrash,
  FaUser,
  FaUsers,
} from 'react-icons/fa';
import { deleteRecipe, toggleFavoriteRecipe } from '../services/recipesApi';

const RecipeDetailPage = () => {
  const recipe = useLoaderData();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(Boolean(recipe.favorite));
  const [togglingFav, setTogglingFav] = useState(false);

  const handleToggleFavorite = async () => {
    const nextFavorite = !isFavorite;
    try {
      setTogglingFav(true);
      await toggleFavoriteRecipe(recipe.id, nextFavorite);
      setIsFavorite(nextFavorite);
      toast.success(
        nextFavorite
          ? 'Agregada a recetas favoritas'
          : 'Eliminada de recetas favoritas'
      );
    } catch (error) {
      toast.error(error.message || 'No se pudo actualizar favorita');
    } finally {
      setTogglingFav(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${recipe.title}"? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteRecipe(recipe.id);
      toast.success('Receta eliminada correctamente');
      navigate('/recipes');
    } catch (error) {
      toast.error(error.message || 'No se pudo eliminar la receta');
      setDeleting(false);
    }
  };

  return (
    <>
      <title>{recipe.title} | CookBook</title>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link
            to="/recipes"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800"
          >
            <FaArrowLeft aria-hidden="true" />
            Volver al listado
          </Link>
        </div>

        <article className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap gap-2">
              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                {recipe.category}
              </span>
              <span className="bg-stone-100 text-stone-700 text-xs font-medium px-3 py-1 rounded-full">
                {recipe.difficulty}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleToggleFavorite}
                disabled={togglingFav}
                aria-label={
                  isFavorite
                    ? 'Quitar receta de favoritas'
                    : 'Marcar receta como favorita'
                }
                aria-pressed={isFavorite}
                className="inline-flex items-center gap-1.5 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold px-3.5 py-2 rounded-lg transition cursor-pointer disabled:opacity-50"
              >
                {isFavorite ? (
                  <FaHeart aria-hidden="true" />
                ) : (
                  <FaRegHeart aria-hidden="true" />
                )}
                {isFavorite ? 'Favorita' : 'Marcar favorita'}
              </button>

              <Link
                to={`/edit-recipe/${recipe.id}`}
                className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-3.5 py-2 rounded-lg transition"
              >
                <FaEdit aria-hidden="true" />
                Editar
              </Link>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold px-3.5 py-2 rounded-lg transition cursor-pointer"
              >
                <FaTrash aria-hidden="true" />
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-stone-900">
            {recipe.title}
          </h1>
          <p className="mt-3 text-stone-600 leading-relaxed">
            {recipe.description}
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 bg-stone-50 p-4 rounded-lg border border-stone-200 text-sm">
            <div className="flex items-center gap-2 text-stone-700">
              <FaClock className="text-amber-600" aria-hidden="true" />
              <span>
                <strong>Tiempo:</strong> {recipe.prepTime} min
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <FaUsers className="text-amber-600" aria-hidden="true" />
              <span>
                <strong>Porciones:</strong> {recipe.servings}
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-700 col-span-2 sm:col-span-1">
              <FaUser className="text-amber-600" aria-hidden="true" />
              <span>
                <strong>Autor:</strong> {recipe.author?.name}
              </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-3">
                Ingredientes
              </h2>
              <ul className="list-disc list-inside space-y-2 text-stone-700">
                {recipe.ingredients.map((item, idx) => (
                  <li key={`${item.name}-${idx}`}>
                    <span className="font-medium">{item.name}</span> —{' '}
                    <span className="text-stone-600">{item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-3">
                Preparación
              </h2>
              <ol className="list-decimal list-inside space-y-3 text-stone-700">
                {recipe.steps.map((step, idx) => (
                  <li
                    key={`${idx}-${step.slice(0, 12)}`}
                    className="leading-relaxed"
                  >
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="mt-8 pt-6 border-t border-stone-200 text-sm text-stone-600">
            <h2 className="font-bold text-stone-900 mb-1">Sobre el autor</h2>
            <p className="font-medium text-stone-800">{recipe.author?.name}</p>
            {recipe.author?.bio && <p className="mt-1">{recipe.author.bio}</p>}
            <p className="mt-1 text-stone-500">{recipe.author?.email}</p>
          </aside>
        </article>
      </section>
    </>
  );
};

export default RecipeDetailPage;