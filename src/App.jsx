import {
  createBrowserRouter,
  RouterProvider,
  Link,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AddRecipePage from './pages/AddRecipePage';
import NotFoundPage from './pages/NotFoundPage';
import { getRecipeById } from './services/recipesApi';

const PlaceholderPage = ({ title, description }) => (
  <section className="mx-auto max-w-4xl px-4 py-16 text-center">
    <h1 className="text-3xl font-bold text-stone-900 mb-3">{title}</h1>
    <p className="text-stone-600 mb-6">{description}</p>
    <Link
      to="/recipes"
      className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2.5 rounded-lg transition"
    >
      Ir a recetas
    </Link>
  </section>
);

const RecipeErrorElement = () => {
  const error = useRouteError();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <section className="mx-auto max-w-xl px-4 py-20 text-center">
      <title>Error de receta | CookBook</title>
      <h1 className="text-3xl font-bold text-stone-900 mb-3">
        {isNotFound ? 'Receta no encontrada' : 'No se pudo cargar la receta'}
      </h1>
      <p className="text-stone-600 mb-6">
        {isNotFound
          ? 'La receta que buscas no existe o fue eliminada.'
          : 'Ocurrió un problema al consultar el servidor. Intenta de nuevo.'}
      </p>
      <Link
        to="/recipes"
        className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2.5 rounded-lg transition"
      >
        Volver al listado de recetas
      </Link>
    </section>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'recipes',
        element: <RecipesPage />,
      },
      {
        path: 'recipes/:id',
        element: <RecipeDetailPage />,
        loader: ({ params }) => getRecipeById(params.id),
        errorElement: <RecipeErrorElement />,
      },
      {
        path: 'add-recipe',
        element: <AddRecipePage />,
      },
      {
        path: 'edit-recipe/:id',
        element: (
          <PlaceholderPage
            title="Editar receta"
            description="La edición precargada se implementará enseguida."
          />
        ),
      },
      {
        path: 'favorites',
        element: (
          <PlaceholderPage
            title="Recetas favoritas"
            description="Esta sección se completará en la Sesión 3."
          />
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;