document.addEventListener("DOMContentLoaded", () => {
  async function fetchBlog() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    try {
      const response = await fetch(`http://localhost:3000/blog/${id}`,{
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
          },
      });
      if(response.ok){
        const data = await response.json();
        const result = data.data[0];
        console.log(result);
        const {id,username, image, field, title, description, date, pdp, fullName, preOccupation} = result;
        const prof = document.getElementById("visitprf");
        prof.innerHTML = username;
        prof.setAttribute("href",`/public/views/userProfile.html`)
        const dateE = new Date(`${date}`);
        const options = { year: 'numeric', month: 'long', day: '2-digit' };
        const formattedDate = dateE.toLocaleDateString('en-US', options);
        const sec = document.getElementById('sectioon');
        sec.innerHTML = `
        <div class="flex justify-center">
          <img class="h-56 w-96 rounded-xl" id="imagePreview" src="../uploaded/${image}" alt="kkkk">
          <input type="file" name="image" id="image" accept="image/*" class="hidden-input">
        </div>
        <div class="flex flex-col">
        <div class="flex flex-col gap-4 mb-6">
          <div class="flex justify-start gap-5 items-center">
            <p class="text-xs px-1">${formattedDate}</p>
            <input 
              id="field" 
              class="text-xs bg-gray-50 text-gray-700 p-1 rounded-xl hover:bg-gray-200" 
              value="${field}" 
            />
          </div>
          <div class="flex items-center self-center gap-3 mb-6 shadow p-2 rounded">
          <img class="h-12 w-12 rounded-full" src="../uploaded/${pdp}" alt="">
          <div class="p-1">
            <p class="text-md text-gray-950">${fullName}</p>
            <p class="text-gray-600">${preOccupation}</p>
          </div>
        </div>
          <input 
            id="title" 
            class="border text-md font-medium text-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"" 
            value="${title}" 
          />
          <textarea 
            class="p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
            rows="3" 
            id="description"
          >${description}</textarea>
        </div>
        <div class="flex justify-center gap-3">
          <button 
            id="updateBtn" 
            class="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            Update
          </button>
          <button 
            id="deletBTn" 
            class="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            Delete
          </button>
          </div>
        </div>
      `;
      
        const deleteBtn = document.getElementById("deletBTn");
        
        deleteBtn.addEventListener("click", async () => deleteBlog(`${id}`));
        const updtbtn = document.getElementById("updateBtn");
        
        updtbtn.addEventListener("click", async () => updateBlog(`${id}`));
      }
      else {
        const data = await response.json();
        console.log(data.msg);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async function deleteBlog(id) {
    try {
      const response = await fetch(`http://localhost:3000/blog/delete/${id}`,{
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
          },
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Blog Deleted", data.msg);
       const rmsg = document.getElementById("responseMsg");
       rmsg.innerHTML = data.msg;
  
    } catch (error) {
      console.log(error.message);
    }
  }
  async function updateBlog(id){
    const field = document.getElementById("field").value;
    const description = document.getElementById("description").value;
    const title = document.getElementById('title').value;
    
  try {
    const response = await fetch(`http://localhost:3000/blog/update/${id}`, {
      method: 'PUT', // Use 'PUT' or 'PATCH' for updating resources
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: title, description: description, field: field })
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Blog Updated", data.msg);
    const rmsg = document.getElementById("responseMsg");
    rmsg.innerHTML = data.msg;

    await fetchBlog();
  } catch (error) {
    console.error("Error updating blog:", error.message);
  }
  }

  fetchBlog();
});
