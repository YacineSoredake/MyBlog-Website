const addButton = document.getElementById("add");
const field = document.getElementById("formField");
const title = document.getElementById("formTitle");
const description = document.getElementById("formDesc");
const date = document.getElementById("formdate");
const image = document.getElementById("image");
const responseMsg = document.getElementById("responseMsg");
const username = localStorage.getItem("username");
const profileElement = document.getElementById("conter")
let currentAccessToken = localStorage.getItem("accessToken");

async function userInformation() {
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
    const data = await response.json();
    const infos = data.information[0];
    console.log(infos);
    const {username,FullName,PreOccupation,image,matricule} = infos;
    const prof = document.getElementById("visitprf");
    prof.innerHTML = username;
    prof.setAttribute("href",`/public/views/userProfile.html`)
    const profile = document.createElement("div")
    profile.setAttribute("class","flex items-center self-start gap-3")
    profile.innerHTML = `
        <img class="h-12 w-12 rounded-full" src="../uploaded/${image}" alt="">
        <div class="p-1">
            <p id="matricule" class="hidden">${matricule}</p>
            <p id="formAuth" class="text-md text-gray-950">${FullName}</p>
            <p class="text-gray-600">${PreOccupation}</p>
        </div>
    `;
    profileElement.appendChild(profile)
    return matricule
  } else {
    const error_msg = await response.json()
    console.log(error_msg)
  }
}

await userInformation()

addButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("image", image.files[0]);
    data.append("title", title.value);
    data.append("date", date.value);
    const matricule = document.getElementById("matricule");
    data.append("author", matricule.innerHTML);
    data.append("description", description.value);
    data.append("field", field.value);

    try {
        const response = await fetch("http://localhost:3000/blog/add", {
            method: 'POST',
            body: data
        });

        const result = await response.json();
        responseMsg.innerText = result.msg;

        if (response.ok) {
            console.log("Blog added successfully:", result);
            // Clear input fields
            field.value = '';
            description.value = '';
            title.value = '';
            date.value = '';
            image.value = '';
        } else {
            console.error("Error adding blog:", result);
        }
    } catch (error) {
        responseMsg.innerText = "An error occurred while adding the blog.";
        console.error("Error:", error.message);
    }
});