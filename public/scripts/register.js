document.getElementById("btnRegister").addEventListener("click", async () => {
    try {
        const data = {
            first_name: document.getElementById("inputFirstNameRegister").value,
            last_name: document.getElementById("inputLastNameRegister").value,
            age: document.getElementById("inputAgeRegister").value,
            email: document.getElementById("inputEmailRegister").value,
            password: document.getElementById("inputPasswordRegister").value,
        };
        const opts = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        };
        const url = "/api/auth/register";
        let response = await fetch(url, opts);
        response = await response.json();
        if (response.error) {
            alert(response.error);
        } else {
            alert("Registered Success!");
            location.replace("/login");
        }
    } catch (error) {
        console.log(error.message);
        alert("Ooooppsss! An error has ocurred. Error: " + error.message);
    }
});
