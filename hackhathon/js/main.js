const API = "http://localhost:8000/songs";

const list = document.querySelector(".card-list");

const addForm = document.querySelector("#add-form");
const titleInp = document.querySelector("#title");
const urlInp = document.querySelector("#url");

const editForm = document.querySelector(".edit-form");
const editTitleInp = document.querySelector("#edit-title");
const editUrlInp = document.querySelector("#edit-url");
const modal = document.querySelector(".modal");
const btnSave = document.querySelector(".btn-save");
const btnExit = document.querySelector(".btn-exit");

const adminPanelBtnShow = document.querySelector(".admin-panel-btn-show");
const adminPanelBtnHide = document.querySelector(".admin-panel-btn-hide");

const search = document.querySelector("#search");

let searchVal = "";

const paginationList = document.querySelector(".pagination-list");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

const audio = new Audio("./UwU/55766-uwu-sound-effect.mp3");
const audio2 = new Audio("./UwU/nepravilno-poprobuy-esch-raz.mp3");

const limit = 3;

let currentPage = 1;

let pageTotalCount = 1;

addForm.style.visibility = "hidden";
addForm.style.position = "absolute";
adminPanelBtnHide.style.visibility = "hidden";
adminPanelBtnHide.style.position = "absolute";

adminPanelBtnShow.addEventListener("click", (e) => {
  addForm.style.visibility = "visible";
  addForm.style.position = "static";
  adminPanelBtnShow.style.visibility = "hidden";
  adminPanelBtnShow.style.position = "absolute";
  adminPanelBtnHide.style.visibility = "visible";
  adminPanelBtnHide.style.position = "static";
});

//todo Код для скрытия Admin panel
adminPanelBtnHide.addEventListener("click", (e) => {
  addForm.style.visibility = "hidden";
  addForm.style.position = "absolute";
  adminPanelBtnHide.style.visibility = "hidden";
  adminPanelBtnHide.style.position = "absolute";
  adminPanelBtnShow.style.visibility = "visible";
  adminPanelBtnShow.style.position = "static";
});
//! GET
async function getSongs() {
  const res = await fetch(
    `${API}?q=${searchVal}&_limit=${limit}&_page=${currentPage}`
  );
  const data = await res.json();
  const count = res.headers.get("x-total-count");
  pageTotalCount = Math.ceil(count / limit);
  return data;
}

//! GET ONE

async function getOneSong(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();
  return data;
}

//! DELETE

async function deleteSong(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  render();
}

//! POST

async function addSong(newSong) {
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(newSong),
    headers: {
      "Content-Type": "application/json",
    },
  });
  render();
}

//! PATCH

async function editSong(id, newData) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(newData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  render();
}

render();

//* Render
async function render() {
  const data = await getSongs();
  list.innerHTML = "";
  data.forEach((item) => {
    list.innerHTML += `
    <div class="card-border">
        <div class="card-bg">
          <div id="blur-area"></div>
          <div class="marquee">
            <div class="marquee__inner" aria-hidden="true">
              <span class="viper">8bit 8bit 8bit</span>
              <span class="viper">8bit 8bit 8bit</span>
              <span class="viper">8bit 8bit 8bit</span>
            </div>
          </div>
        </div>
        <div class="mist-container">
          <div class="mist"></div>
        </div>
        
        <strong id="text-border"
          ><a href="${item.url}" target="_blank">${item.title}</a>
        </strong>
        <div class="buttons">
          <button id="${item.id}" class="button-inner btn-edit">Edit</button>
          <button id="${item.id}" class="button-inner btn-delete">Delete</button>
        </div>
      </div>`;
  });
  renderPagination();
}

//* Add new song
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!titleInp.value.trim() || !urlInp.value.trim()) {
    alert(
      "Анекдот! \nЗаходят в бар: американец, немец и русский. \nБармен увидив это: 'Твою мать. Опять кто-то анекдот рассказывает!'",
      audio2.play()
    );
    return;
  }
  const song = {
    title: titleInp.value,
    url: urlInp.value,
  };
  addSong(song);
  titleInp.value = "";
  urlInp.value = "";
});

//* Delete song
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    deleteSong(e.target.id);
    audio.play();
  }
});

//* Edit song
let id = null;

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-edit")) {
    id = e.target.id;
    modal.style.visibility = "visible";
    const song = await getOneSong(id);
    editTitleInp.value = song.title;
    editUrlInp.value = song.url;
  }
});

//* Save edited song
btnSave.addEventListener("click", (e) => {
  e.preventDefault();
  if (!editTitleInp.value.trim() || !editUrlInp.value.trim()) {
    alert("Анекдот! \n — Дочь, ты пила? \n — Нет, мама, я топор!");
  }
  const newData = {
    title: editTitleInp.value,
    url: editUrlInp.value,
  };
  editSong(id, newData);
  modal.style.visibility = "hidden";
});

//* Close modal window
btnExit.addEventListener("click", () => {
  modal.style.visibility = "hidden";
});

search.addEventListener("input", () => {
  searchVal = search.value;
  currentPage = 1;
  render();
});

function renderPagination() {
  paginationList.innerHTML = "";
  for (let i = 1; i <= pageTotalCount; i++) {
    paginationList.innerHTML += `
    <li class="page-item ${
      i === currentPage ? "active" : ""
    }"><button class="page-link page-number">${i}</button></li>`;
  }

  if (currentPage <= 1) {
    prev.classList.add("disabled");
  } else {
    prev.classList.remove("disabled");
  }
  if (currentPage >= pageTotalCount) {
    next.classList.add("disabled");
  } else {
    next.classList.remove("disabled");
  }
}

next.addEventListener("click", () => {
  if (currentPage >= pageTotalCount) {
    return;
  }
  currentPage++;
  render();
});

prev.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }
  currentPage--;
  render();
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("page-number")) {
    currentPage = +e.target.textContent;
    render();
  }
});
