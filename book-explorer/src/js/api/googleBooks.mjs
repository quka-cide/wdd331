export default async function searchBooks(query) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data.items || [];
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};
