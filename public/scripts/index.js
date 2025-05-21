window.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("/api/auth/current", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        if (!res.ok) { return } else {
            const data = await res.json();
            const currentUserRole = data.response.role;
            if (currentUserRole === "ADMIN") {
                const button = document.createElement("a");
                button.href = "/products/create";
                button.className = "btn btn-outline-success";
                button.innerText = "New Product";
                const buttonContainer = document.getElementById("indexProductAddDiv");
                if (buttonContainer) buttonContainer.appendChild(button);
            };
            if (currentUserRole === "ADMIN") {
                const cards = document.querySelectorAll(".card");
                cards.forEach(card => {
                    const cardBody = card.querySelector(".card-body");
                    const id = card.querySelector("img")?.getAttribute("alt").trim();
                    const title = card.querySelector("#productTitleId").innerText;
                    if (!id) return
                    //Boton editar:
                    const editButton = document.createElement("a");
                    editButton.href = `/products/edit/${id}`;
                    editButton.className = "btn btn-outline-primary";
                    editButton.innerText = "Edit";
                    //Boton eliminar:
                    const deleteButton = document.createElement("a");
                    deleteButton.className = "btn btn-outline-danger";
                    deleteButton.innerText = "Delete";
                    //Evento para eliminar un producto:
                    deleteButton.addEventListener("click", async () => {
                        const confirmDelete = confirm(`¿Are you sure you want to delete the product: ${title}`);
                        console.log(confirmDelete)
                        if (!confirmDelete) {
                            return;
                        } else {
                            try {
                                const opts = {
                                    method: "DELETE",
                                    headers: { "Content-Type": "application/json" }
                                };
                                const url = `/api/products/${id}`;
                                const response = await fetch(url, opts);
                                const result = await response.json();
                                if (result.error) {
                                    alert(result.error);
                                } else {
                                    alert("Product Eliminated!");
                                    location.reload();
                                }
                            } catch (error) {
                                console.log(error.message);
                                alert("An error occurred while deleting the product.");
                            }
                        }
                    });
                    // Contenedor de botones admin
                    const adminControls = document.createElement("div");
                    adminControls.className = "d-flex justify-content-center";
                    adminControls.appendChild(editButton);
                    adminControls.appendChild(deleteButton);
                    cardBody.appendChild(adminControls);
                });
            }
        }
    } catch (error) {
        console.error("Error al verificar el rol del usuario:", error);
    }
});
