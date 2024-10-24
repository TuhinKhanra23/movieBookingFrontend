import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Form,
} from "reactstrap";
import React, { useState, useEffect } from "react";
import Base from "../components/Base";
import "./css/SeatBooking.css";
import {
  gettAllMovies,
  getTheater,
  bookSeats,
  fetchBookedTickets,
} from "../services/movieService";
import { fetchCurrentUser, isLoggedIn } from "../components/loginComponents";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router";

const rows = 5;
const seatsPerRow = 10;

const SeatBooking = () => {
  const navigation = useNavigate();

  const [user, setUser] = useState({ token: "",loginId:"" });
  const [seats, setSeats] = useState(
    Array(rows)
      .fill()
      .map(() => Array(seatsPerRow).fill(false))
  );
  const [bookMovie, setBookMovie] = useState({
    movieName: "",
    theaterName: "",
    seatNumber: [],
  });
  const [allMovies, setAllMovies] = useState([]);
  const [allTheater, setAllTheater] = useState([]);
  const [movieSelected, setMovieSelected] = useState(false);
  const [movieInfo, setMovieInfo] = useState({ movieInfoName: "" });
  const [theaterInfo, setTheaterInfo] = useState({ theaterInfoName: "" });
  const [selectSeat, setSelectSeat] = useState(false);
  const [bookedSeats, setBookedSeats] = useState([]);
  const navigate = useNavigate();
  const resetAllMovies = () => {
    setMovieInfo({ movieInfoName: "Please Select" });
    setTheaterInfo({ theaterInfoName: "" });

    setSelectSeat(false);
  };

  const [login, setLogin] = useState(false);

  useEffect(() => {
    setLogin(isLoggedIn());
    setUser(fetchCurrentUser());
  }, [login]);

  useEffect(() => {
    gettAllMovies()
      .then((resp) => {
        setAllMovies(resp);
      })
      .catch(console.error);
  }, []);

  const handleSeatClick = (rowIndex, seatIndex) => {
    const updatedSeats = [...seats];
    updatedSeats[rowIndex][seatIndex] = !updatedSeats[rowIndex][seatIndex];
    setSeats(updatedSeats);
  };

  const handleBookSeats = async () => {
    const bookedSeatsToReserve = [];

    seats.forEach((row, rowIndex) => {
      row.forEach((isBooked, seatIndex) => {
        if (isBooked) {
          bookedSeatsToReserve.push(
            `Row ${rowIndex + 1}-Seat ${seatIndex + 1}`
          );
        }
      });
    });

    const updatedBookMovie = {
      loginId:user.loginId,
      movieName: movieInfo.movieInfoName,
      theaterName: theaterInfo.theaterInfoName,
      seatNumber: bookedSeatsToReserve,
    };

    console.log("Updated Book Movie Before Setting State:", updatedBookMovie);

    setBookMovie(updatedBookMovie); // This line may not be necessary for the booking logic

    try {
      const response = await bookSeats(updatedBookMovie, "usertoken");
      console.log(updatedBookMovie);
      toast.success("Seats booked successfully!");
      resetAllMovies();
      setSeats(
        Array(rows)
          .fill()
          .map(() => Array(seatsPerRow).fill(false))
      );
      
    } catch (error) {
      toast.warning(error.response.data.errorMsg);
      console.error("Booking Error:", error);
    }
  };

  const fieldChange = async (event) => {
    setMovieInfo({ ...movieInfo, [event.target.name]: event.target.value });
    setMovieSelected(true);

    try {
      const resp = await getTheater(event.target.value);
      setAllTheater(resp);
      console.log(allTheater);
    } catch (error) {
      console.error(error);
    }
  };

  const theaterChange = (event) => {
    setTheaterInfo({ ...theaterInfo, [event.target.name]: event.target.value });
    fetchBookedTickets(event.target.value).then((resp) => {
      console.log(resp);
      setBookedSeats(resp);
    });
  };

  const chooseSeat = () => {
    setSelectSeat(true);
  };

  return (
    <Base>
      <Container className="m-5">
        <Row>
          <Col sm={{ size: 6, offset: 1 }}>
            <Card className="p-2" outline color="primary">
              <CardHeader>
                <h3>Book Here</h3>
              </CardHeader>
              <CardBody>
                <h4>Please Select Your Movie</h4>
                <Form>
                  <FormGroup>
                    <Label for="movieInfoName">Movie</Label>
                    <Input
                      id="movieInfoName"
                      name="movieInfoName"
                      placeholder="Please Select your Movie"
                      type="select"
                      onChange={fieldChange}
                    >
                      <option>Please Select</option>
                      {allMovies.map((movie) => (
                        <option key={movie.movieId}>{movie.movieName}</option>
                      ))}
                    </Input>
                  </FormGroup>
                  {movieSelected && (
                    <FormGroup>
                      <Label for="theaterInfoName">Theater</Label>
                      <Input
                        id="theaterInfoName"
                        name="theaterInfoName"
                        placeholder="Please Select your Theater"
                        type="select"
                        onChange={theaterChange}
                      >
                        <option>Please Select</option>
                        {allTheater.map((theater) => (
                          <option key={theater.theaterId}>
                            {theater.theaterName}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  )}
                  <Container className="text-center">
                    <Button
                      className="me-2"
                      outline
                      color="primary"
                      onClick={chooseSeat}
                    >
                      Choose Seats
                    </Button>
                  </Container>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {selectSeat && (
        <div className="theater">
          <h1>Seat Booking</h1>
          <p>
            <span style={{ color: "dark" }}>B - Booked Seats</span>
            <span style={{ color: "green" }}> A - Available Seats </span>
            <span style={{ color: "red" }}> S - Selected Seats</span>
          </p>
          <div className="seats">
            {seats.map((row, rowIndex) => (
              <div className="row" key={rowIndex}>
                {row.map((isBooked, seatIndex) => {
                  const seatPosition = `Row ${rowIndex + 1}-Seat ${
                    seatIndex + 1
                  }`;
                  const isSeatAlreadyBooked = bookedSeats.includes(
                    seatPosition.replace(",", "-")
                  );

                  return (
                    <div
                      key={seatIndex}
                      className={`seat ${
                        isBooked
                          ? "booked"
                          : isSeatAlreadyBooked
                          ? "already-booked"
                          : "available"
                      }`}
                      onClick={() =>
                        !isSeatAlreadyBooked &&
                        handleSeatClick(rowIndex, seatIndex)
                      }
                    >
                      {isSeatAlreadyBooked ? "B" : isBooked ? "S" : "A"}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <Button
            className="p-3 m-3"
            outline
            color="primary"
            onClick={handleBookSeats}
          >
            Book Seats
          </Button>
        </div>
      )}
    </Base>
  );
};

export default SeatBooking;
