const main = document.querySelector("main");
const mainContainer = document.querySelector(".main-container");
const BASE_URL = "https://hacker-news.firebaseio.com/v0/";
const GEN_URL = "newstories.json";
let baseNum = 0;
let counter = 10;

//Funzione peer creare un elemento generico
function createElement(
  eTag,
  eParent,
  eId,
  eContent,
  eClass,
  eAttribute,
  attributeValue
) {
  const element = document.createElement(eTag);
  if (eContent) {
    element.innerHTML = eContent;
  }
  if (eClass) {
    element.classList.add(eClass);
  }
  if (eId) {
    element.setAttribute("id", eId);
  } else {
    element.setAttribute("id", eTag);
  }
  if (eAttribute) {
    element.setAttribute(eAttribute, attributeValue);
  }
  if (eParent === "body") {
    document.body.append(element);
  } else {
    eParent.append(element);
  }
}

//Funzione per scaricare tutti gli id delle notizie
async function loadNewsBulk() {
  let response = await fetch(BASE_URL + GEN_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      let newsArray = json.filter((item, index) => {
        if (index < counter && index > baseNum) {
          return item;
        }
      });
      loadNewsDetails(newsArray);
      return newsArray;
    });
}

//Funzione per scaricare i dettagli delle notizie
async function loadNewsDetails(newsArray) {
  newsArray.forEach((item) => {
    let response = fetch(BASE_URL + "item/" + item + ".json", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        createNews(json.id, json.title, json.by, json.url, json.time);
      });
  });
}

//Funzione che crea la card della notizia
function createNews(idNews, titleNews, authorNews, linkNews, dateNews) {
  let time = new Date(dateNews * 1000);
  const newsCard = document.createElement("div");
  newsCard.setAttribute("id", `news-${idNews}`);
  newsCard.classList.add("news-card");
  mainContainer.append(newsCard);
  const title = createElement("h3", newsCard, `title-${idNews}`, titleNews);
  const author = createElement(
    "p",
    newsCard,
    `author-${idNews}`,
    `by: ${authorNews}`,
    "author"
  );
  const link = createElement(
    "a",
    newsCard,
    `url-${idNews}`,
    `${linkNews.substr(0, 50)}...`,
    "linkNews",
    "href",
    linkNews
  );
  const date = createElement(
    "p",
    newsCard,
    `date-${idNews}`,
    `${time.getHours()}:${time.getMinutes()}`,
    "date"
  );
}
//inizializzazione
loadNewsBulk();

main.addEventListener("click", (e) => {
  console.log(e.target);
  if (e.target.id == "loadMore") {
    baseNum = counter;
    counter += 10;
    loadNewsBulk();
  }
});
