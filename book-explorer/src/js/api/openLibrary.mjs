export default async function getOpenLibraryData(title) {
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.docs && data.docs.length > 0) {
      const first = data.docs[0];
      const workKey = first.key;

      let rating = null;

      if (workKey) {
        const ratingsUrl = `https://openlibrary.org${workKey}/ratings.json`;
        try {
          const ratingsResponse = await fetch(ratingsUrl);
          const ratingsData = await ratingsResponse.json();
          rating = ratingsData.summary?.average || null;
        } catch (err) {
          console.warn("Rating fetch failed:", err);
        }
      }

      return {
        number_of_pages: first.number_of_pages_median || null,
        average_rating: rating
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching from Open Library:", error);
    return null;
  }
}