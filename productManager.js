import { writeFileSync, promises, readFileSync } from 'fs';

//Genero clase constructora ProductManager
class ProductManager {
    //Creo un array vacio y agrego directorio a usar mi products.json.
	constructor() {
        this.products = [];
        this.path = './myFile';

        writeFileSync(`${this.path}/products.json`, JSON.stringify(this.products, null, '\t'));
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
    getProducts = async () => {
            try {
                let myFile = await promises.readFile(`${this.path}/products.json`, 'utf8');
                console.log(myFile);
            } catch (error) {
                console.error("Could not read file!!!", error);
            }
        }

    //Quiero ver si el id existe usando como parametro un id que yo le asigno al método.
    getProductById = async (myId) => {
        await promises.readFile(`${this.path}/products.json`, 'utf8');
        const myProduct = this.products.find((product) => product.id === myId);
        if (myProduct) {
            return myProduct;
        }else{
            console.log(`Product with ID ${myId} Not Found`);
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

// Funciona
product.addProducts(newProduct);

//Actualiza Titulo y Descripcion.
product.updateProduct(1, { title: "Producto 3", description: "Mi producto 3" });

//Vuelvo a llamar al Producto 1 con los datos actualizados.
product.getProductById(1);

//No actualiza ID.
product.updateProduct(1, { id: 3, title: "Producto 3", description: "Mi producto 3" });
product.getProducts();

//Se puede ver aqui.
product.getProductById(3);

//Nuevos Productos.
product.addProducts(newProduct2);
product.addProducts(newProduct3);

//Traigo Nuevos Productos
product.getProductById(2);
product.getProductById(3);

//Borro los productos (comentar esto de abajo para ver que se agregan los productos).
product.deleteProduct(1);
product.deleteProduct(2);
product.deleteProduct(3);

product.getProducts();

//Dejo solo el getProducts y el getProductByID Asincronicos por que si no el codigo de arriba no funciona secuencialmente.