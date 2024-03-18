class ProductManager {
	constructor() {};

    addProducts = async (myProduct) => { 
        const { title, description, price, code, status, myThumbnail = myProduct.thumbnail || [], stock, category } = myProduct;
        const duplicatedCode = this.products.some((product) => product.code === code);
        const myStatus = true || status;
        
        if (title && description && price && code && myStatus && stock && category ) {
            if (!duplicatedCode) {
                let id = this.products.length + 1;
                const thumbnail = Array.isArray(myThumbnail) ? myThumbnail : [myThumbnail];

                if (!Array.isArray(thumbnail)) {
                    thumbnail = [thumbnail];
                }
        
                const thumb = thumbnail.map((value, key) => ({ [key]: value }));

                this.products.push({id, title, description, price, thumbnail: thumb, code, status, stock, category});
            
                return this.products;
            }else{
                throw error;
            }
        }else{
            console.log("Todos los campos son obligatorios");
        }
    };

    getProducts = async (limit) => {
        try {
            if (limit) products = products.slice(0, limit);    

            return products;
        } catch (error) {
            throw error;
        }    
    }

    getProductById = async (myId) => {
        try {
            const myProduct = this.products.find((product) => product.id === myId);

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
            const index = this.products.findIndex((product) => product.id === myId);
            if (index >= 0) {
                
                if (myProduct.id && myProduct.id !== myId) {
                    console.log("Updating ID is forbidden!!! >(");
                    return;
                } else {
                    this.products[index] = { ...this.products[index], ...myProduct, id: myId };
                }
            } else {
                console.log(`Product with ID ${myId} Not Found`);
            }
        } catch(error) {
            console.error(error);
        }
    }

    deleteProduct = async (myId) => {
        try {
            const deleteProduct = this.products.findIndex((product) => product.id === myId);

            if(deleteProduct >= 0) {
                this.products.splice(deleteProduct, 1);
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