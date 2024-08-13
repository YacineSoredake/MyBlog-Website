const username = document.getElementById("username");
const password = document.getElementById("password");
const signbtn = document.getElementById("sign");
const responsemsg = document.getElementById("responseMsg");

async function fetchProfile(para) {
    try {
        const response = await fetch("http://localhost:3000/profile", {
            method: 'GET',
            credentials: 'include', // Include credentials for cookies
            headers: {
              'authorization': `Bearer ${para}`
            }
          });
          if (response.ok) {
              const result = await response.json();
              const user = result.username;
              console.log(`username= ${user}`);
              localStorage.setItem("username",user)   
          }
          else {
              console.log("error in this new code")
          }
    } catch (error) {
        console.log(error.message)
    }
  }

signbtn.addEventListener("click", async (event) => {
    event.preventDefault();
    console.log(`sign btn clicked`);
    console.log(username.value);
    console.log(password.value); 

    try {
        const response = await fetch("http://localhost:3000/blog/auth", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
              },
            credentials:'include',
            body: JSON.stringify({ username:username.value, password:password.value })
        });

        const result = await response.json();
        if (response.ok) {
            responsemsg.innerHTML = result.msg;
            responsemsg.style.display='block';
            responsemsg.setAttribute("class","bg-green-600 rounded-md p-1 text-gray-50 text-xs self-center")
            username.value='';
            password.value='';
            // store tokens in localStorage 
            console.log(result);
            const {accessToken,refreshToken} = result;
            localStorage.setItem("accessToken",accessToken);   
            localStorage.setItem("refreshToken",refreshToken);   
            await fetchProfile(accessToken);
            setTimeout(() => {
                window.location="\allblogs.html"
            }, 2000);
        } else {
            responsemsg.innerHTML = result.msg;
            responsemsg.style.display='block';
            responsemsg.setAttribute("class","bg-red-600 rounded-md p-1 text-gray-50 text-xs self-center")
        }
    } catch (error) {
        responsemsg.innerText = "An error occurred.";
        console.error("Error:", error.message);
    }

})