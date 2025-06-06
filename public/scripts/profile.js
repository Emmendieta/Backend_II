const btnResetPassword = document.getElementById("btnResetPassword");

btnResetPassword.addEventListener("click", async() => {
    try {
        let email = document.getElementById("userEmail").innerText;
        let url = `/api/users/email/${email}/reset`;
        let opts = {
            method: "GET",
        };
        let response = await fetch(url, opts);
        response = await response.json();
        if(response.error) { alert(error.message); }
        else { alert("Verify your email to reset your password!"); }
    } catch (error) {
        throw error;
    }
});