import fs from 'fs';

class ProductManager {
	constructor (path) {
        this.path = path;
    };

    addProducts = async (myProduct) => { 
        let myFile = await fs.promises.readFile(`${this.path}/products.json`, 'utf8');
        this.products = JSON.parse(myFile);

        const { title, description, price, status, code, thumbnail, stock, category } = myProduct;
        const duplicatedCode = this.products.some((product) => product.code === code);
        
        if (title && description && price && code && stock && status && category) {
            if (!duplicatedCode) {
                let id = this.products.length + 1;

                this.products.push({id, title, description, price, status: true, thumbnail: thumbnail ?? [], code, status, stock, category});
                await fs.promises.writeFile(`${this.path}/products.json`, JSON.stringify(this.products, null, '\t'));
                return this.products;
            }else{
                console.log("El código no puede estar repetido");
            }
        }else{
            console.log("Todos los campos son obligatorios");
        }
    };

    getProducts = async (limit) => {
        try {
            let myFile = await fs.promises.readFile(`${this.path}/products.json`, 'utf8');
            let products = JSON.parse(myFile);

            if (limit) products = products.slice(0, limit);
            return products;
        } catch (error) {
            throw error;
        }    
    }

    getProductById = async (myId) => {
        try {
            let myFile = await fs.promises.readFile(`${this.path}/products.json`, 'utf8');
            let products = JSON.parse(myFile);

            const myProduct = products.find((product) => product.id === myId);

            if (myProduct) {
                return myProduct;
            }else{
                return (`Product with ID ${myId} Not Found`);
            }
        } catch(error) {
            throw error;
        }
    }

    updateProduct = async (myId, myProduct) => {
        try {
            let myFile = await fs.promises.readFile(`${this.path}/products.json`, 'utf8');
            this.products = JSON.parse(myFile);
            
            const index = this.products.findIndex((product) => product.id === myId);
            if (index >= 0) {
                if (myProduct.id && myProduct.id !== myId) {
                    console.log("Updating ID is forbidden!!! >(");
                    return;
                } else {
                    this.products[index] = { ...this.products[index], ...myProduct, id: myId };
                    fs.promises.writeFile(`${this.path}/products.json`, JSON.stringify(this.products, null, '\t'));
                }
            } else {
                console.log(`Product with ID ${myId} Not Found`);
            }
        } catch(error) {
            throw error;
        }
    }

    deleteProduct = async (myId) => {
        try {
            let myFile = await fs.promises.readFile(`${this.path}/products.json`, 'utf8');
            this.products = JSON.parse(myFile);

            const deleteProduct = this.products.findIndex((product) => product.id === myId);

            if(deleteProduct >= 0) {
                this.products.splice(deleteProduct, 1);
                await fs.promises.writeFile(`${this.path}/products.json`, JSON.stringify(this.products, null, '\t'));
                console.log(`Product with ${myId} deleted.`);
            }else{
                console.log(`Product with ${myId} does not exist.`)
            }
        }catch (error) {
            throw error;
        }
    }
}

export default ProductManager;