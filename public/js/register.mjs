const regBtn = document.getElementById("btnReg");
const responseMsg = document.getElementById("respMsg");

regBtn.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const username = document.getElementById("usernameForm").value;
    const password = document.getElementById("passwordForm").value;
    const name = document.getElementById("nameForm").value;
    const occupation = document.getElementById("occupForm").value;

    console.log("Register button clicked");
    console.log(`Username: ${username}, Password: ${password}, Occupation: ${occupation}, Name: ${name}`);

    const data = {
        username: username,
        password: password,
        fullname: name,
        occupation: occupation
    };

    try {
        const response = await fetch("http://localhost:3000/myblog/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Result:", result);

        if (result.success) {
            responseMsg.classList.remove('hidden');
            responseMsg.classList.remove('bg-red-100', 'text-red-500');
            responseMsg.classList.add('bg-green-100', 'text-green-500');
            responseMsg.innerHTML = "Registration successful!";
            setTimeout(() => {
                window.location.href = "./auth.html";
            }, 2000); // Redirect after 2 seconds
        } else {
            responseMsg.classList.remove('hidden');
            responseMsg.classList.remove('bg-green-100', 'text-green-500');
            responseMsg.classList.add('bg-red-100', 'text-red-500');
            responseMsg.innerHTML = result.msg || "Error while registering. Please try again.";
        }
    } catch (error) {
        console.error("Error:", error);
        responseMsg.classList.remove('hidden');
        responseMsg.classList.remove('bg-green-100', 'text-green-500');
        responseMsg.classList.add('bg-red-100', 'text-red-500');
        responseMsg.innerHTML = "An error occurred. Please try again.";
    }
});
