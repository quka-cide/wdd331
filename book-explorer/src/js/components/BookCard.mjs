export default function BookCard(data) {
     const info = data.volumeInfo;
    const rating = info.averageRating || "Not rated";
    const ratingCount = info.ratingsCount || 0;
    const html = `<section class="card">
        <img src="${info.imageLinks.thumbnail}">
        <h2>${info.title}</h2>
        <p>${info.subtitle || ""}</p>
        <p>⭐ Rating: ${rating} (${ratingCount} reviews)</p>
        </section>
            `;
    return html;
}