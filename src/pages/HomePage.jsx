import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Hero from '../components/Hero';
import Card from '../components/Card';
import RecipeCard from '../components/RecipeCard';
import Spinner from '../components/Spinner';
import { getLatestRecipes } from '../services/recipesApi';

const HomePage = () => {
  const [latestRecipes, setLatestRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadLatest() {
      try {
        setLoading(true);
        setError('');
        const data = await getLatestRecipes(3);
        if (active) {
          setLatestRecipes(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Ocurrió un error al cargar las recetas.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadLatest();

    return () => {
      active = false;
    };
  }, []);

  const handleToggleFavorite = (updatedRecipe) => {
    setLatestRecipes((prev) =>
      prev.map((item) => (item.id === updatedRecipe.id ? updatedRecipe : item))
    );
  };

  return (
    <>
      <title>Inicio | CookBook</title>

      <Hero
        title="Tu recetario casero en un solo lugar"
        subtitle="Explora preparaciones recientes, filtra por categoría o publica tu propia receta."
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card bg="bg-white">
            <h2 className="text-2xl font-bold text-stone-900">
              Para cocineros
            </h2>
            <p className="mt-2 text-stone-600">
              Comparte tus platos favoritos con ingredientes, pasos claros y
              tiempos de preparación para toda la comunidad.
            </p>
            <Link
              to="/add-recipe"
              className="mt-4 inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Publicar receta
            </Link>
          </Card>

          <Card bg="bg-amber-50">
            <h2 className="text-2xl font-bold text-stone-900">
              Para curiosos
            </h2>
            <p className="mt-2 text-stone-600">
              Descubre desayunos, almuerzos, cenas, postres y bebidas y guarda
              tus preparaciones preferidas.
            </p>
            <Link
              to="/recipes"
              className="mt-4 inline-block bg-stone-900 hover:bg-stone-800 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Explorar recetas
            </Link>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-stone-900">
            Últimas recetas
          </h2>
          <Link
            to="/recipes"
            className="bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Ver todas
          </Link>
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

        {!loading && !error && latestRecipes.length === 0 && (
          <p className="text-stone-600">
            Aún no hay recetas registradas para mostrar.
          </p>
        )}

        {!loading && !error && latestRecipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestRecipes.map((recipe) => (
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

export default HomePage;