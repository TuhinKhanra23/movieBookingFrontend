import React, { useState } from "react";
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
import Base from "../components/Base";
import { signup } from "../services/user-service";
import { toast } from "react-toastify";

const Signup = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    loginId: "",
    contactNo: "",
    password: "",
  });
  const resetData = () => {
    setData({
      name: "",
      email: "",
      loginId: "",
      contactNo: "",
      password: "",
    });
  };

  const [errors, setErrors] = useState({});

  const handleChange = (event, property) => {
    setData({ ...data, [property]: event.target.value });
  };
  const isValidEmail = (email) => {
    // Regular expression for basic email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };
  const isValidPhoneNumber = (phoneNumber) => {
    // Regular expression for basic phone number validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };
  const validateForm = () => {
    let newErrors = {};

    if (!data.name) {
      newErrors.name = "Name is required";
    } else if (data.name.length < 4) {
      newErrors.name = "Name should contain atleast 4 charecter!";
    }
    if (!data.loginId) {
      newErrors.loginId = "LoginId is required";
    } else if (data.loginId.length < 4) {
      newErrors.loginId = "loginId should contain atleast 4 charecter!";
    }
    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(data.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!data.contactNo) {
      newErrors.contactNo = "Phone number is required";
    } else if (!isValidPhoneNumber(data.contactNo)) {
      newErrors.contactNo = "Phone number must be 10 digits";
    }
    if (!data.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  //submitting the form
  const submitForm = (event) => {
    event.preventDefault();
    console.log(data);
    //validate data
    if (!validateForm()) {
      toast.error("Please fill the form correctly !!");
      return;
    }
    //call api to send data
    signup(data)
      .then((resp) => {
        console.log(resp);
        console.log("success register");
        toast.success("User Registered Sucessfully !!");
        resetData();
      })
      .catch((error) => {
        console.log(error);
        console.log("error resgister");
        toast.warning(error.response.data.errorMsg);
      });
  };
  return (
    <Base>
      <Container className=" m-5">
        <Row>
          {/* {JSON.stringify(data)} */}
          <Col sm={{ size: 8, offset: 1 }}>
            <Card className=" p-2" outline color="info">
              <CardHeader className="color:info">
                <h3>Registration From</h3>
              </CardHeader>
              <CardBody>
                <Form onSubmit={submitForm}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="Name">Name</Label>
                        <Input
                          id="Name"
                          name="Name"
                          placeholder="Please enter your name"
                          type="text"
                          onChange={(e) => handleChange(e, "name")}
                          value={data.name}
                          invalid={errors.name}
                        />
                        <FormFeedback>{errors.name}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="Email">Email</Label>
                        <Input
                          id="Email"
                          name="email"
                          placeholder="Please enter your email"
                          type="email"
                          onChange={(e) => handleChange(e, "email")}
                          value={data.email}
                          invalid={errors.email}
                        />
                        <FormFeedback>{errors.email}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <Label for="loginId">Login Id</Label>
                    <Input
                      id="loginId"
                      name="loginId"
                      placeholder="Please enter your loginId"
                      type="text"
                      onChange={(e) => handleChange(e, "loginId")}
                      value={data.loginId}
                      invalid={errors.loginId}
                    />
                    <FormFeedback>{errors.loginId}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label for="contactNo">Contact No</Label>
                    <Input
                      id="contactNo"
                      name="contactNo"
                      placeholder="Please enter your contactNo"
                      type="number"
                      onChange={(e) => handleChange(e, "contactNo")}
                      value={data.contactNo}
                      invalid={errors.contactNo}
                    />
                    <FormFeedback>{errors.contactNo}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label for="Password">Password</Label>
                    <Input
                      id="Password"
                      name="password"
                      placeholder="Please enter your password"
                      type="password"
                      onChange={(e) => handleChange(e, "password")}
                      value={data.password}
                      invalid={errors.password}
                    />
                    <FormFeedback>{errors.password}</FormFeedback>
                  </FormGroup>
                  <Container>
                    <Button
                      className="me-2 "
                      outline
                      color="info"
                      type="submit"
                    >
                      Sign up
                    </Button>
                    <Button type="reset" outline onClick={() => resetData()}>
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
export default Signup;
