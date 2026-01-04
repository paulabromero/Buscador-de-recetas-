// Se obtiene el elemento input para busqueda
const inputSearch = document.getElementById("input_search")
// Se obtiene el elemento boton para busqueda
const btnSearch = document.getElementById("btn_search")
// url de api para busqueda de recetas por ingredientes
const urlSearchMealAPI = "https://www.themealdb.com/api/json/v1/1/filter.php?i="
// url de api para traducciones
const urlTranslate = " https://api.mymemory.translated.net/get?q="
// Par de lenguajes a traducir (primero el lenguaje de input a lenguaje output)
const langpair = "langpair=es|en"
// Obtenemos el elemento que sera el contenedor de las recetas obtenidas en la busqueda
let contResult = document.getElementById("resultRecetas")
// url para los detalles de la descripción de la receta.
const urlDetails = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="

// const APIKEY = ""; API key de DeepL

const search = async() => {
  try{
    // Solicitud a la API de traducción de español a ingles
    let translateING = await fetch(`${urlTranslate}${encodeURIComponent(inputSearch.value)}&${langpair}`)
    // traducir("EN")  --> integración con API DeepL, solo funciona en backend
    const ingTraducido = await translateING.json()
    // console.log(ingTraducido.responseData.translatedText)
    // Armamos la url con el ingrediente traducido al ingles para obtener recetas que contengan este ingrediente
    let url = urlSearchMealAPI + `${ingTraducido.responseData.translatedText}`
    // Realizamos la peticion a la API de recetas
    const recetasEnBruto = await fetch(url);
    const recetasRefinadas = await recetasEnBruto.json();
    // console.log(recetasRefinadas.meals);
    mostrarRecetas(recetasRefinadas.meals);
  }catch{
    console.log("Error")
  }
}

const searchDetails = async(idMeal) => {
  try{
    let details = await fetch(`${urlDetails}${idMeal}`)
    let dataDetails = await details.json()
    console.log(dataDetails.meals[0])
    return dataDetails.meals[0]
  }catch{
    
  }
}

const mostrarRecetas = (recetas) => {
  if(!recetas){
    contResult.innerHTML = `
    <div class="col-12">
    </div>
    <div class="col-12">
      <div class="alert alert-warning mb-0" role="alert">
        <p> No se encontraron resultados. Prueba otro ingrediente.</p>
      </div>
    </div>
  `;
  }else{
    contResult.innerHTML = "";
    recetas.forEach(async receta => {
      const {idMeal, strMeal, strMealThumb} = receta;
      // console.log(`${idMeal} ${strMeal} ${strMealThumb}`)
     let details = await searchDetails(idMeal)
      const ingredientes = Object.keys(details)
        .filter(key => key.startsWith("strIngredient"))
        .map(key => details[key]);
    console.log(ingredientes)
    // ingredientes.forEach()
    const ingredientesFiltrados = ingredientes.filter(i=>i!="")
      let listaDeIngredientes = ""
     ingredientesFiltrados.forEach(ingrediente => listaDeIngredientes += `<li>${ingrediente}</li>`)
    console.log(listaDeIngredientes)
      contResult.innerHTML += `<div class="col">
                                <div class="card">
                                  <div class="card-inner">
                                    <div class="card-front">
                                      <img src="${strMealThumb}" class="card-img-top" alt="${strMeal}">
                                      <div class="card-body">
                                        <h5 class="card-title">${strMeal}</h5>
                                        <p class="card-text">Pasa el mouse sobre la tarjeta para ver más información</p>
                                      </div>
                                    </div>
                                    <div class="card-back" data-bs-spy="scroll" data-bs-target="#simple-list-example" data-bs-offset="0" data-bs-smooth-scroll="true" class="scrollspy-example" tabindex="0">
                                      <h5 class="card-title">${strMeal}</h5>
                                      <p class="card-text">¡Descubre esta deliciosa receta y sorprende a todos con tus habilidades culinarias!</p>
                                      <ul> 
                                      ${listaDeIngredientes}
                                      </ul>
                                      <a href="https://www.themealdb.com/meal/${idMeal}" class="btn btn-success" target="_blank">Ver receta completa</a>
                                    </div>
                                  </div>
                                </div>
                              </div>`

  });
}
}

// Se agrega un listener al ocurrir el evento click en el btn de busqueda
btnSearch.addEventListener("click", () => {
  search()
})

inputSearch.addEventListener("keydown", (event) =>{
  if (event.key === 'Enter') {
    event.preventDefault()
    search()
  }
})




// integración con API DeepL, solo funciona en backend

// async function traducir(leng) {
//   const texto = inputSearch.value;
//   const targetLang = leng;

//   console.log(`DeepL-Auth-Key ${APIKEY}`)
//   console.log([texto])
//   console.log(targetLang)


//   const options = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `DeepL-Auth-Key ${APIKEY}`
//     },
//     body: JSON.stringify({
//       text: [texto],
//       target_lang: targetLang
//     })
//   };

//   try {
//     const response = await fetch('https://api-free.deepl.com/v2/translate', options);
//     const data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.error("Error al traducir:", error);
//   }
// }