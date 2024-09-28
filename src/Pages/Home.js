import { useEffect, useState } from "react";
import Base from "../components/Base";
import { gettAllMovies, searchMoviesByName } from "../services/movieService";
import { Button, Card, CardBody, CardText, Col, Row } from "reactstrap";
import { FaSearch } from "react-icons/fa";
import { NavLink as ReactLink } from "react-router-dom";
import "../App.css";
import "../components/css/SearchBar.css";

const Home = () => {
  const [onLoad, setOnLoad] = useState(false);
  const [allMovies, setAllMovies] = useState([]); // Ensure this is initialized as an empty array
  const [error, setError] = useState("");
  const [movieSearched, setMovieSearched] = useState(false);
  const [movieList, setMovieList] = useState([]);
  const [movie, setMovieName] = useState({ movieName: "" });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await gettAllMovies();
        setAllMovies(data || []); // Ensure allMovies is set to an array
        setOnLoad(true);
      } catch (error) {
        setError("Error fetching movies. Please try again.");
        console.log(error);
      }
    };
    fetchMovies();
  }, []);

  const handleChange = (event, property) => {
    setMovieName({ ...movie, [property]: event.target.value });
  };

  const searchMovie = async () => {
    try {
      const data = await searchMoviesByName(movie.movieName);
      setMovieSearched(true);
      setOnLoad(false);
      setMovieList(data || []); // Ensure movieList is set to an array
    } catch (error) {
      setError("Error searching for movie. Please try again.");
      console.log(error);
    }
  };

  const today = new Date();

  return (
    <Base>
      <div className="Searchbar-container">
        <div className="input-wrapper">
          <input
            id="movieName"
            name="movieName"
            placeholder="Search your movies here..."
            onChange={(e) => handleChange(e, "movieName")}
            value={movie.movieName}
          />
          <button onClick={searchMovie} data-testid="search-button">
            <FaSearch id="search-icon" />
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {movieSearched &&
        movieList.length > 0 &&
        movieList.map((movie) => {
          const releaseDate = new Date(movie.releaseDate);
          const isUpcoming = releaseDate > today;

          return (
            <div className="container-fluid" key={movie.movieId}>
              <Row>
                <Col md={{ size: 8, offset: 1 }}>
                  <Card className="border-1 shadow-sm mt-3">
                    <CardBody className="card-content">
                      <h1>{movie.movieName}</h1>
                      <CardText>Release Date: {movie.releaseDate}</CardText>
                      <div>
                        <Button
                          outline
                          color="primary"
                          tag={ReactLink}
                          to="/seatBooking"
                          disabled={isUpcoming}
                        >
                          {isUpcoming ? "Upcoming" : "Book Now"}
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          );
        })}

      {onLoad &&
        allMovies.length > 0 &&
        allMovies.map((allMovie) => {
          const releaseDate = new Date(allMovie.releaseDate);
          const isUpcoming = releaseDate > today;

          return (
            <div className="container-fluid" key={allMovie.movieId}>
              <Row>
                <Col md={{ size: 8, offset: 1 }}>
                  <Card className="border-1 shadow-sm mt-3">
                    <CardBody className="card-content">
                      <h1>{allMovie.movieName}</h1>
                      <CardText>Release Date: {allMovie.releaseDate}</CardText>
                      <div>
                        <Button
                          outline
                          color="primary"
                          tag={ReactLink}
                          to="/seatBooking"
                          disabled={isUpcoming}
                        >
                          {isUpcoming ? "Upcoming" : "Book Now"}
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          );
        })}
    </Base>
  );
};

export default Home;
