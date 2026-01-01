const inputBusqueda = document.getElementById('busqueda');
const btnBuscar = document.getElementById('btnBuscar');
const contenedor = document.getElementById('resultados');

btnBuscar.addEventListener('click', () => {
  const ingrediente = inputBusqueda.value.trim();
  if (ingrediente) {
    buscarRecetas(ingrediente);
  }
});

inputBusqueda.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    btnBuscar.click();
  }
});

async function buscarRecetas(ingrediente) {
  contenedor.innerHTML = ''; // Limpia resultados anteriores

  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediente}`);
    const data = await res.json();

    if (!data.meals) {
      contenedor.innerHTML = `<p class="text-white text-center">Lo sentimos, no se encontraron recetas. Intenta con otro ingrediente.</p>`;
      return;
    }

    for (const { idMeal, strMeal, strMealThumb } of data.meals) {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <img src="${strMealThumb}" class="card-img-top" alt="${strMeal}">
        <div class="card-body">
          <h5 class="card-title">${strMeal}</h5>
          <button class="btn btn-primary ver-receta" data-id="${idMeal}">Ver Receta</button>
        </div>
      `;

      contenedor.appendChild(card);
    }

    document.querySelectorAll('.ver-receta').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        mostrarIngredientes(id, btn.closest('.card'));
      });
    });

  } catch (error) {
    console.error('Error al buscar recetas:', error);
    contenedor.innerHTML = `<p class="text-danger text-center">Ocurrió un error. Intenta de nuevo.</p>`;
  }
}

async function mostrarIngredientes(id, card) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await res.json();

    if (data.meals && data.meals.length > 0) {
      const receta = data.meals[0];
      let ingredientes = [];

      for (let i = 1; i <= 20; i++) {
        const ing = receta[`strIngredient${i}`];
        const med = receta[`strMeasure${i}`];
        if (ing && ing.trim() !== '') {
          ingredientes.push(`${ing} - ${med}`);
        }
      }

      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${receta.strMeal}</h5>
          <p><strong>Ingredientes:</strong></p>
          <ul>${ingredientes.map(i => `<li>${i}</li>`).join('')}</ul>
          <button class="btn btn-secondary volver">Volver</button>
        </div>
      `;

      card.querySelector('.volver').addEventListener('click', () => {
        buscarRecetas(inputBusqueda.value.trim());
      });
    }

  } catch (error) {
    console.error('Error al obtener detalles:', error);
  }
}
