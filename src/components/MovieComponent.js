export const isMovieSearched = () => {
    let data = localStorage.getItem("searchData");
    if (null == data) return false;
    else return true;

}

export const fetchSearchedData = () => {
    if (isMovieSearched()) {
        return JSON.parse(localStorage.getItem("searchData"));
    }else{
        return undefined;
    }
}