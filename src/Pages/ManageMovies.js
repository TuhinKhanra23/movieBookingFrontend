import React, { useEffect, useState } from "react";
import Base from "../components/Base";
import { gettAllMovies, deleteMovieById } from "../services/movieService"; // Import your delete function
import "../App.css";
import { Button, Card, CardBody, CardText, Col, Row } from "reactstrap";
import { isLoggedIn, fetchCurrentUser } from "../components/loginComponents";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const ManageMovies = () => {
  const navigation = useNavigate();
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState({
    token: "",
  });
  const [onLoad, setOnLoad] = useState(false);

  useEffect(() => {
    setLogin(isLoggedIn());
    setUser(fetchCurrentUser());
  }, [login]);

  const [allMovies, setAllMovies] = useState([]);

  useEffect(() => {
    gettAllMovies()
      .then((data) => {
        console.log(data);
        setAllMovies(data);
        setOnLoad(true);
      })
      .catch((error) => {
        console.log(error);
        console.log("error fetching movies");
      });
  }, []);

  const deleteMovie = async (movieId) => {
    deleteMovieById(movieId, user.token)
      .then((resp) => {
        console.log(resp);
        toast.success("Movie Deleted Successfully!!");

        setAllMovies(allMovies.filter((movie) => movie.movieId !== movieId));
      })
      .catch((error) => {
        console.error("Error deleting movie:", error);
      });
  };

  return (
    <Base>
      {onLoad && (
        <div className="container-fluid">
          <Row>
            {allMovies.map((allMovie) => (
              <Col md={{ size: 8, offset: 1 }} key={allMovie.movieId}>
                <Card className="border-1 shadow-sm mt-3">
                  <CardBody className="card-content">
                    <h1>{allMovie.movieName}</h1>
                    <CardText>Release Date: {allMovie.releaseDate}</CardText>
                    <div>
                      <Button
                        outline
                        color="danger"
                        onClick={() => deleteMovie(allMovie.movieId)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Base>
  );
};

export default ManageMovies;
