const btnResetPassword = document.getElementById("btnResetPassword");

btnResetPassword.addEventListener("click", async () => {
    try {
        const email = document.getElementById("pEmail").innerText;
        let data = { email: email }
        let url = "/api/users";
        let opts = {
            method: "GET",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(data)
        };
        let user = await fetch(url, opts);
        user = await user.json();
        console.log(user);
/* 
        const newPassword = document.getElementById("inputNewParssword").value;
        const verifyNewPassword = document.getElementById("inputNewParsswordVerify").value;
        if (newPassword !== verifyNewPassword) { return alert("Error: Please verify the new Password!"); }
         */

/*         url = `/api/auth/verify/${email}/${verifyCode}`;
        let response = await fetch(url);
        response = await response.json();
        if (response.error) { alert(response.error); }
        else {
            alert("Email verified!");
            location.replace("/login");
        } */
    } catch (error) {
        console.error(error);
        alert("Ooooppsss! An error has ocurred. Error: " + error.message);
    }
});