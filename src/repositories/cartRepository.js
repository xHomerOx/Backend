import CartDto from "../dto/cartDTO.js";
import CartDao from "../dao/mongo/cartMongoDAO.js"

class CartRepository {
    constructor() {
        this.dao = CartDao.getInstance();
    }

    async getProducts(req, res) {
        try {
            const myCart = new CartDto(req.query);
            const carts = await this.dao.getCarts(myCart);
            res.send(carts);
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
    
    async getProductsFromCart(req, res) {
        try {
            const cartId = req.params.cid;
            const results = await this.dao.getProductsFromCart(cartId);

            res.send({
                status: 'success',
                payload: results
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
    
    async addCart(req, res) {
        try {
            const results = await this.dao.addCart();
            const cartDto = new CartDto(results);

            res.send({
                status: 'success',
                payload: cartDto
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
    
    async addProduct(product) {
        try {
            const newProduct = new CartDto(product);
            await this.dao.addProduct(newProduct);

            res.send("Product successfully added to cart!");
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
    
    async deleteProduct(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const results = await this.dao.deleteProduct(cartId, productId);
    
            res.send({
                status: 'success',
                payload: results
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
    
    async updateProduct(req, res) {
        try {
            const cartId = req.params.cid;
            const quantity = req.body.quantity;
            await this.dao.updateProduct(cartId, quantity);
            
            res.send({
                status: 'success',
                message: 'Cart successfully updated!'
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
    
    async updateProductById(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = req.body.quantity;
            await this.dao.updateProductById(cartId, productId, quantity);
            
            res.send({
                status: 'success',
                message: 'Cart successfully updated!'
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
    
    async deleteAllProducts(req, res) {
        try {
            const cartId = req.params.cid;
            const results = await this.dao.deleteAllProducts(cartId);
    
            res.send({
                status: 'success',
                payload: results
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
}

export default CartRepository;
