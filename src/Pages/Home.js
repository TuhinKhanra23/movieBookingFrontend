import { useEffect, useState } from "react";
import AllMovies from "../components/AllMovies";
import Base from "../components/Base";
import { SearchBar } from "../components/SearchBar";
import { gettAllMovies } from "../services/movieService";
import '../App.css';
import { fetchSearchedData, isMovieSearched } from "../components/MovieComponent";
import { Button, Card, CardBody, CardText, Col, Row } from "reactstrap";
import { searchMoviesByName } from "../services/movieService";
import '../components/SearchBar.css';
import { FaSearch } from "react-icons/fa";
import { NavLink as ReactLink } from 'react-router-dom';

const Home = () => {

    const[onLoad,setOnLoad]=useState(false)
    const [allMovies, setAllMovies] = useState(null)
    useEffect(() => {
        gettAllMovies().then((data) => {
            console.log(data);
            setAllMovies(data);
            setOnLoad(true)

        }).catch((error) => {
            console.log(error)
            console.log("error adding movie")

        });
    }, [])

    const [movieSearched, setMovieSearched] = useState(false)
    const [movieList, setMovieList] = useState({


    })

    const [movie, setMovieName] = useState({
        movieName: '',

    })
 

    const handleChange = (event, property) => {
        setMovieName({ ...movie, [property]: event.target.value })

    }
    const searchMovie = () => {

        console.log(movie)
        searchMoviesByName(movie.movieName).then((data) => {
            console.log(data);
            setMovieSearched(true)
            setOnLoad(false)
            setMovieList(data)

        }).catch((error) => {
            console.log(error)
            console.log("error searching movie")

        });

    }
  


    return (

        <Base>
            <div className="Searchbar-container">
                <div className="input-wrapper">

                    <input
                        id="movieName"
                        name="movieName"
                        placeholder="Search your movies here..."
                        onChange={(e) => handleChange(e, 'movieName')}
                        value={movie.movieName} />
                    <button onClick={() => searchMovie()}><FaSearch id="search-icon" /></button>
                </div>
            </div>


            {movieSearched && (

                movieList.map((movie) => (
                    <div className="container-fluid " key={movie.movieId}>
                        <Row>
                            <Col md={{ size: 8, offset: 1 }}>
                                <Card className="border-1 shadow-sm mt-3">

                                    <CardBody className="card-content">
                                        <h1>{movie.movieName}</h1>
                                        <CardText>Release Date : {movie.releaseDate}</CardText>
                                        <div>
                                            <Button outline color="primary"  
                                            tag={ReactLink} to="/seatBooking"
                                            >Book Now</Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                ))


            )}


            {onLoad   && (

                allMovies.map((allMovie) => (
                    <div className="container-fluid " key={allMovie.movieId}>
                        <Row>
                            <Col md={{ size: 8, offset: 1 }}>
                                <Card className="border-1 shadow-sm mt-3">

                                    <CardBody className="card-content">
                                        <h1>{allMovie.movieName}</h1>
                                        <CardText>Release Date : {allMovie.releaseDate}</CardText>
                                        <div>
                                            <Button outline color="primary"
                                              tag={ReactLink} to="/seatBooking"
                                            >Book Now</Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                ))


            )}



        </Base>


    );
};
export default Home;