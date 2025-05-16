document.getElementById("btnLogin").addEventListener("click", async () => {
    try {
        const data = {
            email: document.getElementById("inputEmailLogin").value,
            password: document.getElementById("inputPasswordLogin").value,
        };
        const opts = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        };
        const url = "/api/auth/login";
        let response = await fetch(url, opts);
        response = await response.json();
        if (response.error) {
            alert(response.error);
        } else {
            alert("Login Success!");
            location.replace("/");
        }
    } catch (error) {
        console.log(error.message);
        alert("Ooooppsss! An error has ocurred. Error: " + error.message);
    }
});