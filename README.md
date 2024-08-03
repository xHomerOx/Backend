# Proyecto Final Backend

This is the backend for an ecommerce application. This project provides an API for managing products, shopping carts, and purchase tickets in an ecommerce environment. It uses Express.js as the server framework and MongoDB as the database.

## Features

- **Product Management**: Add, update, delete, and retrieve products.
- **Cart Management**: Add products to a cart, update quantities, and remove products from the cart.
- **Purchase Processing**: Checkout carts and generate purchase tickets.
- **Documentation**: API documentation accessible via Swagger.

## Requirements

- [Node.js](https://nodejs.org/) v20 or higher
- [MongoDB](https://www.mongodb.com/) (local or cloud-based)

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/xHomerOx/Backend.git
   cd Backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the server**:

   ```bash
   npm start
   ```

   The server will be available at `http://localhost:3000`.

## API Routes

### Products

- `GET /api/products` - Retrieve all products.
- `GET /api/products/:pid` - Retrieve a specific product by ID.
- `POST /api/products` - Add a new product.
- `PUT /api/products/:pid` - Update a specific product by ID.
- `DELETE /api/products/:pid` - Delete a specific product by ID.

### Carts

- `GET /api/carts` - Retrieve all carts.
- `GET /api/carts/:cid` - Retrieve the products in a specific cart by ID.
- `POST /api/carts` - Create a new cart.
- `POST /api/carts/:cid/products/:pid` - Add a product to a specific cart.
- `DELETE /api/carts/:cid/products/:pid` - Remove a product from a specific cart.
- `PUT /api/carts/:cid` - Update the quantity of products in a specific cart.
- `DELETE /api/carts/:cid` - Remove all products from a specific cart.
- `GET /api/carts/:cid/checkout` - Retrieve checkout information for a specific cart.

### Tickets

- `POST /api/carts/:cid/purchase` - Purchase products in the specific cart and generate a ticket.
- `GET /api/carts/:cid/purchase` - Retrieve a purchase ticket for a specific cart.

### Documentation

- **Swagger UI**: API documentation is available at `http://localhost:3000/api-docs`.

## Deployment on Railway

To deploy this project on Railway.app:

1. **Create a new project** on [Railway.app](https://railway.app/).

2. **Connect the repository** to Railway:

   - In Railway, go to your project and select "Deployments".
   - Connect your GitHub repository.

3. **Configure environment variables** on Railway:

   - In the "Environment Variables" tab of your Railway project, add the environment variables defined in your `.env` file.

4. **Deploy the project**:

   - Railway will automatically deploy your project whenever you push to the main branch of the repository.

5. **Access the application**:

   - Once deployed, Railway will provide a public URL for your application that you can find in the "Deployments" tab.

## Contributing

Contributions are welcome. If you would like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and ensure everything works correctly.
4. Submit a pull request with a clear description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.