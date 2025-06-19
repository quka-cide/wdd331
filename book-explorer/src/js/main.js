import searchBooks from "./api/googleBooks.mjs";
import getOpenLibraryData from "./api/openLibrary.mjs";
import DisplayCards from "./components/DisplayCards.mjs";

const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeBtn  = modal.querySelector('.modal-close');

document.querySelector("#search-btn").addEventListener("click", async () => {
  const query = document.querySelector("#book-search").value.trim();
  if (!query) return alert('Enter a search term.');

  try {
    const results = await searchBooks(query);
    DisplayCards(results);
    bindCardButtons();
    document.querySelector("#heading").textContent = "Search Results:"
  } catch (e) {
    console.error(e);
  }
});

function bindCardButtons() {
  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const volumeId = btn.dataset.id;
      const title = decodeURIComponent(btn.dataset.title);
      openModal(volumeId, title);
    });
  });

  document.querySelectorAll('.add-to-list-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const book = JSON.parse(btn.dataset.book);
      addToMyList(book);
    });
  });

   document.querySelectorAll('.remove-from-list-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const book = JSON.parse(btn.dataset.book);
      removeFromMyList(book.id);
    });
  });
}

function removeFromMyList(bookId) {
  const key = "myBookList";
  const stored = localStorage.getItem(key);
  let list = stored ? JSON.parse(stored) : [];

  list = list.filter(item => item.id !== bookId);
  localStorage.setItem(key, JSON.stringify(list));

  DisplayCards(list, true);
  bindCardButtons();
}

async function openModal(volumeId) {
  modalBody.innerHTML = '<p>Loading…</p>';
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden','false');

  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${volumeId}`);
    const book = await res.json();
    const info = book.volumeInfo;

    const open = await getOpenLibraryData(info.title);

    modalBody.innerHTML = `
      <h2 id="modal-title">${info.title}</h2>
      <img src="${info.imageLinks?.thumbnail||''}" alt="Cover of ${info.title}">
      <p><strong>Author:</strong> ${info.authors?.join(', ')||'Unknown'}</p>
      <p><strong>Publisher:</strong> ${info.publisher||'N/A'} (${info.publishedDate||'N/A'})</p>
      <p><strong>Description:</strong> ${info.description||'No description.'}</p>
      <p><strong>Rating:</strong> ${info.averageRating ?? open?.average_rating ?? 'Not rated'}</p>
      <p><strong>Pages:</strong> ${info.pageCount ?? open?.number_of_pages ?? 'Unknown'}</p>
    `;
  } catch(err) {
    modalBody.innerHTML = '<p>Error loading details.</p>';
    console.error(err);
  }
}

closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden','true');
});

const categories = ["History", "Psychology", "Science", "Fiction", "Mystery", "Romance", "Philosophy"];
const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach(btn => {
  btn.addEventListener("click", async () => {
    let category = btn.dataset.category;
    if(category === "random") {
      category = categories[Math.floor(Math.random() * categories.length)];
    }

    document.querySelector("#book-search").value = category;

    try {
      const results = await searchBooks(`subject:${category}`);
      DisplayCards(results);
      bindCardButtons();
      document.querySelector("#heading").textContent = "Search Results:"
    } catch(err) {
      console.error(err);
    }
  });
});

function addToMyList(book) {
  const key = "myBookList";
  const stored = localStorage.getItem(key);
  const list = stored ? JSON.parse(stored) : [];

  if (!list.some(item => item.id === book.id)) {
    list.push(book);
    localStorage.setItem(key, JSON.stringify(list));
    alert(`Added "${book.volumeInfo.title}" to your list!`);
  } else {
    alert(`"${book.volumeInfo.title}" is already in your list.`);
  }
}

document.querySelector("#view-my-list-btn").addEventListener("click", () => {
  const stored = localStorage.getItem("myBookList");
  const list = stored ? JSON.parse(stored) : [];

  if (list.length === 0) {
    alert("Your list is empty.");
  } else {
    DisplayCards(list, true);
    bindCardButtons();
    document.querySelector("#heading").textContent = "Your List:"
  }
});

document.querySelector("#clear-list-btn").addEventListener("click", () => {
  localStorage.removeItem("myBookList");
  alert("Your list has been cleared.");
});