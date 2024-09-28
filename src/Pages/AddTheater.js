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
import React, { useState, useEffect } from "react";
import Base from "../components/Base";
import { toast } from "react-toastify";
import { addTheater } from "../services/movieService";
import { isLoggedIn, fetchCurrentUser } from "../components/loginComponents";

const AddTheater = () => {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState({ token: "" });

  useEffect(() => {
    setLogin(isLoggedIn());
    setUser(fetchCurrentUser());
  }, [login]);

  const [theater, setTheater] = useState({
    theaterName: "",
    theaterLoc: "",
    theaterCapacity: "",
  });

  const resetTheater = () => {
    setTheater({ theaterName: "", theaterLoc: "", theaterCapacity: "" });
  };

  const handleChange = (event, property) => {
    setTheater({ ...theater, [property]: event.target.value });
  };

  const [errors, setErrors] = useState({});
  const validateForm = () => {
    let newErrors = {};

    if (!theater.theaterName) {
      newErrors.theaterName = "Theater Name is required";
    } else if (theater.theaterName.length < 4) {
      newErrors.theaterName =
        "Theater Name should contain at least 4 characters!";
    }
    if (!theater.theaterLoc) {
      newErrors.theaterLoc = "Theater Location is required";
    } else if (theater.theaterLoc.length < 4) {
      newErrors.theaterLoc =
        "Theater Location should contain at least 4 characters!";
    }
    if (!theater.theaterCapacity) {
      newErrors.theaterCapacity = "Theater Capacity is required";
    } else if (theater.theaterCapacity > 100) {
      newErrors.theaterCapacity = "Theater Capacity cannot exceed 100 seats!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = (event) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill the form correctly!");
      return;
    }

    addTheater(theater, user.token)
      .then((resp) => {
        toast.success("Theater Added Successfully!");
        resetTheater();
      })
      .catch((error) => {
        const errorMsg =
          error.response?.data?.errorMsg || "Error adding theater";
        toast.warning(errorMsg);
      });
  };

  return (
    <Base>
      <Container className="m-5">
        <Row>
          <Col sm={{ size: 6, offset: 1 }}>
            <Card className="p-2" outline color="primary">
              <CardHeader>
                <h3>Add Theater Here</h3>
              </CardHeader>
              <CardBody>
                <Form onSubmit={submitForm}>
                  <FormGroup>
                    <Label for="theaterName">Theater Name</Label>
                    <Input
                      id="theaterName"
                      name="theaterName"
                      placeholder="Please enter new Theater Name"
                      type="text"
                      onChange={(e) => handleChange(e, "theaterName")}
                      value={theater.theaterName}
                      invalid={!!errors.theaterName}
                    />
                    <FormFeedback>{errors.theaterName}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label for="theaterLoc">Theater Location</Label>
                    <Input
                      id="theaterLoc"
                      name="theaterLoc"
                      placeholder="Please enter Theater Location"
                      type="text"
                      onChange={(e) => handleChange(e, "theaterLoc")}
                      value={theater.theaterLoc}
                      invalid={!!errors.theaterLoc}
                    />
                    <FormFeedback>{errors.theaterLoc}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label for="theaterCapacity">Theater Capacity</Label>
                    <Input
                      id="theaterCapacity"
                      name="theaterCapacity"
                      placeholder="Please enter Theater Capacity"
                      type="number"
                      onChange={(e) => handleChange(e, "theaterCapacity")}
                      value={theater.theaterCapacity}
                      invalid={!!errors.theaterCapacity}
                    />
                    <FormFeedback>{errors.theaterCapacity}</FormFeedback>
                  </FormGroup>
                  <Container className="text-center">
                    <Button
                      className="me-2"
                      outline
                      color="success"
                      type="submit"
                    >
                      Add Theater
                    </Button>
                    <Button type="reset" outline onClick={() => resetTheater()}>
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

export default AddTheater;
