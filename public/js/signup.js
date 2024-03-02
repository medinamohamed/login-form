document.getElementById("signupForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData(event.target);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    try {
        const response = await fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formDataObject)
        });

        const responseData = await response.json();

        if (response.ok) {
            window.location.href = "/";
        } else {
            const errorMessageElement = document.getElementById("errorMessage");
            errorMessageElement.textContent = responseData.message;
            errorMessageElement.style.display = "block";
        }
    } catch (error) {
        console.error("Error:", error);
        const errorMessageElement = document.getElementById("errorMessage");
        errorMessageElement.textContent = "An error occurred. !Please try again later.";
        errorMessageElement.style.display = "block";
    }
});
