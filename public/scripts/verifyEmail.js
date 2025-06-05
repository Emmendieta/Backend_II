const btnVerifyEmail = document.getElementById("btnVerifyEmail");

btnVerifyEmail.addEventListener("click", async () => {
    try {
        const email = document.getElementById("pEmail").innerText;
        const verifyCode = document.getElementById("inputVerifyCode").value;
        const url = `/api/auth/verify/${email}/${verifyCode}`;
        let response = await fetch(url);
        response = await response.json();
        if (response.error) { alert(response.error); }
        else {
            alert("Email verified!");
            location.replace("/login");
        }
    } catch (error) {
        console.error(error);
        alert("Ooooppsss! An error has ocurred. Error: " + error.message);
    }
});