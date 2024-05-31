
const addProduct = document.querySelectorAll("#button");
const productList = document.getElementById("product-list");

addProduct.forEach(myButton => {
    myButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const productId = myButton.dataset.productId;
        const cartId = productList.dataset.cartId;
        
        try {
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ productId, cartId })
            });
            
            if (response.ok) {
                console.log(`Product ${productId} added successfully to Cart ${cartId}`);
            }
        } catch (error) {
            console.error(error);
        }
    });
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
        const response = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, description, price, thumbnail, code, status, stock, category })
        });
        
        if (response.ok) {
            console.log("Product added successfully");
        } else {
            console.error("Error adding product");
        }
    } catch (error) {
        console.error(error);
    }
});

document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("deleteButton")) {
        const productId = event.target.dataset.id;

        try {
            const response = await fetch(`/api/products/${productId}`, {
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