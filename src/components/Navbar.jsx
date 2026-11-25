import { NavLink } from 'react-router';
import { FaUtensils } from 'react-icons/fa';

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-amber-900 text-white rounded-md px-3 py-2 text-sm font-medium transition'
      : 'text-amber-50 hover:bg-amber-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition';

  return (
    <header className="bg-amber-600 border-b border-amber-500">
      <nav
        aria-label="Navegación principal"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="flex min-h-20 flex-wrap items-center justify-between gap-3 py-2">
          <NavLink to="/" className="flex items-center gap-2 shrink-0">
            <FaUtensils className="text-white text-2xl" aria-hidden="true" />
            <span className="text-white text-2xl font-bold tracking-tight">
              CookBook
            </span>
          </NavLink>

          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <NavLink to="/" end className={linkClass}>
              Inicio
            </NavLink>
            <NavLink to="/recipes" className={linkClass}>
              Recetas
            </NavLink>
            <NavLink to="/add-recipe" className={linkClass}>
              Nueva receta
            </NavLink>
            <NavLink to="/favorites" className={linkClass}>
              Favoritas
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;