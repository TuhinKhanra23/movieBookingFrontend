// movieService.test.js
import {
  addTheater,
  addmovie,
  gettAllMovies,
  searchMoviesByName,
  gettAllMoviesToBook,
  getTheater,
  bookSeats,
  fetchBookedTickets,
  deleteMovieById,
} from "./movieService"; // Adjust the import based on your file structure
import { myAxios } from "./properties";

jest.mock("./properties", () => ({
  myAxios: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe("Movie Service API", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test("addTheater makes a POST request and returns data", async () => {
    const theater = { name: "Theater 1" };
    const token = "some-token";
    const mockResponse = { success: true };

    myAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await addTheater(theater, token);
    expect(myAxios.post).toHaveBeenCalledWith(
      `/api/v1.0/moviebooking/addTheater?token=${token}`,
      theater
    );
    expect(result).toEqual(mockResponse);
  });

  test("addmovie makes a POST request and returns data", async () => {
    const movie = { title: "Movie 1" };
    const token = "some-token";
    const mockResponse = { success: true };

    myAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await addmovie(movie, token);
    expect(myAxios.post).toHaveBeenCalledWith(
      `/api/v1.0/moviebooking/addMovie?token=${token}`,
      movie
    );
    expect(result).toEqual(mockResponse);
  });

  test("gettAllMovies makes a GET request and returns data", async () => {
    const mockResponse = [{ title: "Movie 1" }];

    myAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await gettAllMovies();
    expect(myAxios.get).toHaveBeenCalledWith("/api/v1.0/moviebooking/all");
    expect(result).toEqual(mockResponse);
  });

  test("searchMoviesByName makes a GET request and returns data", async () => {
    const movieName = "Movie 1";
    const mockResponse = [{ title: "Movie 1" }];

    myAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await searchMoviesByName(movieName);
    expect(myAxios.get).toHaveBeenCalledWith(
      `/api/v1.0/moviebooking/movies/search?movieName=${movieName}`
    );
    expect(result).toEqual(mockResponse);
  });

  test("gettAllMoviesToBook makes a GET request and returns data", async () => {
    const mockResponse = [{ title: "Movie 1" }];

    myAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await gettAllMoviesToBook();
    expect(myAxios.get).toHaveBeenCalledWith(
      "/api/v1.0/moviebooking/allMovies"
    );
    expect(result).toEqual(mockResponse);
  });

  test("getTheater makes a GET request and returns data", async () => {
    const movieName = "Movie 1";
    const mockResponse = [{ name: "Theater 1" }];

    myAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await getTheater(movieName);
    expect(myAxios.get).toHaveBeenCalledWith(
      `/api/v1.0/moviebooking/getTheater?movieName=${movieName}`
    );
    expect(result).toEqual(mockResponse);
  });

  test("bookSeats makes a POST request and returns data", async () => {
    const bookTicketReqDTO = { seats: [1, 2] };
    const token = "some-token";
    const mockResponse = { success: true };

    myAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await bookSeats(bookTicketReqDTO, token);
    expect(myAxios.post).toHaveBeenCalledWith(
      `/api/v1.0/moviebooking/add?token=${token}`,
      bookTicketReqDTO
    );
    expect(result).toEqual(mockResponse);
  });

  test("fetchBookedTickets makes a GET request and returns data", async () => {
    const theaterName = "Theater 1";
    const mockResponse = [{ ticketId: 1 }];

    myAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await fetchBookedTickets(theaterName);
    expect(myAxios.get).toHaveBeenCalledWith(
      `/api/v1.0/moviebooking/fetchBookedTickets?theaterName=${theaterName}`
    );
    expect(result).toEqual(mockResponse);
  });

  test("deleteMovieById makes a POST request and returns data", async () => {
    const movieId = 1;
    const token = "some-token";
    const mockResponse = { success: true };

    myAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await deleteMovieById(movieId, token);
    expect(myAxios.post).toHaveBeenCalledWith(
      `/api/v1.0/moviebooking/delete?movieId=${movieId}&token=${token}`
    );
    expect(result).toEqual(mockResponse);
  });
});
