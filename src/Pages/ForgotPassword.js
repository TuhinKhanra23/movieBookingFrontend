import { Card, CardBody, CardHeader, Container, Row, Col, FormGroup, Label, Input, Button, Form,FormFeedback,NavLink } from "reactstrap";
import { useState } from "react";
import Base from "../components/Base";
import { toast } from "react-toastify";
import { forgetPassword } from "../services/user-service";
import { useNavigate } from "react-router";

const Forgot = () => {
    const navigate= useNavigate()
    const [data, setData] = useState({

        loginId: '',
        newPassword: '',

    })
    const resetData = () => {
        setData({

            loginId: '',
            newPassword: '',
        })
    }
    const handleChange = (event, property) => {
        setData({ ...data, [property]: event.target.value })

    }
    const [errors, setErrors] = useState({})
    const validateForm = () => {
        let newErrors = {};


        if (!data.loginId) {
            newErrors.loginId = "LoginId is required";
        } else if (data.loginId.length < 4) {
            newErrors.loginId = "loginId should contain atleast 4 charecter!";
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
            toast.error("Please fill the form correctly !!")
            return;
        }
         //call api to send data 
         console.log(data)
         forgetPassword(data).then((resp) => {
            console.log(resp);

                navigate("/login")
           
            toast.success("Password Reset Successful!!")
            resetData();
           
        }).catch((error) => {
            console.log(error)
            console.log("error login")
            toast.warning(error.response.data.errorMsg)
        })
            ;

    }


    return (

        <Base>

            <Container className=" m-5">
                <Row>
                    <Col sm={{ size: 6, offset: 3 }}>
                        <Card className=" p-2" outline color="primary">
                            <CardHeader >
                                <h3 text-color="primary">Forget Password !! </h3>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={submitForm}>
                                    <FormGroup>
                                        <Label for="LoginId">
                                            User Id
                                        </Label>
                                        <Input
                                            id="LoginId"
                                            name="LoginId"
                                            placeholder="Please enter your Login id"
                                            type="text"
                                            onChange={(e) => handleChange(e, 'loginId')}
                                            value={data.loginId}
                                            invalid={errors.loginId}
                                        />
                                        <FormFeedback>
                                            {errors.loginId}
                                        </FormFeedback>
                                    </FormGroup>
                                    <FormGroup className="mb-0,pb-0">
                                        <Label for="NewPassword ">
                                           New Password
                                        </Label>
                                        <Input
                                            id="NewPassword"
                                            name="Newpassword"
                                            placeholder="Please enter your new password"
                                            type="password"
                                            onChange={(e) => handleChange(e, 'newPassword')}
                                            value={data.newPassword}
                                            invalid={errors.newPassword}
                                        />
                                        <FormFeedback>
                                            {errors.newPassword}
                                        </FormFeedback>
                                    </FormGroup>
                                   
                                    <Container className="text-center">
                                        <Button className="me-2 " outline color="info" type="submit"  >
                                            Submit
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
export default Forgot;