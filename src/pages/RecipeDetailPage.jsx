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

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            to="/recipes"
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-700 px-4 py-2 text-sm font-semibold text-slate-700 shadow-2xs transition"
          >
            <FaArrowLeft aria-hidden="true" />
            Volver al listado
          </Link>
        </div>

        <article className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 via-cyan-50/70 to-white px-6 sm:px-8 py-6 border-b border-slate-200/80">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {recipe.category}
                </span>
                <span className="bg-white text-sky-700 border border-sky-200 text-xs font-semibold px-3 py-1 rounded-full">
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
                  className="inline-flex items-center gap-1.5 border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-sm font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer disabled:opacity-50"
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
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3.5 py-2 rounded-xl transition"
                >
                  <FaEdit aria-hidden="true" />
                  Editar
                </Link>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
                >
                  <FaTrash aria-hidden="true" />
                  {deleting ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {recipe.title}
            </h1>
            <p className="mt-3 text-slate-600 leading-relaxed max-w-3xl">
              {recipe.description}
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-slate-700">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700 shrink-0">
                  <FaClock aria-hidden="true" />
                </span>
                <div>
                  <span className="block text-xs text-slate-400 font-medium">
                    Tiempo
                  </span>
                  <strong className="text-slate-900">{recipe.prepTime} min</strong>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-slate-700">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700 shrink-0">
                  <FaUsers aria-hidden="true" />
                </span>
                <div>
                  <span className="block text-xs text-slate-400 font-medium">
                    Porciones
                  </span>
                  <strong className="text-slate-900">{recipe.servings}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-slate-700">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 shrink-0">
                  <FaUser aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <span className="block text-xs text-slate-400 font-medium">
                    Autor
                  </span>
                  <strong className="block truncate text-slate-900">
                    {recipe.author?.name}
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 rounded-2xl bg-blue-50/50 border border-blue-100 p-5">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
                  <span>Ingredientes</span>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
                    {recipe.ingredients.length}
                  </span>
                </h2>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  {recipe.ingredients.map((item, idx) => (
                    <li
                      key={`${item.name}-${idx}`}
                      className="flex items-baseline justify-between gap-3 rounded-xl bg-white px-3.5 py-2.5 border border-blue-100/80"
                    >
                      <span className="font-semibold text-slate-800">
                        {item.name}
                      </span>
                      <span className="text-xs font-medium text-blue-700 shrink-0">
                        {item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-7">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Preparación paso a paso
                </h2>
                <ol className="space-y-3.5 text-slate-700">
                  {recipe.steps.map((step, idx) => (
                    <li
                      key={`${idx}-${step.slice(0, 12)}`}
                      className="flex items-start gap-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 p-4"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <aside className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-slate-600 bg-slate-50/60 rounded-2xl p-5">
              <div>
                <h2 className="font-bold text-slate-900">Sobre el autor</h2>
                <p className="font-semibold text-blue-700 mt-0.5">
                  {recipe.author?.name}
                </p>
                {recipe.author?.bio && (
                  <p className="mt-1 text-slate-600">{recipe.author.bio}</p>
                )}
              </div>
              <p className="text-xs font-medium text-slate-500">
                {recipe.author?.email}
              </p>
            </aside>
          </div>
        </article>
      </section>
    </>
  );
};

export default RecipeDetailPage;