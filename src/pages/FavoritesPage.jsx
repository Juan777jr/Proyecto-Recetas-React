import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import RecipeCard from '../components/RecipeCard';
import Spinner from '../components/Spinner';
import { getRecipes } from '../services/recipesApi';

const FavoritesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadFavorites() {
      try {
        setLoading(true);
        setError('');
        const data = await getRecipes();
        if (active) {
          setRecipes(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'No se pudieron cargar las favoritas.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadFavorites();

    return () => {
      active = false;
    };
  }, []);

  const favoriteRecipes = recipes.filter((recipe) => Boolean(recipe.favorite));

  const handleToggleFavorite = (updatedRecipe) => {
    setRecipes((prev) =>
      prev.map((item) => (item.id === updatedRecipe.id ? updatedRecipe : item))
    );
  };

  return (
    <>
      <title>Recetas favoritas | CookBook</title>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900">
            Recetas favoritas
          </h1>
          <p className="mt-1 text-stone-600">
            Aquí encuentras las preparaciones que marcaste con corazón.
          </p>
        </div>

        {loading && <Spinner loading={loading} />}

        {!loading && error && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
          >
            {error}
          </div>
        )}

        {!loading && !error && favoriteRecipes.length === 0 && (
          <div className="bg-white border border-stone-200 rounded-xl p-8 text-center">
            <p className="text-stone-700 font-medium mb-3">
              Todavía no tienes recetas marcadas como favoritas.
            </p>
            <Link
              to="/recipes"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              Explorar recetas
            </Link>
          </div>
        )}

        {!loading && !error && favoriteRecipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default FavoritesPage;