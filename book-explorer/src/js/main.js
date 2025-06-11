import searchBooks from "./api/googleBooks.mjs";
import getOpenLibraryData from "./api/openLibrary.mjs";
import DisplayCards from "./components/DisplayCards.mjs";

// Modal elements
const modal     = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeBtn  = modal.querySelector('.modal-close');

// Search flow
document.querySelector("#search-btn").addEventListener("click", async () => {
  const query = document.querySelector("#book-search").value.trim();
  if (!query) return alert('Enter a search term.');

  try {
    const results = await searchBooks(query);
    DisplayCards(results);
    bindDetailButtons();      // <-- bind after rendering
  } catch (e) {
    console.error(e);
  }
});

function bindDetailButtons() {
  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const volumeId = btn.dataset.id;
      const title    = decodeURIComponent(btn.dataset.title);
      openModal(volumeId, title);
    });
  });
}

async function openModal(volumeId, title) {
  modalBody.innerHTML = '<p>Loading…</p>';
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden','false');

  try {
    const res  = await fetch(`https://www.googleapis.com/books/v1/volumes/${volumeId}`);
    const book = await res.json();
    const info = book.volumeInfo;

    const isbn = info.industryIdentifiers
      ?.find(i => i.type === 'ISBN_13' || i.type === 'ISBN_10')
      ?.identifier;
    const open = isbn ? await getOpenLibraryData(isbn) : null;

    modalBody.innerHTML = `
      <h2 id="modal-title">${info.title}</h2>
      <img src="${info.imageLinks?.thumbnail||''}" alt="Cover of ${info.title}">
      <p><strong>Author:</strong> ${info.authors?.join(', ')||'Unknown'}</p>
      <p><strong>Publisher:</strong> ${info.publisher||'N/A'} (${info.publishedDate||'N/A'})</p>
      <p><strong>Description:</strong> ${info.description||'No description.'}</p>
      <p><strong>Rating:</strong> ${info.averageRating||open?.average_rating||'Not rated'}</p>
      <p><strong>Pages:</strong> ${open?.number_of_pages||'Unknown'}</p>
    `;
  } catch(err) {
    modalBody.innerHTML = '<p>Error loading details.</p>';
    console.error(err);
  }
}

// Close behavior
closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden','true');
});
