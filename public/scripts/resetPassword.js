const btnResetPassword = document.getElementById("btnResetPassword");

btnResetPassword.addEventListener("click", async () => {
    try {
        const email = document.getElementById("pEmail").innerText;
        const token = document.getElementById("pToken").innerText;
        const newPassword = document.getElementById("inputNewParssword").value;
        const verifyPassword = document.getElementById("inputNewParsswordVerify").value;
        if (!newPassword || !verifyPassword) { return alert("Please fill in both password fields."); };
        if (newPassword !== verifyPassword) { return alert("Passwords do not match. Please try again."); }
        const url = `/api/users/reset/${email}/${token}`;
        const opts = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: newPassword })
        };
        const response = await fetch(url, opts);
        const result = await response.json();
        if (!response.ok) { return alert(result.message); }
        alert("Your password has been successfully reset!");
        window.location.href = "/login";
    } catch (error) {
        console.error(error);
        alert("Ooooppsss! An error has ocurred. Error: " + error.message);
    }
});