import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { FaArrowRight, FaCompass, FaFire } from 'react-icons/fa';
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
          <Card bg="bg-white border-t-4 border-t-blue-600 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs font-semibold mb-3">
              <FaFire aria-hidden="true" />
              Modo creador
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Para cocineros
            </h2>
            <p className="mt-2 text-slate-600 leading-relaxed">
              Comparte tus platos favoritos con ingredientes, pasos claros y
              tiempos de preparación para toda la comunidad.
            </p>
            <Link
              to="/add-recipe"
              className="mt-5 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-xs transition"
            >
              Publicar receta
              <FaArrowRight className="text-xs" aria-hidden="true" />
            </Link>
          </Card>

          <Card bg="bg-gradient-to-br from-blue-50 to-cyan-50 border-t-4 border-t-cyan-600 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-white text-cyan-700 border border-cyan-200 px-3 py-1 text-xs font-semibold mb-3">
              <FaCompass aria-hidden="true" />
              Modo exploración
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Para curiosos
            </h2>
            <p className="mt-2 text-slate-600 leading-relaxed">
              Descubre desayunos, almuerzos, cenas, postres y bebidas y guarda
              tus preparaciones preferidas.
            </p>
            <Link
              to="/recipes"
              className="mt-5 inline-flex items-center gap-2 bg-slate-900 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition"
            >
              Explorar recetas
              <FaArrowRight className="text-xs" aria-hidden="true" />
            </Link>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-14">
        <div className="rounded-3xl bg-white/80 border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/80">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Recién agregadas
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Últimas recetas
              </h2>
            </div>

            <Link
              to="/recipes"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
            >
              Ver todas
              <FaArrowRight className="text-xs" aria-hidden="true" />
            </Link>
          </div>

          {loading && <Spinner loading={loading} />}

          {!loading && error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
            >
              {error}
            </div>
          )}

          {!loading && !error && latestRecipes.length === 0 && (
            <p className="text-slate-600">
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
        </div>
      </section>
    </>
  );
};

export default HomePage;