import { Card, CardBody, CardHeader, Container, Row, Col, FormGroup, Label, Input, Button, Form,FormFeedback,NavLink } from "reactstrap";
import { useState } from "react";
import Base from "../components/Base";
import { toast } from "react-toastify";
import { addmovie } from "../services/movieService";
import {  isLoggedIn,setLoginInfo,fetchCurrentUser } from '../components/loginComponents';
import { useNavigate } from "react-router";
import { useEffect } from "react";

const AddMovie=()=>{
    const [login, setLogin] = useState(false)
    const [user, setUser] = useState({
        token:'',

    })
    useEffect(() => {
        setLogin(isLoggedIn());
        setUser(fetchCurrentUser())
      
       
    }, [login])
  
   
    const [movie, setmovie] = useState({

        movieName: '',
        releaseDate: '',
        theaterIdList:'',

    })
    const resetmovie = () => {
        setmovie({

            movieName: '',
        releaseDate: '',
        theaterIdList:'',
        })
    }
    const handleChange = (event, property) => {
        setmovie({ ...movie, [property]: event.target.value })

    }
    const [errors, setErrors] = useState({})
    const validateForm = () => {
        let newErrors = {};


        if (!movie.movieName) {
            newErrors.movieName = "movie Name is required";
        } else if (movie.movieName.length < 4) {
            newErrors.movieName = "movie Name should contain atleast 4 charecter!";
        }
        if (!movie.releaseDate) {
            newErrors.releaseDate = "movie release date is required";
        }
        if(!movie.theaterIdList){
            newErrors.theaterIdList="movie theater list is required";
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
         //call api to send movie 
         console.log(movie)
        
         
         addmovie(movie,user.token).then((resp) => {
            console.log(resp);
            toast.success("movie Added Successfully!!")
            resetmovie();
           
        }).catch((error) => {
            console.log(error)
            console.log("error adding movie")
            toast.warning(error.response.data.errorMsg)
        })
            ;
        

    }

    return(
        
        <Base>

        <Container className=" m-5">
            <Row>
                <Col sm={{ size: 6, offset: 1 }}>
                    <Card className=" p-2" outline color="primary">
                        <CardHeader >
                            <h3 text-color="primary">Add movie Here</h3>
                        </CardHeader>
                        <CardBody>
                            <Form onSubmit={submitForm}>
                                <FormGroup>
                                    <Label for="movieName">
                                       movie Name
                                    </Label>
                                    <Input
                                        id="movieName"
                                        name="movieName"
                                        placeholder="Please enter new movie Name"
                                        type="text"
                                        onChange={(e) => handleChange(e, 'movieName')}
                                        value={movie.movieName}
                                        invalid={errors.movieName}
                                    />
                                    <FormFeedback>
                                        {errors.movieName}
                                    </FormFeedback>
                                </FormGroup>
                                <FormGroup className="mb-0,pb-0">
                                    <Label for="releaseDate ">
                                        movie Release Date
                                    </Label>
                                    <Input
                                        id="releaseDate"
                                        name="releaseDate"
                                        placeholder="Please enter movie release date"
                                        type="Date"
                                        onChange={(e) => handleChange(e, 'releaseDate')}
                                        value={movie.releaseDate}
                                        invalid={errors.releaseDate}
                                    />
                                    <FormFeedback>
                                        {errors.releaseDate}
                                    </FormFeedback>
                                </FormGroup>
                                <FormGroup className="mb-0,pb-0">
                                    <Label for="theaterIdList ">
                                        Theater List 
                                    </Label>
                                    <Input
                                        id="theaterIdList"
                                        name="theaterIdList"
                                        placeholder="Please enter available theater list"
                                        type="text"
                                        onChange={(e) => handleChange(e, 'theaterIdList')}
                                        value={movie.theaterIdList}
                                        invalid={errors.theaterIdList}
                                    />
                                    <FormFeedback>
                                        {errors.theaterIdList}
                                    </FormFeedback>
                                </FormGroup>
                                <Container className="text-center">
                                    <Button className="me-2 " outline color="success" type="submit"  >
                                        Add movie
                                    </Button>
                                    <Button type="reset" outline onClick={() => resetmovie()}>
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