//Genero clase constructora ProductManager
class ProductManager {
    //Creo un array vacio.
	constructor() {
        this.products = [];
    };

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
        }else{
            console.log("Not Found");
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
    price: 200, 
    thumbnail: 'prod2.jpg', 
    code: 'A002', 
    stock: 20
};

//Funciona
product.addProducts(newProduct);
product.addProducts(newProduct2);

//Trae los productos
product.getProducts();