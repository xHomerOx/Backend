class ProductDao {
    constructor() {
      this.products = [];
    }
  
    async getProducts() {
      return this.products;
    }
  
    async getProductById(pid) {
      const product = this.products.find((product) => product.id === pid);

      if (!product) throw new Error(`Product ${pid} does not exist!`);

      return product;
    }
  
    async addProduct(product) {
      const existingProduct = this.products.find((product) => product.code === product.code);

      if (existingProduct) {
        throw new Error('Code could not be the same as existent one!');
      }

      if (!product.title ||!product.description ||!product.code ||!product.price ||!product.stock ||!product.category) {
        throw new Error('Cart could not be created!');
      }

      this.products.push(product);
      return product;
    }
  
    async updateProduct(pid, productUpdate) {
      const index = this.products.findIndex((product) => product.id === pid);

      if (index === -1) throw new Error(`Product ${pid} does not exist!`);
      
      this.products[index] = {...this.products[index],...productUpdate };
      return this.products[index];
    }
  
    async deleteProduct(pid) {
      const index = this.products.findIndex((product) => product.id === pid);

      if (index === -1) throw new Error(`Product ${pid} does not exist!`);
      
      this.products.splice(index, 1);
      return true;
    }
  }
  
  const instance = new ProductDao();
  export default instance;