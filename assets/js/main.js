const loadMore = document.querySelector("#loadMore");
const newsContainer = document.querySelector(".news-container > .container");
const topContainer = document.querySelector(".top-container > .container");
const BASE_URL = "https://hacker-news.firebaseio.com/v0/";
const GEN_URL = "newstories.json";
const TOP_URL = "topstories.json";
const card = document.querySelector("#card");
let baseNum = 0;
let counter = 10;

//FUNZIONE PER SCARICARE TUTTI GLI ID DELLE NOTIZIE
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
          if (index < 1) {
            return item;
          }
        });
        loadNewsDetails(newsArray, topContainer);
      }
    });
}

//FUNZIONE PER SCARICARE I DETTAGLI DELLE NOTIZIE
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
          json.time,
          json.text
        );
      });
  });
}

//FUNZIONE CHE CREA LA CARD DELLA NOTIZIA
function createNews(
  container,
  idNews,
  titleNews,
  authorNews,
  linkNews,
  dateNews,
  textNews
) {
  let time = editDate(dateNews);
  const newCard = card.content.cloneNode(true).querySelector(".news-card");
  const footer = newCard.querySelector(".footer");
  newCard.setAttribute("id", `news-${idNews}`);
  if (container == topContainer) {
    newCard.querySelector("h3").innerText = `${titleNews} ⭐`;
  } else {
    newCard.querySelector("h3").innerText = titleNews;
  }
  newCard.querySelector(".author").innerText = `by: ${authorNews}`;
  const linkTag = newCard.querySelector(".link");
  if (linkNews) {
    linkTag.innerText = editLink(linkNews);
  } else if (!linkNews) {
    linkTag.innerText = "Read more ⬇️";
    const text = document.createElement("div");
    text.innerHTML = textNews;
    text.classList.toggle("hid");
    footer.append(text);
  }
  newCard.querySelector(
    ".date"
  ).innerText = `${time.day}/${time.month} - ${time.hour}:${time.minutes}`;

  newCard.addEventListener("click", () => {
    if (linkNews) {
      window.open(linkNews, "_blank", "noreferrer, noopener");
    } else {
      footer.querySelector("div").classList.toggle("hid");
    }
  });
  container.append(newCard);
}

//funzione che formatta la data
function editDate(timestamp) {
  let time = new Date(timestamp * 1000);
  let edit = (num) => (num > 9 ? num : `0${num}`);
  time.month = edit(time.getMonth() + 1);
  time.day = edit(time.getDate());
  time.hour = edit(time.getHours());
  time.minutes = edit(time.getMinutes());
  return time;
}

//funzione che accorcia il link
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

loadMore.addEventListener("click", () => {
  baseNum = counter;
  counter += 10;
  loadNewsBulk(GEN_URL);
});
