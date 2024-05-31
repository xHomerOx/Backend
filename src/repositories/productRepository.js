import ProductDto from "../dto/productDTO.js";

class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getProducts() {
        try {
            const products = await this.dao.getProducts();
            return products.map(product => new ProductDto(product));
        } catch (error) {
            throw new Error(`Error fetching data: ${error.message}`);
        }
    }

    async getProductById(pid) {
        try {
            const product = await this.dao.getProductById(pid);
            return new ProductDto(product);
        } catch (error) {
            throw new Error(`Product with ID ${pid} not found`);
        }
    }
    

    async addProducts(pid) {
        try {
            const product = await this.dao.addProducts(pid);        
            return new ProductDto(product);
        } catch (error) {
             throw new Error(`Could not add this Product ${pid}`);
        }
    }

    async updateProduct(pid, productUpdate) {
        try {
            await this.dao.getProductById(pid);
            const updatedProduct = await this.dao.updateProduct(pid, productUpdate);
            return updatedProduct;
        } catch (error) {
            throw new Error(`Could not update this Product ${pid}`);
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