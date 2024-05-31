import ProductDto from "../dto/productDTO.js";
import Products from "../dao/factory.js";

class ProductRepository {
    constructor() {
        this.dao = Products();
    }

    async getProducts() {
        try {
            const products = await this.dao.productDAO.getProducts();
            return products.map(product => new ProductDto(product));
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const pid = new ProductDto(req.params.pid);
            const product = await this.dao.getProductById(pid);
            res.send({status: 'success', payload: new ProductDto(product)});
        } catch (error) {
            res.status(400).send({status: 'error', message: error.message});
        }
    }

    async addProducts(req, res) {
        try {
            const pid = new ProductDto(req.body);
            const product = await this.dao.addProducts(pid);
            res.send({ status: 'success', payload: new ProductDto(product) });
        } catch (error) {
            res.status(400).send({ status: 'error', message: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const pid = new ProductDto(req.params.pid);
            
            if (req.files) {
                const thumbnails = req.files.map((file) => file.filename);
                req.body.thumbnail = thumbnails;
            }
    
            const existingProduct = await this.dao.getProductById(pid);
            
            if (!existingProduct) {
                return res.status(404).send({ message: "Product not found" }); 
            }
        
            if (req.body.id && req.body.id!== pid) {
                return res.status(400).send({ message: "Product ID in body must match URL ID" });
            }

            await this.dao.updateProduct(pid, req.body);
            return res.status(200).send({ message: "Product updated successfully" });
        } catch (error) {
            res.status(500).send('Could not update product');
        }
    }

    async deleteProduct(req, res) {
        try{
            const pid = new ProductDto(req.params.pid);
            const product = await this.dao.getProductById(pid);

            if (!product) {
                res.status(404).send({ message: "Product not found" });
                return;
            }
        
            await this.dao.deleteProduct(pid);
            res.status(200).send({ message: "Product deleted successfully" });
        } catch (error) {
            res.status(500).send('Could not delete product');
        }
    }
}

export default ProductRepository;