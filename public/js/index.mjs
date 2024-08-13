const blogContainer = document.getElementById("blogContainer");
const fieldSelected = document.getElementById("filterField");

fieldSelected.addEventListener("change", (event) => {
  event.preventDefault();
  console.log(fieldSelected.value);
  filter(fieldSelected.value);
});

async function filter(field) {
  try {
    const response = await fetch("http://localhost:3000/blog", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ field: field })
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    
    const data = await response.json();
    blogContainer.innerHTML = ''; // Clear any existing content
    console.log("Filtered data retrieved");

    data.data.forEach((item) => {
      const { id, field, author, description } = item;
      console.log(`retrieved data: ${id}, ${author}, ${description}, ${field}`);

      // Create a new div for each blog item
      const blogItem = document.createElement("div");
      blogItem.setAttribute('class', "flex flex-col items-center bg-gray-100 px-4 py-2");

      // Create and append author element
      const authorElem = document.createElement('a');
      authorElem.setAttribute('href', "./");
      authorElem.innerText = `${author}`;
      blogItem.appendChild(authorElem);

      // Create and append description element
      const descpElem = document.createElement("textarea");
      descpElem.value = description;
      descpElem.disabled = true; // Make textarea read-only
      blogItem.appendChild(descpElem);

      // Create and append field element
      const fieldElem = document.createElement("input");
      fieldElem.value = `${field}`;
      fieldElem.setAttribute('type', `text`);
      blogItem.appendChild(fieldElem);

      const idElem = document.createElement("p");
      idElem.innerText = `${id}`;
      blogItem.appendChild(idElem);

      // Create and append delete button
      const deleteElem = document.createElement("button");
      deleteElem.setAttribute('value', `${id}`);
      deleteElem.setAttribute('id', "deleteBut");
      deleteElem.setAttribute('class',"bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs")
      deleteElem.innerText = `Delete`;
      deleteElem.addEventListener("click", () => deleteBlog(id));
      blogItem.appendChild(deleteElem);

      const updateBtn = document.createElement("button");
      updateBtn.setAttribute('value', `${id}`);
      updateBtn.setAttribute('id', "UpdateBut");
      updateBtn.setAttribute('class',"bg-green-400 hover:bg-cyan-100 text-white font-bold py-1 px-3 rounded text-xs")
      updateBtn.innerText = `update`;
      updateBtn.addEventListener("click", () => updateBlog(id));
      blogItem.appendChild(updateBtn);

      // Append the blog item to the container
      blogContainer.appendChild(blogItem);
    });
  } catch (error) {
    console.error("Error fetching filtered data:", error.message);
  }
}

async function deleteBlog(id) {
  try {
    const response = await fetch(`http://localhost:3000/blog/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    console.log("blog Deleted", data);

    // Re-fetch data to update the list
    fetchData();
  } catch (error) {
    console.error("Error deleting blog:", error.message);
  }
}

async function updateBlog(id) {
  // Retrieve values for the selected blog item
  const blogItem = document.querySelector(`button[value='${id}']`).parentElement;
  const author = blogItem.querySelector('a').innerText.replace('Author: ', '');
  const description = blogItem.querySelector('textarea').value;
  const field = blogItem.querySelector('input').value;

  try {
    const response = await fetch(`http://localhost:3000/blog/update/${id}`, {
      method: 'PUT', // Use 'PUT' or 'PATCH' for updating resources
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ author: author, description: description, field: field })
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Blog Updated", data);

    // Re-fetch data to update the list
    fetchData();
  } catch (error) {
    console.error("Error updating blog:", error.message);
  }
}

async function fetchData() {
  filter(''); // Fetch all blogs initially
}

fetchData();