// Se obtiene el elemento input para busqueda
const inputSearch = document.getElementById("input_search")
// Se obtiene el elemento boton para busqueda
const btnSearch = document.getElementById("btn_search")
// url de api para busqueda de recetas por ingredientes
const urlSearchMealAPI = "https://www.themealdb.com/api/json/v1/1/filter.php?i="
// url de api para traducciones
const urlTranslate = " https://api.mymemory.translated.net/get?q="
// par de lenguajes a traducir (primero el lenguaje de input a lenguaje output)
const langpair = "langpair=es|en"

const APIKEY = "e7fb40c4-5c0f-4e98-97d1-b944c2096169:fx";

async function traducir(leng) {
  const texto = inputSearch.value;
  const targetLang = leng;

  console.log(`DeepL-Auth-Key ${APIKEY}`)
  console.log([texto])
  console.log(targetLang)


  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `DeepL-Auth-Key ${APIKEY}`
    },
    body: JSON.stringify({
      text: [texto],
      target_lang: targetLang
    })
  };

  try {
    const response = await fetch('https://api-free.deepl.com/v2/translate', options);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error al traducir:", error);
  }
}

// Se agrega un listener al ocurrir el evento click en el btn de busqueda
btnSearch.addEventListener("click", async () => {
  // let translateING = await fetch(`${urlTranslate}${encodeURIComponent(inputSearch.value)}&${langpair}`)

  traducir("EN") 
  // console.log(translateING.json())

  // let url = urlSearchMealAPI + ``

  // fetch("https://www.themealdb.com/api/json/v1/1/filter.php?i=")
})