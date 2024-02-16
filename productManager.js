//Genero clase constructora ProductManager
class ProductManager {
    //Creo un array vacio.
	constructor() {
        this.products = [];
    };

    //Función Agregar productos
    addProducts = (title, description, price, thumbnail, code, stock) => { 
        
        //Chequeo que los campos sean obligatorios y que "code" no se repita, tirando el mensaje correspondiente.
        const duplicatedCode = this.products.some((product) => product.code === code);

        if (title && description && price && thumbnail && code && stock) {
            if (!duplicatedCode) {
                let id = this.products.length + 1;
                this.products.push({id, title, description, price, thumbnail, code, stock});

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

//Funciona
product.addProducts("AAA", "AAA", 1, "imagen1.jpg", "AAA123", 1);
product.addProducts("BBB", "BBB", 2, "imagen2.jpg", "BBB123", 2);

//Trae los productos
product.getProducts();

//Busco el producto por ID
product.getProductById(1);
product.getProductById(2);

//Me devuelve Not Found
product.getProductById(3);

//Se repite el code, me dara que no puede ser repetido.
product.addProducts("CCC", "CCC", 3, "imagen3.jpg", "AAA123", 3);

//Dara como resultado que los campos son todos obligatorios.
product.addProducts("CCC", 3, "imagen3.jpg", "CCC123", 3);

//Testeo de nuevo
product.getProducts();

//Agrego de nuevo de manera correcta
product.addProducts("CCC", "CCC", 3, "imagen3.jpg", "CCC123", 3);

//Testeo.
product.getProducts();