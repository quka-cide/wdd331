export default function BookCard(data, inMyList = false) {
  const info = data.volumeInfo;
  const bookId = data.id;
  const thumb = info.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192';
  const title = info.title || 'Untitled';

  return `
    <section class="card">
      <img src="${thumb}" alt="Cover: ${title}">
      <h2>${title}</h2>
      <p>${info.subtitle || ""}</p>
      <button 
        class="open-modal-btn" 
        data-id="${bookId}" 
        data-title="${encodeURIComponent(title)}">
        Details
      </button>
      <button 
        class="${inMyList ? 'remove-from-list-btn' : 'add-to-list-btn'}" 
        data-book='${JSON.stringify(data)}'>
        ${inMyList ? 'Remove from My List' : 'Add to My List'}
      </button>
    </section>
  `;
}