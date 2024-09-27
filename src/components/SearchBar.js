import React from "react";
import { useEffect,useState } from "react";

import { FaSearch } from "react-icons/fa";
import {  isLoggedIn,fetchCurrentUser } from '../components/loginComponents';
import { searchMoviesByName } from "../services/movieService";
import './css/SearchBar.css';

export const SearchBar=()=>{
    const [movieSearched, setMovieSearched] = useState(true)
    useEffect(() => {
         localStorage.removeItem("searchData")

    }, [movieSearched])

    const [movie, setMovieName] = useState({
        movieName:'',

    })
    const resetmovieName = () => {
        setMovieName({

            movieName: '',
       
        })
    }

    const handleChange = (event, property) => {
        setMovieName({ ...movie, [property]: event.target.value })

    }
   const searchMovie=()=>{
   
    console.log(movie)
    searchMoviesByName(movie.movieName).then((data)=>{
        console.log(data);
        setMovieSearched(false)
        localStorage.setItem("searchData",JSON.stringify(data))
    }).catch((error) => {
        console.log(error)
        console.log("error searching movie")
       
    });
        
   }

    return(
        <div className="input-wrapper">
            
            <input
             id="movieName"
             name="movieName"
            placeholder="Search your movies here..."
            onChange={(e) => handleChange(e, 'movieName')}
            value={movie.movieName}/>
            <button onClick={() => searchMovie()}><FaSearch id="search-icon" /></button>
        </div>
    )
}