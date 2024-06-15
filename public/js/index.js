document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const cartId = productList.dataset.cartId;

    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
    addToCartButtons.forEach(button => {
        button.addEventListener("click", async (event) => {
            event.preventDefault();
            const productId = button.dataset.productId;

            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ productId, cartId })
                });

                if (response.ok) {
                    Swal.fire({
                        title: 'Product Added',
                        text: 'The product has been added to your cart',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                throw new error;
            }
        });
    });

    const finishPurchaseButtons = document.querySelectorAll('.finishPurchase');

    finishPurchaseButtons.forEach(button => {
        button.addEventListener('click', async () => {
        const cartId = button.dataset.cartId;
        try {
            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                window.location.href = `/api/carts/${cartId}/purchase`;
            } else {
                throw new Error('Error occurred while completing purchase');
            }
        } catch (error) {
            throw new Error('Error occurred while completing purchase:', error);
        }
        });
    });

    if (user.role === 'admin') {
        const addProductForm = document.getElementById("addProductForm");
        addProductForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = new FormData(addProductForm);
            const productData = Object.fromEntries(formData);

            try {
                const response = await fetch("/api/products", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(productData)
                });

                if (response.ok) {
                    Swal.fire({
                        title: 'Product Added',
                        text: 'The product has been added successfully',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'There was an error adding the product',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    throw new Error("Error adding product");
                }
            } catch (error) {
                throw new Error(error);
            }
        });

        productList.addEventListener("click", async (event) => {
            if (event.target.classList.contains("deleteButton")) {
                const productId = event.target.dataset.productId;
                try {
                    const response = await fetch(`/api/products/${productId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    if (response.ok) {
                        event.target.parentElement.remove();
                        Swal.fire({
                            title: 'Product Deleted',
                            text: 'The product has been deleted successfully',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: 'There was an error deleting the product',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                        throw new Error("Error deleting product");
                    }
                } catch (error) {
                    throw new Error(error);
                }
            }
        });
        
        productList.addEventListener("click", async (event) => {
            if (event.target.classList.contains("updateButton")) {
                const productId = event.target.dataset.productId;
                
                Swal.fire({
                    title: 'Update Product',
                    html:
                    '<form id="updateProductForm">' +
                        '<input type="hidden" id="productId" name="productId" value="' + productId + '">' +
                        '<label for="title">Title:</label>' +
                        '<input type="text" id="title" name="title" required>' +
                        '<br>' +
                        '<label for="description">Description:</label>' +
                        '<textarea id="description" name="description" rows="4" cols="50" required></textarea>' +
                        '<br>' +
                        '<label for="price">Price:</label>' +
                        '<input type="number" id="price" name="price" required>' +
                        '<br>' +
                        '<label for="thumbnail">Thumbnail:</label>' +
                        '<input type="text" id="thumbnail" name="thumbnail" required>' +
                        '<br>' +
                        '<label for="code">Product Code:</label>' +
                        '<input type="text" id="code" name="code" required>' +
                        '<br>' +
                        '<label for="stock">Stock:</label>' +
                        '<input type="number" id="stock" name="stock" required>' +
                        '<br>' +
                        '<label for="status">Status:</label>' +
                        '<select id="status" name="status" required>' +
                            '<option value="true">Available</option>' +
                            '<option value="false">Not Available</option>' +
                        '</select>' +
                        '<br>' +
                        '<label for="category">Category:</label>' +
                        '<input type="text" id="category" name="category" required>' +
                        '<br>' +
                        '<button type="button" id="updateProductBtn">Update Product</button>' +
                    '</form>',
                    showConfirmButton: false,
                    didOpen: () => {
                        const form = document.getElementById('updateProductForm');
                        const updateButton = document.getElementById('updateProductBtn');
                
                        updateButton.addEventListener('click', async function(e) {
                            const formData = new FormData(form);
                            const productId = formData.get('productId');
                            const title = formData.get('title');
                            const description = formData.get('description');
                            const price = formData.get('price');
                            const thumbnail = formData.get('thumbnail');
                            const code = formData.get('code');
                            const stock = formData.get('stock');
                            const status = formData.get('status') === 'true';
                            const category = formData.get('category');
                        
                            try {
                                const response = await fetch(`/api/products/${productId}`, {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        title,
                                        description,
                                        price,
                                        thumbnail,
                                        code,
                                        stock,
                                        status,
                                        category
                                    })
                                });
                        
                                if (response.ok) {
                                    Swal.fire({
                                        title: 'Product Updated',
                                        text: 'The product has been updated successfully',
                                        icon: 'success',
                                        confirmButtonText: 'OK'
                                    });
                                } else {
                                    Swal.fire({
                                        title: 'Error',
                                        text: 'There was an error updating the product',
                                        icon: 'error',
                                        confirmButtonText: 'OK'
                                    });
                                }
                            } catch (error) {
                                throw new Error(error);
                            }
                        });
                    }
                });
            }
        });
    }
});