// return the user data from the session storage
export const getUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    else return null;
}
export const isLoggedin = () => {
    const userStr = localStorage.getItem('user');
    if(userStr === undefined || userStr===null) {
        return false;
    } else {
        return true;
    }
}
export const getRole = () => {
    const userStr = JSON.parse(localStorage.getItem('user'));
    return userStr.roleID;
}
export const watermeter = () => {
    const userStr = JSON.parse(localStorage.getItem('user'));
    return userStr.watermeter;
}
export const controls = () => {
    const userStr = JSON.parse(localStorage.getItem('user'));
    return userStr.controls;
}
export const browserDetails = () => {
    const browserInfo = JSON.parse(localStorage.getItem('browserDetails'));
    return browserInfo;
}
export const getUserName = () => {
    const userStr = JSON.parse(localStorage.getItem('user'));
    return userStr.userName;
}
  
  // return the token from the session storage
    export const getToken = () => {
        return localStorage.getItem('token') || null;
    }
 export const headers = ()=>{
    let header_obj ={
        authorization: "Bearer "+localStorage.getItem('token')
     }  
    return header_obj;
 }
 export const updateBrowserToken = (token)=>{
    const _arr = browserDetails();
    _arr.push(token);
    localStorage.setItem('browserDetails', JSON.stringify(_arr));
    return null;
 }
  
  // remove the token and user from the session storage
  export const removeUserSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('browserDetails');
  }
  
  // set the token and user from the session storage
  export const setUserSession = (token, user, browserDetails, refreshToken ) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('browserDetails', JSON.stringify(browserDetails))
  }