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
    return myAxios.get("/all")
    .then((response)=>response.data);
}

export const searchMoviesByName=(movieName)=>{
    return myAxios.get(`/search?movieName=${movieName}`)
    .then((response)=>response.data);

}

export const gettAllMoviesToBook=()=>{
    return myAxios.get("/api/v1.0/moviebooking/allMovies")
    .then((response)=>response.data);
}

export const getTheater=(movieName)=>{
    return myAxios.get(`/getTheater?movieName=${movieName}`)
    .then((response)=>response.data);
}

export const bookSeats=(bookTicketReqDTO,token)=>{
    console.log(bookTicketReqDTO);
    return myAxios.post(`/add?token=${token}`,bookTicketReqDTO)
    .then((response)=>response.data);
}

export const fetchBookedTickets=(theaterName)=>{
    return myAxios.get(`/fetchBookedTickets?theaterName=${theaterName}`)
    .then((response)=>response.data);
}

export const deleteMovieById = (movieId,token) => {
    return myAxios.post(`/api/v1.0/moviebooking/delete?movieId=${movieId}&token=${token}`) // Adjust the endpoint as necessary
        .then(response => response.data);
};