const main = document.querySelector("main");
const newsContainer = document.querySelector(".container");
const topContainer = document.querySelector(".top-container");
const BASE_URL = "https://hacker-news.firebaseio.com/v0/";
const GEN_URL = "newstories.json";
const TOP_URL = "topstories.json";
const card = document.querySelector("#card");
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
async function loadNewsBulk(storiesURL) {
  let response = await fetch(BASE_URL + storiesURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (storiesURL === GEN_URL) {
        let newsArray = json.filter((item, index) => {
          if (index < counter && index >= baseNum) {
            return item;
          }
        });
        loadNewsDetails(newsArray, newsContainer);
      } else if (storiesURL === TOP_URL) {
        let newsArray = json.filter((item, index) => {
          if (index < 5) {
            return item;
          }
        });
        loadNewsDetails(newsArray, topContainer);
      }
      // return newsArray;
    });
}

//Funzione per scaricare i dettagli delle notizie
async function loadNewsDetails(newsArray, container) {
  newsArray.forEach((item) => {
    let response = fetch(BASE_URL + "item/" + item + ".json", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        createNews(
          container,
          json.id,
          json.title,
          json.by,
          json.url,
          json.time
        );
      });
  });
}

//Funzione che crea la card della notizia
function createNews(
  container,
  idNews,
  titleNews,
  authorNews,
  linkNews,
  dateNews
) {
  let time = editDate(dateNews);
  const newCard = card.content.cloneNode(true).querySelector(".news-card");
  newCard.setAttribute("id", `news-${idNews}`);
  newCard.querySelector("h3").innerText = titleNews;
  newCard.querySelector(".author").innerText = `by: ${authorNews}`;
  newCard.querySelector(".link").innerText = editLink(linkNews);
  newCard.querySelector(
    ".date"
  ).innerText = `${time.day}/${time.month} - ${time.hour}:${time.minutes}`;
  newCard.addEventListener("click", () => {
    window.open(linkNews, "_blank", "noreferrer, noopener");
  });
  container.append(newCard);
}

//FUNZIONE CHE FORMATTA LA DATA
function editDate(timestamp) {
  let time = new Date(timestamp * 1000);
  let edit = (num) => (num > 9 ? num : `0${num}`);
  time.month = edit(time.getMonth() + 1);
  time.day = edit(time.getDate());
  time.hour = edit(time.getHours());
  time.minutes = edit(time.getMinutes());
  return time;
}

//FUNZIONE CHE ACCORCIA IL LINK
function editLink(aLink) {
  let editedLink = aLink;
  if (editedLink.includes("http://")) {
    editedLink = editedLink.slice(7);
  } else if (editedLink.includes("https://")) {
    editedLink = editedLink.slice(8);
  }
  let slashIndex = editedLink.indexOf("/");
  editedLink = editedLink.slice(0, slashIndex);
  return editedLink;
}

//INIZIALIZZAZIONE
loadNewsBulk(GEN_URL);
loadNewsBulk(TOP_URL);

main.addEventListener("click", (e) => {
  if (e.target.id == "loadMore") {
    baseNum = counter;
    counter += 10;
    loadNewsBulk(GEN_URL);
  }
});
