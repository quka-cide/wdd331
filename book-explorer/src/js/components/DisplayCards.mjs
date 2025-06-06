import BookCard from "./BookCard.mjs";

export default function DisplayCards(results) {
  const resultsEl = document.querySelector(".results");
  resultsEl.innerHTML = "";

  if (!Array.isArray(results) || results.length === 0) {
    resultsEl.innerHTML = "<p>No books found. Try another search.</p>";
    return;
  }

  results.forEach((book) => {
    resultsEl.innerHTML += BookCard(book);
  });
}