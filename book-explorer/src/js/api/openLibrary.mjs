 export default async function getBookFromOpenLibrary(title) {
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log(data);
    const firstBook = data.docs[0];
    console.log(firstBook.title, firstBook.author_name);
  } catch (error) {
    console.error("Error fetching from Open Library:", error);
  }
};