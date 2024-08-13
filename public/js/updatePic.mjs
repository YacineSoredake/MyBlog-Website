const updatebtn = document.getElementById("update-btn");
const image = document.getElementById("imagePre");
const usr = document.getElementById("usrna");
const UserImg = document.getElementById("userImg")
const username = localStorage.getItem("username")
const currentusr = localStorage.getItem("pdp")
UserImg.setAttribute("src",`../uploaded/${currentusr}`)
usr.innerHTML = username


updatebtn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("change btn clicked");
    const formVont = new FormData();
    formVont.append("image",image.files[0]);
    formVont.append("username",username);
    
        try {
            const response = await fetch("http://localhost:3000/updatePic",{
            method:'post',
            body:formVont
        });
            const result = await response.json();
            if(response.ok){
                console.log(result.msg);  
            }  
            window.location="./userProfile.html"
            localStorage.removeItem("pdp")
            console.log(result.res);  
        } catch (error) {
            console.log(error.message)
        }
})

