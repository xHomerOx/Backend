import { writeFileSync, promises, readFileSync } from 'fs';

//Genero clase constructora ProductManager
class ProductManager {
    //Creo un array vacio y agrego directorio a usar mi products.json.
	constructor() {
        this.path = './myFile';
        fs.writeFileSync(`${this.path}/products.txt`, JSON.stringify(this.products, null, '\t'));
    };

    //Función Agregar productos
    addProducts = (myProduct) => { 

        const { title, description, price, thumbnail, code, stock } = myProduct;
        
        //Chequeo que los campos sean obligatorios y que "code" no se repita, tirando el mensaje correspondiente.
        const duplicatedCode = this.products.some((product) => product.code === code);
        
        if (title && description && price && thumbnail && code && stock) {

            //Si el numero de codigo no se duplica escribir archivo con el producto.
            if (!duplicatedCode) {
                let id = this.products.length + 1;
                this.products.push({id, title, description, price, thumbnail, code, stock});
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

let product = new ProductManager();

const newProduct = {
    title: 'Producto 1', 
    description: 'Mi producto 1', 
    price: 100, 
    thumbnail: 'prod1.jpg', 
    code: 'A001', 
    stock: 10
};

const newProduct2 = { 
    title: 'Producto 2', 
    description: 'Mi producto 2', 
    price: 200, 
    thumbnail: 'prod2.jpg', 
    code: 'A002', 
    stock: 20
};

const newProduct3 = { 
    title: 'Producto 3', 
    description: 'Mi producto 3', 
    price: 300, 
    thumbnail: 'prod3.jpg', 
    code: 'A003', 
    stock: 30
};

const newProduct4 = {
    title: 'Producto 4', 
    description: 'Mi producto 41', 
    price: 400, 
    thumbnail: 'prod4.jpg', 
    code: 'A004', 
    stock: 40
};

const newProduct5 = { 
    title: 'Producto 5', 
    description: 'Mi producto 5', 
    price: 500, 
    thumbnail: 'prod5.jpg', 
    code: 'A005', 
    stock: 50
};

const newProduct6 = { 
    title: 'Producto 6', 
    description: 'Mi producto 63', 
    price: 600, 
    thumbnail: 'prod6.jpg', 
    code: 'A006', 
    stock: 60
};

const newProduct7 = {
    title: 'Producto 7', 
    description: 'Mi producto 7', 
    price: 700, 
    thumbnail: 'prod7.jpg', 
    code: 'A007', 
    stock: 70
};

const newProduct8 = { 
    title: 'Producto 8', 
    description: 'Mi producto 8', 
    price: 800, 
    thumbnail: 'prod8.jpg', 
    code: 'A008', 
    stock: 80
};

const newProduct9 = { 
    title: 'Producto 9', 
    description: 'Mi producto 9', 
    price: 900, 
    thumbnail: 'prod9.jpg', 
    code: 'A009', 
    stock: 90
};

const newProduct10 = { 
    title: 'Producto 10', 
    description: 'Mi producto 10', 
    price: 900, 
    thumbnail: 'prod10.jpg', 
    code: 'A010', 
    stock: 100
};

product.addProducts(newProduct);
product.addProducts(newProduct2);
product.addProducts(newProduct3);
product.addProducts(newProduct4);
product.addProducts(newProduct5);
product.addProducts(newProduct6);
product.addProducts(newProduct7);
product.addProducts(newProduct8);
product.addProducts(newProduct9);
product.addProducts(newProduct10);

export default ProductManager;