const name = document.getElementById("name");
const ocuppation = document.getElementById("ocupp");
const allName = document.getElementById("fulname");
const blogsContainer = document.getElementById("blogsContainer");
let currentAccessToken = localStorage.getItem("accessToken");
let currentRefreshToken = localStorage.getItem("refreshToken");
const btnAdd = document.getElementById('addBlog');
const userimg = document.getElementById('userImg');
const userna = document.getElementById('usrna');

btnAdd.addEventListener("click",(event) => {
  event.preventDefault();
  window.location="\add.html"
})

// function display finalinformation 
async function userInformation(username) {
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
    const data = await response.json()
    return data
  } else {
    const error_msg = await response.json()
    console.log(error_msg)
  }
}
// Function to fetch the profile
async function fetchProfile() {
  const response = await fetch("http://localhost:3000/profile", {
    method: 'GET',
    credentials: 'include', // Include credentials for cookies
    headers: {
      'authorization': `Bearer ${currentAccessToken}`
    }
  });

  return response;
}

// Function to display the profile
async function displayProfile() {
  try {
    let response = await fetchProfile();

    if (response.status === 401) {
      // Access token expired or unauthorized, attempt to refresh it
      const refreshResponse = await fetch("http://localhost:3000/refresh", {
        method: 'POST',
        headers: {
            'authorization': `Bearer ${currentRefreshToken}`
          }
      });

      if (refreshResponse.ok) {
        const tokens = await refreshResponse.json();
        currentAccessToken = tokens.accessToken;
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken); // Store the new access token in localStorage
        // response = await fetchProfile(); // Retry fetching the profile with the new access token
      } else {
        const errorMsg = await refreshResponse.json();
        console.log(errorMsg)
        return;
      }
    }

    if (response.ok) {
      const user = localStorage.getItem("username")
      const infos = await userInformation(user)    
      const data = infos.information[0];
      const blogss = infos.blogs
      console.log(data);
      console.log(blogss)
      blogss.forEach((blog) => {
        const { id,title , image } =blog

        const blogElement = document.createElement('div');
        blogElement.className = 'relative p-6 bg-gray-800 rounded-xl group';

        blogElement.innerHTML = `
        <div class="flex justify-center">
                    <img class="h-56 w-96 rounded-xl p-1" src="../uploaded/${image}" alt="Image">
                </div>
                <div class="flex flex-col gap-3 p-2">
                    <p class="text-xl font-bold text-gray-50">${title}</p>
                </div>
                <div class="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a href="/public/views/BlogPage.html?id=${id}" class="text-xl font-bold text-gray-50 hover:underline">View Blog</a>
                </div>
        `;
        blogsContainer.appendChild(blogElement)
      })
      const img = data["image"]
      localStorage.setItem("pdp",img)
      userimg.setAttribute("src",`../uploaded/${img}`)
      userna.innerHTML = data["username"];
      name.innerHTML = data["username"];
      allName.innerHTML = data["FullName"]
      ocuppation.innerHTML = data["PreOccupation"];

    } else {
      const errorMsg = await response.json();
      console.log(errorMsg);
    }
  } catch (error) {
    console.log(error.message)
  }
}

// Call the displayProfile function to initially load the profile
displayProfile();
