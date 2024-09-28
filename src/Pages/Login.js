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
  NavLink,
} from "reactstrap";
import React, { useState, useEffect, useCallback } from "react";
import Base from "../components/Base";
import { toast } from "react-toastify";
import { login } from "../services/user-service";
import { isLoggedIn, setLoginInfo } from "../components/loginComponents";
import { useNavigate } from "react-router";
import { NavLink as ReactLink } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ loginId: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      toast.info("Already logged in!!");
      navigate("/");
    }
  }, [navigate]);

  const resetData = useCallback(() => {
    setData({ loginId: "", password: "" });
    setErrors({});
  }, []);

  const handleChange = useCallback(
    (event, property) => {
      setData({ ...data, [property]: event.target.value });
      // Clear specific error message on input change
      setErrors((prevErrors) => ({ ...prevErrors, [property]: "" }));
    },
    [data]
  );

  const validateForm = () => {
    let newErrors = {};
    if (!data.loginId) newErrors.loginId = "LoginId is required";
    else if (data.loginId.length < 4)
      newErrors.loginId = "loginId should contain at least 4 characters!";
    if (!data.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill the form correctly !!");
      return;
    }
    setIsSubmitting(true);
    try {
      const resp = await login(data);
      setLoginInfo(resp, () => {
        toast.success("User Logged in!!");
        navigate("/");
      });
      resetData();
    } catch (error) {
      toast.warning(error.response?.data?.errorMsg || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Base>
      <Container className="m-5">
        <Row>
          <Col sm={{ size: 6, offset: 1 }}>
            <Card className="p-2" outline color="primary">
              <CardHeader>
                <h3>Login Here</h3>
              </CardHeader>
              <CardBody>
                <Form onSubmit={submitForm}>
                  <FormGroup>
                    <Label for="LoginId">User Id</Label>
                    <Input
                      id="LoginId"
                      name="loginId"
                      placeholder="Please enter your Login id"
                      type="text"
                      onChange={(e) => handleChange(e, "loginId")}
                      value={data.loginId}
                      invalid={!!errors.loginId}
                    />
                    <FormFeedback>{errors.loginId}</FormFeedback>
                  </FormGroup>
                  <FormGroup className="mb-0 pb-0">
                    <Label for="Password">Password</Label>
                    <Input
                      id="Password"
                      name="password"
                      placeholder="Please enter your password"
                      type="password"
                      onChange={(e) => handleChange(e, "password")}
                      value={data.password}
                      invalid={!!errors.password}
                    />
                    <FormFeedback>{errors.password}</FormFeedback>
                  </FormGroup>
                  <NavLink
                    tag={ReactLink}
                    to="/forgotPass"
                    className="mt-0 pt-0 pb-4"
                  >
                    Forgot password?
                  </NavLink>
                  <Container className="text-center">
                    <Button
                      className="me-2"
                      outline
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Log in"}
                    </Button>
                    <Button type="reset" outline onClick={resetData}>
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

export default Login;
