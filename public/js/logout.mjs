const logOut = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("username")
    window.location="./auth.html"
};
export default logOut;