import { useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';
import { updateRecipe } from '../services/recipesApi';

const CATEGORIES = ['Desayuno', 'Almuerzo', 'Cena', 'Postre', 'Bebida'];
const DIFFICULTIES = ['Fácil', 'Media', 'Difícil'];

const formatIngredientsForTextarea = (ingredients = []) =>
  ingredients.map((item) => `${item.name} | ${item.quantity}`).join('\n');

const formatStepsForTextarea = (steps = []) => steps.join('\n');

const parseIngredients = (rawText) =>
  rawText
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

const parseSteps = (rawText) =>
  rawText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const EditRecipePage = () => {
  const recipe = useLoaderData();
  const navigate = useNavigate();

  const [title, setTitle] = useState(recipe.title || '');
  const [category, setCategory] = useState(recipe.category || 'Desayuno');
  const [difficulty, setDifficulty] = useState(recipe.difficulty || 'Fácil');
  const [prepTime, setPrepTime] = useState(String(recipe.prepTime ?? 20));
  const [servings, setServings] = useState(String(recipe.servings ?? 4));
  const [description, setDescription] = useState(recipe.description || '');
  const [ingredientsText, setIngredientsText] = useState(
    formatIngredientsForTextarea(recipe.ingredients)
  );
  const [stepsText, setStepsText] = useState(
    formatStepsForTextarea(recipe.steps)
  );
  const [authorName, setAuthorName] = useState(recipe.author?.name || '');
  const [authorEmail, setAuthorEmail] = useState(recipe.author?.email || '');
  const [authorBio, setAuthorBio] = useState(recipe.author?.bio || '');

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
      toast.error('Revisa los campos marcados antes de guardar.');
      return;
    }

    setErrors({});

    const updatedRecipe = {
      ...recipe,
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
      await updateRecipe(recipe.id, updatedRecipe);
      toast.success('Receta actualizada correctamente');
      navigate(`/recipes/${recipe.id}`);
    } catch (error) {
      toast.error(error.message || 'No se pudo actualizar la receta');
      setSubmitting(false);
    }
  };

  return (
    <>
      <title>Editar: {recipe.title} | CookBook</title>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link
            to={`/recipes/${recipe.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-700 px-4 py-2 text-sm font-semibold text-slate-700 shadow-2xs transition"
          >
            <FaArrowLeft aria-hidden="true" />
            Volver al detalle
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-50 via-cyan-50/70 to-white px-6 sm:px-8 py-6 border-b border-slate-200/80">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Actualizar preparación
            </span>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
              Editar receta
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Modifica los campos que desees y guarda para ver los cambios en el
              detalle.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <label
                htmlFor="edit-title"
                className="block text-sm font-semibold text-slate-800 mb-1"
              >
                Título de la receta
              </label>
              <input
                id="edit-title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
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
                  htmlFor="edit-category"
                  className="block text-sm font-semibold text-slate-800 mb-1"
                >
                  Categoría
                </label>
                <select
                  id="edit-category"
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
                  htmlFor="edit-difficulty"
                  className="block text-sm font-semibold text-slate-800 mb-1"
                >
                  Dificultad
                </label>
                <select
                  id="edit-difficulty"
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
              <div>
                <label
                  htmlFor="edit-prepTime"
                  className="block text-sm font-semibold text-slate-800 mb-1"
                >
                  Tiempo de preparación (minutos)
                </label>
                <input
                  id="edit-prepTime"
                  name="prepTime"
                  type="number"
                  min="1"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
                {errors.prepTime && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {errors.prepTime}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="edit-servings"
                  className="block text-sm font-semibold text-slate-800 mb-1"
                >
                  Porciones (1 a 20)
                </label>
                <input
                  id="edit-servings"
                  name="servings"
                  type="number"
                  min="1"
                  max="20"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
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
                htmlFor="edit-description"
                className="block text-sm font-semibold text-slate-800 mb-1"
              >
                Descripción
              </label>
              <textarea
                id="edit-description"
                name="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                  htmlFor="edit-ingredients"
                  className="block text-sm font-semibold text-slate-800 mb-1"
                >
                  Ingredientes (uno por línea: Nombre | Cantidad)
                </label>
                <textarea
                  id="edit-ingredients"
                  name="ingredients"
                  rows="4"
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
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
                  htmlFor="edit-steps"
                  className="block text-sm font-semibold text-slate-800 mb-1"
                >
                  Pasos de preparación (uno por línea)
                </label>
                <textarea
                  id="edit-steps"
                  name="steps"
                  rows="4"
                  value={stepsText}
                  onChange={(e) => setStepsText(e.target.value)}
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
                <div>
                  <label
                    htmlFor="edit-authorName"
                    className="block text-sm font-semibold text-slate-800 mb-1"
                  >
                    Nombre del autor
                  </label>
                  <input
                    id="edit-authorName"
                    name="authorName"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                  {errors.authorName && (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      {errors.authorName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="edit-authorEmail"
                    className="block text-sm font-semibold text-slate-800 mb-1"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="edit-authorEmail"
                    name="authorEmail"
                    type="email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
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
                  htmlFor="edit-authorBio"
                  className="block text-sm font-semibold text-slate-800 mb-1"
                >
                  Biografía corta (opcional)
                </label>
                <input
                  id="edit-authorBio"
                  name="authorBio"
                  type="text"
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </fieldset>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Link
                to={`/recipes/${recipe.id}`}
                className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold px-4 py-2.5 rounded-xl transition"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
              >
                {submitting ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default EditRecipePage;