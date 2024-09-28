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
  FormFeedback,
} from "reactstrap";
import { useState, useEffect } from "react";
import Base from "../components/Base";
import { toast } from "react-toastify";
import { addmovie } from "../services/movieService";
import { isLoggedIn, fetchCurrentUser } from "../components/loginComponents";

const AddMovie = () => {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState({ token: "" });

  useEffect(() => {
    setLogin(isLoggedIn());
    setUser(fetchCurrentUser());
  }, [login]);

  const [movie, setMovie] = useState({
    movieName: "",
    releaseDate: "",
    theaterIdList: "",
  });

  const resetMovie = () => {
    setMovie({
      movieName: "",
      releaseDate: "",
      theaterIdList: "",
    });
  };

  const handleChange = (event, property) => {
    setMovie({ ...movie, [property]: event.target.value });
  };

  const [errors, setErrors] = useState({});
  const validateForm = () => {
    let newErrors = {};
    if (!movie.movieName) {
      newErrors.movieName = "movie Name is required";
    } else if (movie.movieName.length < 4) {
      newErrors.movieName = "movie Name should contain at least 4 characters!";
    }
    if (!movie.releaseDate) {
      newErrors.releaseDate = "movie release date is required";
    }
    if (!movie.theaterIdList) {
      newErrors.theaterIdList = "movie theater list is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = (event) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill the form correctly !!");
      return;
    }

    addmovie(movie, user.token)
      .then((resp) => {
        toast.success("movie Added Successfully!!");
        resetMovie();
      })
      .catch((error) => {
        toast.warning(error.response.data.errorMsg);
      });
  };

  return (
    <Base>
      <Container className="m-5">
        <Row>
          <Col sm={{ size: 6, offset: 1 }}>
            <Card className="p-2" outline color="primary">
              <CardHeader>
                <h3>Add movie Here</h3>
              </CardHeader>
              <CardBody>
                <Form onSubmit={submitForm}>
                  <FormGroup>
                    <Label for="movieName">Movie Name</Label>
                    <Input
                      id="movieName"
                      name="movieName"
                      placeholder="Please enter new movie Name"
                      type="text"
                      onChange={(e) => handleChange(e, "movieName")}
                      value={movie.movieName}
                      invalid={!!errors.movieName}
                    />
                    <FormFeedback>{errors.movieName}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label for="releaseDate">Movie Release Date</Label>
                    <Input
                      id="releaseDate"
                      name="releaseDate"
                      placeholder="Please enter movie release date"
                      type="date"
                      onChange={(e) => handleChange(e, "releaseDate")}
                      value={movie.releaseDate}
                      invalid={!!errors.releaseDate}
                    />
                    <FormFeedback>{errors.releaseDate}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label for="theaterIdList">Theater List</Label>
                    <Input
                      id="theaterIdList"
                      name="theaterIdList"
                      placeholder="Please enter available theater list"
                      type="text"
                      onChange={(e) => handleChange(e, "theaterIdList")}
                      value={movie.theaterIdList}
                      invalid={!!errors.theaterIdList}
                    />
                    <FormFeedback>{errors.theaterIdList}</FormFeedback>
                  </FormGroup>
                  <Container className="text-center">
                    <Button
                      className="me-2"
                      outline
                      color="success"
                      type="submit"
                    >
                      Add Movie
                    </Button>
                    <Button type="reset" outline onClick={resetMovie}>
                      Reset
                    </Button>
                  </Container>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Base>
  );
};

export default AddMovie;
