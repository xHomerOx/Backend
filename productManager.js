const fs = require('fs');

//Genero clase constructora ProductManager
class ProductManager {
    //Creo un array vacio y agrego directorio a usar mi products.txt.
	constructor() {
        this.products = [];
        this.path = './myFile';
    };

    //Función Agregar productos
    addProducts = async (myProduct) => { 

        const { title, description, price, thumbnail, code, stock } = myProduct;
        
        //Chequeo que los campos sean obligatorios y que "code" no se repita, tirando el mensaje correspondiente.
        const duplicatedCode = this.products.some((product) => product.code === code);
        
        if (title && description && price && thumbnail && code && stock) {
            if (!duplicatedCode) {
                let id = this.products.length + 1;
                this.products.push({id, title, description, price, thumbnail, code, stock});

                await fs.promises.writeFile(`${this.path}/products.txt`, JSON.stringify(this.products, null, '\t'));

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
            let myFile = await fs.promises.readFile(`${this.path}/products.txt`, 'utf8');
            console.log(myFile);
        } catch (error) {
            console.error("Could not read file!!!", error);
        }
    }

    //Quiero ver si el id existe usando como parametro un id que yo le asigno al método.
    getProductById = (myId) => {
        const myProduct = this.products.find((product) => product.id === myId);
        if (myProduct) {
            return myProduct;
        }else{
            console.log(`Product with ID ${myId} Not Found`);
        }
    }

    updateProduct = async (myId, myProduct) => {
        const index = this.products.findIndex((product) => product.id === myId);
        if (index >= 0) {
            
            //Si el ID del Producto es diferente al que yo le quiero asignar muestra ERROR.
            if (myProduct.id && myProduct.id !== myId) {
                console.log("Updating ID is forbidden!!! >(");
                return;
            }else{
                this.products.id = myId;
                this.products[index] = { ...this.products[index], ...myProduct };

                await fs.promises.writeFile(`${this.path}/products.txt`, JSON.stringify(this.products, null, '\t'));
            }
        }else{
            console.log(`Product with ID ${myId} Not Found`);
        }
    }

    deleteProduct = async (myId) => {
        try {
            let myFile = await fs.promises.readFile(`${this.path}/products.txt`, 'utf8');
            this.products = JSON.parse(myFile);

            const deleteProduct = this.products.findIndex((product) => product.id === myId);

            if(deleteProduct >= 0) {
                this.products.splice(deleteProduct, 1);
                await fs.promises.writeFile(`${this.path}/products.txt`, JSON.stringify(this.products, null, '\t'));
            }else{
                console.log("Product with this ID does not exist.")
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

//Funciona
product.addProducts(newProduct);

//Trae el producto con el ID
product.getProductById(1);

//Actualiza Titulo y Descripcion.
product.updateProduct(1, { title: "Producto 3", description: "Mi producto 3" });

//Vuelvo a llamar al Producto 1 con los datos actualizados.
product.getProductById(1);

//No actualiza ID.
product.updateProduct(1, { id: 3, title: "Producto 3", description: "Mi producto 3" });
product.getProducts();

//Se puede ver aqui.
product.getProductById(3);

//Nuevo Producto
product.addProducts(newProduct2);

//Borro el Producto 1
product.deleteProduct(1);

//Intento Borrar Producto Inexistente
product.deleteProduct(3);

//Traigo el Array sin ese producto.
product.getProductById(1);

//Agrego Producto 3
product.addProducts(newProduct3);

//Imprimo de nuevo.
product.getProducts();