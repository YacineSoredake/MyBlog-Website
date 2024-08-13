const container = document.getElementById("blogContainer");
const username = localStorage.getItem("username");
const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click",() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("pdp");
    console.log("loggin out the user")
    setTimeout(() => {
        window.location="./auth.html"
    }, 1000);
})

async function getInfosUser() {
    const currentAccessToken = localStorage.getItem("accesToken")
    const response = await fetch("http://localhost:3000/user/information", {
    method: 'post',
    credentials: 'include', // Include credentials for cookies
    headers: {
      'authorization': `Bearer ${currentAccessToken}`,
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({ username: username })
  });
  if (response.ok) {
    const profile = document.getElementById("visitprf");
    const result = await response.json();
    console.log(result);
    const data = result.information[0];
    const {username} = data;
    profile.innerHTML = username;
    profile.setAttribute("href",`/public/views/userProfile.html`)
  } else {
    console.log("walou")
  }
}

async function getUser() {
    if(username){
        await getInfosUser()
    } else {
        const profile = document.getElementById("visitprf");
        profile.innerHTML = "sign In";
        profile.setAttribute("href","./auth.html")
    }
}
await getUser()
async function display() {
    try {
        const response = await fetch("http://localhost:3000/blog", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data)
        if (response.ok) {
            data.data.forEach((blog) => {
                
                const { fullName, preOccupation, title, description, field, date, image ,pdp} = blog;
                
                // Create a new blog element
                const blogElement = document.createElement('div');
                blogElement.className = 'flex flex-col gap-3';

                // Format the date
                const dateE = new Date(`${date}`);
                const options = { year: 'numeric', month: 'long', day: '2-digit' };
                const formattedDate = dateE.toLocaleDateString('en-US', options);

                // Set the blog content
                blogElement.innerHTML = `
                    <div class="flex justify-center p-3">
                         <img class="h-56 w-96 rounded-xl" src="../uploaded/${image}" alt="kkkk">
                    </div>
                    <div class="flex flex-col gap-3">
                        <div class="flex justify-start gap-5 items-center">
                            <p class="text-xs px-1">${formattedDate}</p>
                            <p class="text-xs bg-gray-50 text-gray-700 p-1 rounded-xl hover:bg-gray-200">${field}</p>
                        </div>
                        <p class="text-xl font-bold text-gray-700">${title}</p>
                        <textarea class="p-2" rows="3" name="" disabled>${description}</textarea>
                    </div>
                    <div class="bg-gray-50 p-1 rounded-md flex items-center self-start gap-3">
                        <img class="h-12 w-12 rounded-full" src="../uploaded/${pdp}" alt="">
                        <div class="p-1">
                            <p class="text-md text-gray-950">${fullName}</p>
                            <p class="text-gray-600">${preOccupation}</p>
                        </div>
                    </div>
                `;

                // Append the blog element to the container
                container.appendChild(blogElement);
            });
        } else {
            console.error("Error retrieving blogs:", data);
        }
    } catch (error) {
        console.log("Error:", error);
    }
}

display();
