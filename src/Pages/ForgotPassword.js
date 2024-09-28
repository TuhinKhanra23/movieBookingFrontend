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
import { useState, useCallback } from "react";
import Base from "../components/Base";
import { toast } from "react-toastify";
import { forgetPassword } from "../services/user-service";
import { useNavigate } from "react-router";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ loginId: "", newPassword: "" });
  const [errors, setErrors] = useState({});

  const resetData = useCallback(() => {
    setData({ loginId: "", newPassword: "" });
    setErrors({});
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear error on change
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!data.loginId) {
      newErrors.loginId = "LoginId is required";
    } else if (data.loginId.length < 4) {
      newErrors.loginId = "LoginId should contain at least 4 characters!";
    }
    if (!data.newPassword) {
      newErrors.newPassword = "Password is required";
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
    forgetPassword(data)
      .then((resp) => {
        toast.success("Password Reset Successful!");
        resetData();
        navigate("/login");
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.errorMsg || "An error occurred";
        toast.warning(errorMessage);
      });
  };

  return (
    <Base>
      <Container className="m-5">
        <Row>
          <Col sm={{ size: 6, offset: 3 }}>
            <Card className="p-2" outline color="primary">
              <CardHeader>
                <h3>Forgot Password!</h3>
              </CardHeader>
              <CardBody>
                <Form onSubmit={submitForm}>
                  <FormGroup>
                    <Label for="loginId">User Id</Label>
                    <Input
                      id="loginId"
                      name="loginId"
                      placeholder="Please enter your Login id"
                      type="text"
                      onChange={handleChange}
                      value={data.loginId}
                      invalid={!!errors.loginId}
                    />
                    <FormFeedback>{errors.loginId}</FormFeedback>
                  </FormGroup>
                  <FormGroup className="mb-0 pb-0">
                    <Label for="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      placeholder="Please enter your new password"
                      type="password"
                      onChange={handleChange}
                      value={data.newPassword}
                      invalid={!!errors.newPassword}
                    />
                    <FormFeedback>{errors.newPassword}</FormFeedback>
                  </FormGroup>

                  <Container className="text-center">
                    <Button className="me-2" outline color="info" type="submit">
                      Submit
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

export default ForgotPassword;
