import { createBrowserRouter, RouterProvider, Link } from 'react-router';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import NotFoundPage from './pages/NotFoundPage';

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
        element: (
          <PlaceholderPage
            title="Detalle de receta"
            description="Esta vista se completará en la Sesión 2 con loader y errorElement."
          />
        ),
      },
      {
        path: 'add-recipe',
        element: (
          <PlaceholderPage
            title="Nueva receta"
            description="El formulario para crear recetas se implementará en la Sesión 2."
          />
        ),
      },
      {
        path: 'edit-recipe/:id',
        element: (
          <PlaceholderPage
            title="Editar receta"
            description="La edición precargada se implementará en la Sesión 2."
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