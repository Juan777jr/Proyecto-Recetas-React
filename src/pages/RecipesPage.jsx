import { useEffect, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
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
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-50 via-cyan-50/70 to-white border border-blue-100 p-6 sm:p-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Catálogo completo
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            Explorar recetas
          </h1>
          <p className="mt-1 text-slate-600">
            Busca por nombre o combina filtros de categoría y dificultad.
          </p>
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

        {!loading && !error && (
          <>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700 mb-4">
                <FaFilter aria-hidden="true" />
                <span>Filtros de búsqueda</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                  <label
                    htmlFor="search-recipe"
                    className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5"
                  >
                    Buscar por título
                  </label>
                  <input
                    id="search-recipe"
                    type="search"
                    placeholder="Ej: Arepas, Brownie..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="filter-category"
                    className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5"
                  >
                    Categoría
                  </label>
                  <select
                    id="filter-category"
                    value={category}
                    onChange={handleCategoryChange}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
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
                    className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5"
                  >
                    Dificultad
                  </label>
                  <select
                    id="filter-difficulty"
                    value={difficulty}
                    onChange={handleDifficultyChange}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
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
                    className="w-full border border-slate-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold py-2 px-4 rounded-xl text-sm transition cursor-pointer"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            </div>

            <p className="mb-5 text-sm text-slate-600">
              Mostrando{' '}
              <span className="font-semibold text-blue-700">
                {paginatedRecipes.length}
              </span>{' '}
              de{' '}
              <span className="font-semibold text-slate-900">
                {filteredRecipes.length}
              </span>{' '}
              recetas filtradas ({recipes.length} en total)
            </p>

            {filteredRecipes.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
                <p className="text-slate-700 font-medium mb-3">
                  No encontramos recetas que coincidan con tu búsqueda o filtros.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
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
                      className="border border-slate-300 bg-white hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50 text-slate-800 font-semibold px-4 py-2 rounded-xl text-sm transition cursor-pointer"
                    >
                      Anterior
                    </button>

                    <span className="rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-sm font-semibold text-blue-800">
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
                      className="border border-slate-300 bg-white hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50 text-slate-800 font-semibold px-4 py-2 rounded-xl text-sm transition cursor-pointer"
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