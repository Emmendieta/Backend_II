const btnNewProduct = document.getElementById("btnCreateProduct");

btnNewProduct.addEventListener("click", async () => {
    try {
        const id = document.getElementById("productId")?.value;
        const image = document.getElementById("newProductUlLiImage").value;
        const title = document.getElementById("newProductUlLihTitle").value;
        let price = document.getElementById("newProductUlLihPrice").value;
        const code = document.getElementById("newProductUlLihCode").value;
        let stock = document.getElementById("newProductUlLihStock").value;
        const category = document.getElementById("newProductUlLihCategory").value;
        let statusProduct = document.getElementById("newProductUlLihStatus").checked;
        const description = document.getElementById("newProductUlLihDescription").value;
        if (!image || !title || !price || !code || !stock || !category || !description) {
            alert("All values are needed!");
        } else {
            price = Number(price);
            stock = Number(stock);
            if (!document.getElementById("newProductUlLihStatus").checked) { statusProduct = false; }
            if (isNaN(price) || isNaN(stock) || price < 0 || stock < 0) {
                alert("The prices or the stock has to be a positive number!!!");
            } else {
                const data = {
                    title: title,
                    description: description,
                    code: code,
                    price: price,
                    status: statusProduct,
                    stock: stock,
                    category: category,
                    image: image
                };
                console.log(data)
                const opts = {
                    method: id ? "PUT": "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                };
                const url = id ? `/api/products/${id}` : "/api/products/";
                let response = await fetch(url, opts);
                response = await response.json();
                if (response.error) {
                    alert(response.error);
                } else {
                    alert( id ? "Product Updated!" : "Product created!");
                    location.replace("/");
                }
            }
        }
    } catch (error) {
        console.log(error.message);
        alert("Ooooppsss! An error has ocurred. Error: " + error.message);
    }
});