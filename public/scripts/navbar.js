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
                <a class="btn btn-outline-success" href="/register" id="navBarBtnSingUp">Sing Up</a>
                <a class="btn btn-outline-success" href="/login" id="navBarBtnLogin">Login</a>
            `;
            //En caso de que este logueado, muestro las siguientes opciones:
        } else {
            divNavBarButtons.innerHTML = `
                <a class="btn btn-outline-success" href="/profile" id="navBarBtnpProfile">Profile</a>
                <a class="btn btn-outline-success" href="/carts" id="navBarBtnCarts">Carts</a>
                <button class="btn btn-outline-success" type="submit" id="navBarBtnSignOut">Sign Out</button>
            `
        };
        document.getElementById("navBarBtnSignOut").addEventListener("click", async () => {
            try {
                // Cerrar sesión de Google
                if (googleAuthInstance && googleAuthInstance.isSignedIn.get()) {
                    await googleAuthInstance.signOut();  // Cierra la sesión de Google
                    googleAuthInstance.disconnect();  // Desconecta la cuenta de Google
                }
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

let googleAuthInstance;

function initGoogleClient() {
    gapi.load('auth2', () => {
        googleAuthInstance = gapi.auth2.init({
            client_id: process.env.GOOGLE_ID
        });
    });
}

verifyCurrent();