const socket = io();

socket.emit("message", "Client connected to Socket");

socket.on('connect', () => {
    console.log('Client connected to Socket');
});

socket.on("productAdded", (newProduct) => {
    const productList = document.getElementById("productList");
    const listItem = document.createElement("li");
    listItem.id = `${newProduct.id}`;
    listItem.innerHTML = `
      <h2>Title: ${newProduct.title}</h2>
      <p>Description: ${newProduct.description}</p>
      <p>Price: $${newProduct.price}</p>
      <p>Product Code: ${newProduct.code}</p>
      <p>Stock: ${newProduct.stock}</p>
      <p>Category: ${newProduct.category}</p>
      <p>Owner: ${newProduct.owner}</p>
      <button class="deleteButton" data-id="${newProduct.id}">Delete Product</button>
    `;
    productList.appendChild(listItem);
});

socket.on("productDeleted", (deletedProduct) => {
    const productList = document.getElementById("productList");
    const deletedListItem = document.getElementById(deletedProduct);

    if (deletedListItem) {
        productList.removeChild(deletedListItem);
    }
});

const addProductForm = document.getElementById("addProductForm");

addProductForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const code = document.getElementById("code").value;
    const status = document.getElementById("status").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;
    
    try {
        const response = await fetch("/products/realtimeproducts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, description, price, thumbnail, code, status, stock, category })
        });

        console.log(response);
        
        if (response.ok) {
            console.log("Product added successfully");
        } else {
            console.error(error);
        }
    } catch (error) {
        console.error("Error fetching:", error);
    }
});

document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("deleteButton")) {
        const productId = event.target.dataset.id;

        try {
            const response = await fetch(`/products/realtimeproducts/${productId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                console.log("Product deleted successfully");
            } else {
                console.error("Error deleting product");
            }
        } catch (error) {
            console.error(error);
        }
    }
});