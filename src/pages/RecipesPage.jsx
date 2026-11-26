import { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import Spinner from '../components/Spinner';
import { getRecipes } from '../services/recipesApi';

const CATEGORIES = ['Desayuno', 'Almuerzo', 'Cena', 'Postre', 'Bebida'];
const DIFFICULTIES = ['Fácil', 'Media', 'Difícil'];
const PAGE_SIZE = 6;

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [difficulty, setDifficulty] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleToggleFavorite = (updatedRecipe) => {
    setRecipes((prev) =>
      prev.map((item) => (item.id === updatedRecipe.id ? updatedRecipe : item))
    );
  };

  const normalizedSearch = search.trim().toLowerCase();

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesTitle = recipe.title.toLowerCase().includes(normalizedSearch);
    const matchesCategory =
      category === 'Todas' || recipe.category === category;
    const matchesDifficulty =
      difficulty === 'Todas' || recipe.difficulty === difficulty;

    return matchesTitle && matchesCategory && matchesDifficulty;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRecipes.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedRecipes = filteredRecipes.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('Todas');
    setDifficulty('Todas');
    setCurrentPage(1);
  };

  return (
    <>
      <title>Todas las recetas | CookBook</title>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900">
            Explorar recetas
          </h1>
          <p className="mt-1 text-stone-600">
            Busca por nombre o combina filtros de categoría y dificultad.
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

        {!loading && !error && (
          <>
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label
                  htmlFor="search-recipe"
                  className="block text-xs font-semibold uppercase tracking-wide text-stone-700 mb-1"
                >
                  Buscar por título
                </label>
                <input
                  id="search-recipe"
                  type="search"
                  placeholder="Ej: Arepas, Brownie..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label
                  htmlFor="filter-category"
                  className="block text-xs font-semibold uppercase tracking-wide text-stone-700 mb-1"
                >
                  Categoría
                </label>
                <select
                  id="filter-category"
                  value={category}
                  onChange={handleCategoryChange}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Todas">Todas las categorías</option>
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-difficulty"
                  className="block text-xs font-semibold uppercase tracking-wide text-stone-700 mb-1"
                >
                  Dificultad
                </label>
                <select
                  id="filter-difficulty"
                  value={difficulty}
                  onChange={handleDifficultyChange}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Todas">Todas las dificultades</option>
                  {DIFFICULTIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="w-full border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold py-2 px-4 rounded-lg text-sm transition cursor-pointer"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>

            <p className="mb-5 text-sm text-stone-600">
              Mostrando{' '}
              <span className="font-semibold text-stone-900">
                {paginatedRecipes.length}
              </span>{' '}
              de{' '}
              <span className="font-semibold text-stone-900">
                {filteredRecipes.length}
              </span>{' '}
              recetas filtradas ({recipes.length} en total)
            </p>

            {filteredRecipes.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-xl p-8 text-center">
                <p className="text-stone-700 font-medium mb-3">
                  No encontramos recetas que coincidan con tu búsqueda o filtros.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
                >
                  Ver todas las recetas
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav
                    aria-label="Paginación de recetas"
                    className="mt-8 flex flex-wrap items-center justify-center gap-4"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={safePage === 1}
                      className="border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-50 text-stone-800 font-semibold px-4 py-2 rounded-lg text-sm transition cursor-pointer"
                    >
                      Anterior
                    </button>

                    <span className="text-sm font-semibold text-stone-700">
                      Página {safePage} de {totalPages}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(totalPages, prev + 1)
                        )
                      }
                      disabled={safePage === totalPages}
                      className="border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-50 text-stone-800 font-semibold px-4 py-2 rounded-lg text-sm transition cursor-pointer"
                    >
                      Siguiente
                    </button>
                  </nav>
                )}
              </>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default RecipesPage;