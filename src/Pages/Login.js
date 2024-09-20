import { Card, CardBody, CardHeader, Container, Row, Col, FormGroup, Label, Input, Button, Form,FormFeedback,NavLink } from "reactstrap";
import { useState } from "react";
import Base from "../components/Base";
import { toast } from "react-toastify";
import { login } from "../services/user-service";
import {  isLoggedIn,setLoginInfo } from '../components/loginComponents';
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { NavLink as ReactLink } from 'react-router-dom';




const Login = () => {

    const navigate= useNavigate()
    const [data, setData] = useState({

        loginId: '',
        password: '',

    })
    const resetData = () => {
        setData({

            loginId: '',
            password: '',
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
        if (!data.password) {
            newErrors.password = "Password is required";
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
         login(data).then((resp) => {
            console.log(resp);
            setLoginInfo(resp,()=>{
                console.log("data stored in localstorage");
                navigate("/")
            })
            toast.success("User Logged in!!")
            resetData();
           
        }).catch((error) => {
            console.log(error)
            console.log("error login")
            toast.warning(error.response.data.errorMsg)
        })
            ;

    }

 
  const [isLogin, setIsLogin] = useState(false)
 

  useEffect(() => {
    setIsLogin(isLoggedIn());
    

  }, [isLogin])

  if(isLogin){
    toast.info("Already logged in!!")
    navigate("/")
  }

    return (
        <Base>

            <Container className=" m-5">
                <Row>
                    <Col sm={{ size: 6, offset: 1 }}>
                        <Card className=" p-2" outline color="primary">
                            <CardHeader >
                                <h3 text-color="primary">Login Here</h3>
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
                                        <Label for="Password ">
                                            Password
                                        </Label>
                                        <Input
                                            id="Password"
                                            name="password"
                                            placeholder="Please enter your password"
                                            type="password"
                                            onChange={(e) => handleChange(e, 'password')}
                                            value={data.password}
                                            invalid={errors.password}
                                        />
                                        <FormFeedback>
                                            {errors.password}
                                        </FormFeedback>
                                    </FormGroup>
                                    <NavLink tag={ReactLink} to="/forgotPass" className="mt-0 pt-0 pb-4">
                                           forgot password!
                                        </NavLink>
                                    <Container className="text-center">
                                        <Button className="me-2 " outline color="primary" type="submit"  >
                                            Log in
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
export default Login;