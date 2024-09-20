

// check if user is logged in
export const isLoggedIn = () => {
    let data = localStorage.getItem("loginData");
    if (null == data) return false;
    else return true;

}

//Set data in localStorage after successful login
export const setLoginInfo = (data,next) => {
    localStorage.setItem("loginData", JSON.stringify(data));
    next();
}

//Logout user
export const doLogout = (next) => {
    localStorage.removeItem("loginData");
    next();
}

//return current active user
export const fetchCurrentUser = () => {
    if (isLoggedIn()) {
        return JSON.parse(localStorage.getItem("loginData"));
    }else{
        return undefined;
    }
}