const divNavBarButtons = document.getElementById("navBarButtons");

const verifyCurrent = async () => {
    try {
        const options = {
            method: 'POST',
            headers: { "Content-Type": "application/json" }
        };
        const url = "/api/auth/current";
        let response = await fetch(url, options);
        response = await response.json();
        //En caso de que no este logueado, se muestran las opciones correspondientes:
        if (response.error) {
            divNavBarButtons.innerHTML = `
                <a class="btn btn-outline-success" href="/register">Sing Up</a>
                <a class="btn btn-outline-success" href="/login">Login</a>
            `;
            //En caso de que este logueado, muestro las siguientes opciones:
        } else {
            divNavBarButtons.innerHTML = `
                <a class="btn btn-outline-success" href="/profile">Profile</a>
                <a class="btn btn-outline-success" href="/cart">Carts</a>
                <button class="btn btn-outline-success" type="submit" id="btnSignOut">Sing Out</button>
            `
        };
        document.getElementById("btnSignOut").addEventListener("click", async () => {
            try {
                const options = {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" }
                };
                const url = "/api/auth/signout";
                await fetch(url, options);
                localStorage.removeItem("token");
                location.replace("/");
            } catch (error) {
                console.error(error);
            }
        });
    } catch (error) {
        console.error(error);
    }
};

verifyCurrent();