import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';
import Input from '../components/Input';
import { createRecipe } from '../services/recipesApi';

const CATEGORIES = ['Desayuno', 'Almuerzo', 'Cena', 'Postre', 'Bebida'];
const DIFFICULTIES = ['Fácil', 'Media', 'Difícil'];

const parseIngredients = (rawText) => {
  return rawText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.includes('|') ? '|' : ':';
      const [namePart, ...qtyParts] = line.split(separator);
      const name = (namePart || '').trim();
      const quantity = qtyParts.join(separator).trim() || 'Al gusto';
      return { name, quantity };
    })
    .filter((item) => item.name.length > 0);
};

const parseSteps = (rawText) => {
  return rawText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const AddRecipePage = () => {
  const navigate = useNavigate();
  const titleInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Desayuno');
  const [difficulty, setDifficulty] = useState('Fácil');
  const [prepTime, setPrepTime] = useState('20');
  const [servings, setServings] = useState('4');
  const [description, setDescription] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorBio, setAuthorBio] = useState('');

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const nextErrors = {};
    const parsedPrepTime = Number(prepTime);
    const parsedServings = Number(servings);
    const parsedIngredients = parseIngredients(ingredientsText);
    const parsedSteps = parseSteps(stepsText);

    if (!title.trim()) {
      nextErrors.title = 'El título de la receta es obligatorio.';
    }

    if (!CATEGORIES.includes(category)) {
      nextErrors.category = 'Selecciona una categoría válida.';
    }

    if (!DIFFICULTIES.includes(difficulty)) {
      nextErrors.difficulty = 'Selecciona una dificultad válida.';
    }

    if (!Number.isInteger(parsedPrepTime) || parsedPrepTime <= 0) {
      nextErrors.prepTime = 'El tiempo debe ser un número entero mayor a 0.';
    }

    if (
      !Number.isInteger(parsedServings) ||
      parsedServings < 1 ||
      parsedServings > 20
    ) {
      nextErrors.servings = 'Las porciones deben ser un entero entre 1 y 20.';
    }

    if (!description.trim()) {
      nextErrors.description = 'Escribe una breve descripción de la receta.';
    }

    if (parsedIngredients.length === 0) {
      nextErrors.ingredients =
        'Agrega al menos 1 ingrediente (ej: Harina | 2 tazas).';
    }

    if (parsedSteps.length === 0) {
      nextErrors.steps = 'Agrega al menos 1 paso de preparación.';
    }

    if (!authorName.trim()) {
      nextErrors.authorName = 'El nombre del autor es obligatorio.';
    }

    if (!authorEmail.trim() || !isValidEmail(authorEmail)) {
      nextErrors.authorEmail = 'Ingresa un correo electrónico válido.';
    }

    return {
      isValid: Object.keys(nextErrors).length === 0,
      nextErrors,
      parsedPrepTime,
      parsedServings,
      parsedIngredients,
      parsedSteps,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      isValid,
      nextErrors,
      parsedPrepTime,
      parsedServings,
      parsedIngredients,
      parsedSteps,
    } = validateForm();

    if (!isValid) {
      setErrors(nextErrors);
      if (nextErrors.title && titleInputRef.current) {
        titleInputRef.current.focus();
      }
      toast.error('Revisa los campos marcados antes de guardar.');
      return;
    }

    setErrors({});

    const newRecipe = {
      title: title.trim(),
      category,
      difficulty,
      prepTime: parsedPrepTime,
      servings: parsedServings,
      description: description.trim(),
      ingredients: parsedIngredients,
      steps: parsedSteps,
      author: {
        name: authorName.trim(),
        email: authorEmail.trim(),
        bio: authorBio.trim(),
      },
    };

    try {
      setSubmitting(true);
      const created = await createRecipe(newRecipe);
      toast.success('Receta creada con éxito');
      navigate(`/recipes/${created.id}`);
    } catch (error) {
      toast.error(error.message || 'No se pudo guardar la receta');
      setSubmitting(false);
    }
  };

  return (
    <>
      <title>Nueva receta | CookBook</title>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link
            to="/recipes"
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-700 px-4 py-2 text-sm font-semibold text-slate-700 shadow-2xs transition"
          >
            <FaArrowLeft aria-hidden="true" />
            Volver a recetas
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-50 via-cyan-50/70 to-white px-6 sm:px-8 py-6 border-b border-slate-200/80">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Nuevo registro
            </span>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
              Publicar nueva receta
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Completa todos los campos para añadir tu receta al catálogo.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <Input
              ref={titleInputRef}
              id="title"
              name="title"
              label="Título de la receta"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Empanadas de carne caseras"
              error={errors.title}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold text-slate-800 mb-1"
                >
                  Categoría
                </label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                >
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {errors.category}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-semibold text-slate-800 mb-1"
                >
                  Dificultad
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                >
                  {DIFFICULTIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.difficulty && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {errors.difficulty}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="prepTime"
                name="prepTime"
                type="number"
                label="Tiempo de preparación (minutos)"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                min="1"
                error={errors.prepTime}
              />

              <Input
                id="servings"
                name="servings"
                type="number"
                label="Porciones (1 a 20)"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                min="1"
                max="20"
                error={errors.servings}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-slate-800 mb-1"
              >
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brevemente el plato y su sabor..."
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
              {errors.description && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="ingredients"
                  className="block text-sm font-semibold text-slate-800 mb-1"
                >
                  Ingredientes (uno por línea: Nombre | Cantidad)
                </label>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  rows="4"
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  placeholder={'Harina de maíz | 2 tazas\nCarne molida | 350 g'}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
                {errors.ingredients && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {errors.ingredients}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="steps"
                  className="block text-sm font-semibold text-slate-800 mb-1"
                >
                  Pasos de preparación (uno por línea)
                </label>
                <textarea
                  id="steps"
                  name="steps"
                  rows="4"
                  value={stepsText}
                  onChange={(e) => setStepsText(e.target.value)}
                  placeholder={
                    'Prepara el relleno y deja enfriar.\nArma las porciones y fríe hasta dorar.'
                  }
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
                {errors.steps && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {errors.steps}
                  </p>
                )}
              </div>
            </div>

            <fieldset className="rounded-2xl bg-blue-50/50 border border-blue-100 p-5 space-y-4">
              <legend className="text-base font-bold text-slate-900 px-1">
                Datos del autor
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="authorName"
                  name="authorName"
                  label="Nombre del autor"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Tu nombre"
                  error={errors.authorName}
                />

                <Input
                  id="authorEmail"
                  name="authorEmail"
                  type="email"
                  label="Correo electrónico"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder="autor@ejemplo.com"
                  error={errors.authorEmail}
                />
              </div>

              <Input
                id="authorBio"
                name="authorBio"
                label="Biografía corta (opcional)"
                value={authorBio}
                onChange={(e) => setAuthorBio(e.target.value)}
                placeholder="Ej: Cocinero aficionado de recetas tradicionales"
              />
            </fieldset>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Link
                to="/recipes"
                className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold px-4 py-2.5 rounded-xl transition"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
              >
                {submitting ? 'Guardando...' : 'Guardar receta'}
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddRecipePage;