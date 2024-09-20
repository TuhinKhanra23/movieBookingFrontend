import { myAxios } from "./properties";

export const signup=(user)=>{
    return myAxios.post('/api/v1.0/moviebooking/register',user)
    .then((response)=>response.data);
};

export const login=(user)=>{
    return myAxios.get(`/api/v1.0/moviebooking/login?loginId=${user.loginId}&password=${user.password}`)
    .then((response)=>response.data);
}

export const forgetPassword=(user)=>{
    return myAxios.post(`/api/v1.0/moviebooking/forgot?loginId=${user.loginId}&newPassword=${user.newPassword}`)
    .then((response)=>response.data);
}


export const fetchTickets=(token)=>{
    return myAxios.get(`/api/v1.0/moviebooking/showBookedTickets?token=${token}`)
    .then((response)=>response.data);
}