import { Link } from 'react-router';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <>
      <title>404 - Página no encontrada | CookBook</title>
      <section className="flex flex-col items-center justify-center text-center py-24 px-4">
        <FaExclamationTriangle
          className="text-amber-500 text-6xl mb-4"
          aria-hidden="true"
        />
        <h1 className="text-3xl font-bold mb-2">404 - Página no encontrada</h1>
        <p className="text-stone-600 mb-6 max-w-md">
          La ruta que intentaste abrir no existe dentro de CookBook.
        </p>
        <Link
          to="/"
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2.5 rounded-lg transition"
        >
          Volver al inicio
        </Link>
      </section>
    </>
  );
};

export default NotFoundPage;