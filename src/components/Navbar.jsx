import { NavLink } from 'react-router';
import { FaUtensils } from 'react-icons/fa';

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-blue-600 text-white rounded-full px-4 py-1.5 text-sm font-semibold shadow-xs transition'
      : 'text-slate-600 hover:text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium transition';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <nav
        aria-label="Navegación principal"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="flex min-h-18 flex-wrap items-center justify-between gap-3 py-3">
          <NavLink to="/" className="flex items-center gap-3 shrink-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-600/30">
              <FaUtensils className="text-base" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <span className="block text-xl font-extrabold tracking-tight text-slate-900">
                Cook<span className="text-blue-600">Book</span>
              </span>
              <span className="hidden sm:block text-[11px] font-medium text-slate-400">
                Recetario interactivo
              </span>
            </div>
          </NavLink>

          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200/80">
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