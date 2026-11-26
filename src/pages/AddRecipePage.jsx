import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';
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

    if (!Number.isInteger(parsedServings) || parsedServings < 1 || parsedServings > 20) {
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

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link
            to="/recipes"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800"
          >
            <FaArrowLeft aria-hidden="true" />
            Volver a recetas
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 sm:p-8 space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-stone-900">
              Publicar nueva receta
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              Completa todos los campos para añadir tu receta al catálogo.
            </p>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-stone-800 mb-1"
            >
              Título de la receta
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Empanadas de carne caseras"
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.title && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {errors.title}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-stone-800 mb-1"
              >
                Categoría
              </label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                className="block text-sm font-semibold text-stone-800 mb-1"
              >
                Dificultad
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
            <div>
              <label
                htmlFor="prepTime"
                className="block text-sm font-semibold text-stone-800 mb-1"
              >
                Tiempo de preparación (minutos)
              </label>
              <input
                id="prepTime"
                name="prepTime"
                type="number"
                min="1"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.prepTime && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {errors.prepTime}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="servings"
                className="block text-sm font-semibold text-stone-800 mb-1"
              >
                Porciones (1 a 20)
              </label>
              <input
                id="servings"
                name="servings"
                type="number"
                min="1"
                max="20"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.servings && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {errors.servings}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-stone-800 mb-1"
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
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.description && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {errors.description}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="ingredients"
              className="block text-sm font-semibold text-stone-800 mb-1"
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
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
              className="block text-sm font-semibold text-stone-800 mb-1"
            >
              Pasos de preparación (uno por línea)
            </label>
            <textarea
              id="steps"
              name="steps"
              rows="4"
              value={stepsText}
              onChange={(e) => setStepsText(e.target.value)}
              placeholder={'Prepara el relleno y deja enfriar.\nArma las porciones y fríe hasta dorar.'}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.steps && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {errors.steps}
              </p>
            )}
          </div>

          <fieldset className="border-t border-stone-200 pt-5 space-y-4">
            <legend className="text-base font-bold text-stone-900">
              Datos del autor
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="authorName"
                  className="block text-sm font-semibold text-stone-800 mb-1"
                >
                  Nombre del autor
                </label>
                <input
                  id="authorName"
                  name="authorName"
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors.authorName && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {errors.authorName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="authorEmail"
                  className="block text-sm font-semibold text-stone-800 mb-1"
                >
                  Correo electrónico
                </label>
                <input
                  id="authorEmail"
                  name="authorEmail"
                  type="email"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder="autor@ejemplo.com"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors.authorEmail && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {errors.authorEmail}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="authorBio"
                className="block text-sm font-semibold text-stone-800 mb-1"
              >
                Biografía corta (opcional)
              </label>
              <input
                id="authorBio"
                name="authorBio"
                type="text"
                value={authorBio}
                onChange={(e) => setAuthorBio(e.target.value)}
                placeholder="Ej: Cocinero aficionado de recetas tradicionales"
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </fieldset>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Link
              to="/recipes"
              className="border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold px-4 py-2.5 rounded-lg transition"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition cursor-pointer"
            >
              {submitting ? 'Guardando...' : 'Guardar receta'}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddRecipePage;