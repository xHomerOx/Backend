const fs = require('fs');

//Genero clase constructora ProductManager
class ProductManager {
    //Creo un array vacio.
	constructor() {
        this.products = [];
        this.path = './myFile';
    };

    
    // fs.writeFileSync(`${this.path}/test.txt`, "Hola mundo");

    //Función Agregar productos
    addProducts = (myProduct) => { 

        const { title, description, price, thumbnail, code, stock } = myProduct;
        
        //Chequeo que los campos sean obligatorios y que "code" no se repita, tirando el mensaje correspondiente.
        const duplicatedCode = this.products.some((product) => product.code === code);

        if (title && description && price && thumbnail && code && stock) {
            if (!duplicatedCode) {
                let id = this.products.length + 1;
                this.products.push({id, title, description, price, thumbnail, code, stock});
                console.log(this.products);

                return this.products;
            }else{
                console.log("El código no puede estar repetido");
            }
        }else{
            console.log("Todos los campos son obligatorios");
        }
    };

    //Muestro los productos cuando llamo a este metodo mediante el objeto creado a partir del constructor.
    getProducts = () => {
        console.log(this.products);
    }

    //Quiero ver si el id existe usando como parametro un id que yo le asigno al método.
    getProductById = (myId) => {
        const myProduct = this.products.find((product) => product.id === myId);
        if (myProduct) {
            console.log(myProduct);

            return myProduct;
        }else{
            console.log(`Product with ID ${myId} Not Found`);
        }
    }

    updateProduct = (myId, myProduct) => {
        const index = this.products.findIndex((product) => product.id === myId);
        if (index >= 0) {
            
            //Si el ID del Producto es diferente al que yo le quiero asignar muestra ERROR.
            if (myProduct.id && myProduct.id !== myId) {
                console.log("Updating ID is forbidden!!! >(");
                return;
            }

            this.products.id = myId;
            this.products[index] = { ...this.products[index], ...myProduct };
        }else{
            console.log(`Product with ID ${myId} Not Found`);
        }
    }

    deleteProduct = (myId) => {
        this.products = this.products.filter((product) => product.id !== myId);
        console.log(this.products);
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

//Funciona
product.addProducts(newProduct);
// product.addProducts(newProduct2);

// //Trae el producto con el ID
// product.getProductById(2);

//Actualiza Titulo y Descripcion.
product.updateProduct(1, { title: "Producto 2", description: "Mi producto 2" });

//Vuelvo a llamar al Producto 1 con los datos actualizados.
product.getProductById(1);

//No actualiza ID.
// product.updateProduct(1, { id: 3, title: "Producto 2", description: "Mi producto 2" });

// product.getProductById(3);

product.deleteProduct(1);
product.getProductById(1);