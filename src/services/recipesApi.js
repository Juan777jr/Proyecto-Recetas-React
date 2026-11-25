const API_URL = '/api/recipes';

export async function getRecipes() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('No se pudieron cargar las recetas');
  }

  return response.json();
}

export async function getLatestRecipes(limit = 3) {
  const recipes = await getRecipes();

  return [...recipes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
}