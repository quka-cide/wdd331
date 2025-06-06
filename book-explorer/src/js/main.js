import searchBooks from "./api/googleBooks.mjs";
import getBookFromOpenLibrary from "./api/openLibrary.mjs";
import DisplayCards from "./components/DisplayCards.mjs";

document.querySelector("#search-btn").addEventListener("click", async () => {
  const input = document.querySelector("#book-search").value.trim();

  try {
    const results = await searchBooks(input);
    DisplayCards(results);
  } catch (error) {
    console.error("Failed to fetch books:", error);
  }
});