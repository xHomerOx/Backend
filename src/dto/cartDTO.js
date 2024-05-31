class CartDto {
    constructor(cart) {
        this.id = cart.id;
        this.products = cart.map((product) => {
            return {
                id: product.product,
                quantity: product.quantity,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail
            };
        });
    }
}

export default CartDto;