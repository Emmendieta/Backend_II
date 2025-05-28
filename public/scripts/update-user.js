document.getElementById("btnUpdate").addEventListener("click", async () => {
    try {
        let url = "/api/auth/current";
        let opts = {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        };
        const res = await fetch(url, opts);
        let response = await res.json();
        response = response.response;
        const uid = response._id;
        const first_name = document.getElementById("inputFirstNameRegister").value.trim();
        const last_name = document.getElementById("inputLastNameRegister").value.trim();
        const age = document.getElementById("inputAgeRegister").value.trim();
        if (!first_name || first_name.length === 0 || !last_name || last_name.length === 0 || !age || !age) {
            alert("Error: Please verify data from user!");
        } else {
            const data = {
                first_name: first_name,
                last_name: last_name,
                age: age
            };
            opts = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            };
            url = `/api/users/${uid}`;
            let response = await fetch(url, opts);
            response = await response.json();
            if (response.error) {
                alert(response.error);
            }
            else {
                alert("User updated successfully");
                location.replace("/profile");
            }
        }

    } catch (error) {
        console.log(error.message);
        alert("Ooooppsss! An error has ocurred. Error: " + error.message);
    }
});