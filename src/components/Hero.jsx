import { Link } from 'react-router';
import { FaBookOpen, FaPlus, FaStar } from 'react-icons/fa';

const Hero = ({
  title = 'Recetas caseras para todos los días',
  subtitle = 'Explora preparaciones paso a paso, guarda tus favoritas y comparte tus propias recetas.',
}) => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 p-8 sm:p-12 text-white shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-sky-200 ring-1 ring-sky-400/30 mb-4">
              <FaStar className="text-cyan-300" aria-hidden="true" />
              Colección gastronómica
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl leading-tight">
              {title}
            </h1>

            <p className="mt-4 text-base text-blue-100/90 sm:text-lg max-w-2xl leading-relaxed">
              {subtitle}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/recipes"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-3 text-sm shadow-sm transition"
              >
                <FaBookOpen aria-hidden="true" />
                Explorar catálogo
              </Link>
              <Link
                to="/add-recipe"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 text-sm ring-1 ring-white/25 transition"
              >
                <FaPlus aria-hidden="true" />
                Publicar receta
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-6 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-200">
                Organiza tu cocina
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-950/35 p-4 border border-white/10">
                  <span className="block text-2xl font-extrabold text-white">5</span>
                  <span className="text-xs text-blue-200">Categorías</span>
                </div>
                <div className="rounded-xl bg-slate-950/35 p-4 border border-white/10">
                  <span className="block text-2xl font-extrabold text-cyan-300">3</span>
                  <span className="text-xs text-blue-200">Niveles</span>
                </div>
              </div>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                Filtra por dificultad, guarda tus platos preferidos y edita ingredientes o pasos cuando quieras.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;