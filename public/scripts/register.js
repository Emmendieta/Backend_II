document.getElementById("btnRegister").addEventListener("click", async () => {
    try {
        const first_name = document.getElementById("inputFirstNameRegister").value;
        const last_name = document.getElementById("inputLastNameRegister").value;
        let age = document.getElementById("inputAgeRegister").value;
        const email = document.getElementById("inputEmailRegister").value;
        const password = document.getElementById("inputPasswordRegister").value;
        age = Number(age);
        const data = {
            first_name: first_name,
            last_name: last_name,
            age: age,
            email: email,
            password: password,
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
            alert("Please Verify your email to get the Code!");
            location.replace(`/verify/${email}`);
        }
    } catch (error) {
        console.log(error.message);
        alert("Ooooppsss! An error has ocurred. Error: " + error.message);
    }
});