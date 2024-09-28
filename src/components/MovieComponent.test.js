import { isMovieSearched, fetchSearchedData } from "./MovieComponent"; // adjust the import path accordingly

describe("Movie Service", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe("isMovieSearched", () => {
    it("should return false if there is no search data", () => {
      expect(isMovieSearched()).toBe(false);
    });

    it("should return true if there is search data", () => {
      localStorage.setItem(
        "searchData",
        JSON.stringify({ title: "Inception" })
      );
      expect(isMovieSearched()).toBe(true);
    });
  });

  describe("fetchSearchedData", () => {
    it("should return undefined if no movie is searched", () => {
      expect(fetchSearchedData()).toBeUndefined();
    });

    it("should return the searched data if it exists", () => {
      const searchData = { title: "Inception", year: 2010 };
      localStorage.setItem("searchData", JSON.stringify(searchData));

      expect(fetchSearchedData()).toEqual(searchData);
    });
  });
});
