import { myAxios } from "./properties";




export const addTheater=(theater,token)=>{
    return myAxios.post(`/api/v1.0/moviebooking/addTheater?token=${token}`,theater)
    .then((response)=>response.data);
};

export const addmovie=(movie,token)=>{
    return myAxios.post(`/api/v1.0/moviebooking/addMovie?token=${token}`,movie)
    .then((response)=>response.data);
}

export const gettAllMovies=()=>{
    return myAxios.get("/api/v1.0/moviebooking/all")
    .then((response)=>response.data);
}

export const searchMoviesByName=(movieName)=>{
    return myAxios.get(`/api/v1.0/moviebooking/movies/search?movieName=${movieName}`)
    .then((response)=>response.data);

}

export const gettAllMoviesToBook=()=>{
    return myAxios.get("/api/v1.0/moviebooking/allMovies")
    .then((response)=>response.data);
}

export const getTheater=(movieName)=>{
    return myAxios.get(`/api/v1.0/moviebooking/getTheater?movieName=${movieName}`)
    .then((response)=>response.data);
}

export const bookSeats=(bookTicketReqDTO,token)=>{
    console.log(bookTicketReqDTO)
    return myAxios.post(`/api/v1.0/moviebooking/add?token=${token}`,bookTicketReqDTO)
    .then((response)=>response.data);
}

export const fetchBookedTickets=(theaterName)=>{
    return myAxios.get(`/api/v1.0/moviebooking/fetchBookedTickets?theaterName=${theaterName}`)
    .then((response)=>response.data);
}