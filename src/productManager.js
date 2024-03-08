import { writeFileSync, promises, readFileSync } from 'fs';

class ProductManager {
	constructor() {
        this.path = './myFile';
        let myFile = readFileSync(`${this.path}/products.json`, 'utf8');
        this.products = JSON.parse(myFile);
    };

    addProducts = (myProduct) => { 

        const { title, description, price, code, status, myThumbnail = myProduct.thumbnail || [], stock, category } = myProduct;
        const duplicatedCode = this.products.some((product) => product.code === code);
        
        const myStatus = true || status;
        
        if (title && description && price && code && myStatus && stock && category ) {
            if (!duplicatedCode) {
                let id = this.products.length + 1;
                const thumbnail = [];
                let key = 0;
                
                for (const value of myThumbnail) {
                    thumbnail.push({ [key]: value });
                    key++;
                }

                this.products.push({id, title, description, price, thumbnail, code, status, stock, category});
                writeFileSync(`${this.path}/products.json`, JSON.stringify(this.products, null, '\t'));
                return this.products;
            }else{
                console.log("El código no puede estar repetido");
            }
        }else{
            console.log("Todos los campos son obligatorios");
        }
    };

    //Leo el archivo y veo si realmente existe.
    getProducts = async (limit) => {
        try {
            let myFile = await promises.readFile(`${this.path}/products.json`, 'utf8');
            let products = JSON.parse(myFile);

            if (limit) products = products.slice(0, limit);    

            return products;
        } catch (error) {
            console.error(error);
            throw error;
        }    
    }

    //Quiero ver si el id existe usando como parametro un id que yo le asigno al método.
    getProductById = async (myId) => {
        try {
            let myFile = await promises.readFile(`${this.path}/products.json`, 'utf8');
            let products = JSON.parse(myFile);

            const myProduct = products.find((product) => product.id === myId);

            if (myProduct) {
                return myProduct;
            }else{
                return (`Product with ID ${myId} Not Found`);
            }
        } catch(error) {
            console.error(error);
            throw error;
        }
    }

    updateProduct = (myId, myProduct) => {
        try {
            const index = this.products.findIndex((product) => product.id === myId);
            if (index >= 0) {
                
                // Si el ID del Producto es diferente al que yo le quiero asignar muestra NOT FOUND.
                if (myProduct.id && myProduct.id !== myId) {
                    console.log("Updating ID is forbidden!!! >("); //Prohibo el uso de modificar el ID con el IF de arriba.
                    return;
                } else {
                    this.products[index] = { ...this.products[index], ...myProduct, id: myId };
                    writeFileSync(`${this.path}/products.json`, JSON.stringify(this.products, null, '\t'));
                }
            } else {
                console.log(`Product with ID ${myId} Not Found`);
            }
        } catch(error) {
            console.error(error);
        }
    }

    deleteProduct = (myId) => {
        try {
            let myFile = readFileSync(`${this.path}/products.json`, 'utf8');
            this.products = JSON.parse(myFile);

            //Busco el producto a borrar con ese mismo ID.
            const deleteProduct = this.products.findIndex((product) => product.id === myId);

            if(deleteProduct >= 0) {
                //Borro el producto con Splice.
                this.products.splice(deleteProduct, 1);
                writeFileSync(`${this.path}/products.json`, JSON.stringify(this.products, null, '\t'));
                console.log(`Product with ${myId} deleted.`);
            }else{
                console.log(`Product with ${myId} does not exist.`)
            }
        }catch (error) {
            console.error(error);
        }
    }
}

export default ProductManager;