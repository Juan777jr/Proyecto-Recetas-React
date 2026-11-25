import { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import Spinner from '../components/Spinner';
import { getRecipes } from '../services/recipesApi';

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadRecipes() {
      try {
        setLoading(true);
        setError('');
        const data = await getRecipes();
        if (active) {
          setRecipes(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'No se pudieron cargar las recetas.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRecipes();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <title>Todas las recetas | CookBook</title>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900">
            Explorar recetas
          </h1>
          <p className="mt-1 text-stone-600">
            Revisa todas las preparaciones disponibles en el recetario.
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

        {!loading && !error && recipes.length === 0 && (
          <p className="text-stone-600">
            No hay recetas registradas en este momento.
          </p>
        )}

        {!loading && !error && recipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default RecipesPage;