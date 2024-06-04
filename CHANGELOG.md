# Tercera Pre-entrega Proyecto Final

Mejorando la arquitectura del servidor.

## 03-06-2024
- Prevented Cart to keep products after logged in.
- Fixed the bug where the user couldn't add products to cart after login.
- Added Ticket Model, DAO, DTO, etc.
- Created GET Endpoint to display results.
- Added ClearCart Function.
- Added Amount calculator.
- Fixed not clearcart after HBS Template.
- Dismissed clearCart and used a filter to save only discarded products.

## 02-06-2024
- Added Ticket Model with Mongoose.
- Redo email field in passportConfig and homeView.
- Added Ticket Logic in cartDAO.
- Removed Middleware from login to make POSTMAN test return a JSON.
- Added Logic in index.js to check if is admin or user.
- Fixed missing Cart Ref in User Schema.
- Added BS5 Flexbox.

## 01-06-2024
- Fixed JWT not working with DTO.
- Added Payload in result object.
- Modified Current Path to return user and role only.
- Fixed Github Sessions.
- Added Update Product Button and Swal2.
- Added Admin Guard for POST, PUT and DELETE Operations.
- Added Admin and User Privileges for HBS.
- Added Swal to display Messages.
- Added ChatBox.

## 31-05-2024
- Fixed Patterns in Factory and DAOs Patterns.
- Fixed Update Products was not updating.
- Added getCarts function to display every Cart with their matching items.
- Refactored Carts CRUD Operations.
- Added and Installed missing deps.
- Added UserDTO.
- Modified Memory and Mongo Persistance to match the UserModel.
- Added User Login to Home Page.

## 30-05-2024
- Refactorized Proyect with MVC Pattern.
- Added Product Memory and Mongo DAO.
- Added config.js for Persistence.
- Used Factory Method Pattern.
- Added Repository and modified Controller based on that one.

----------------------------------------------------------------------------------------

# Segunda Pre-entrega Proyecto Final

Desarrollar el servidor basado en Node.JS y express, que escuche en el puerto 8080 y disponga de dos grupos de rutas: /products y /carts. Dichos endpoints estarán implementados con el router de express.

## 16-04-2024
- Changed Product ID by Product Product ID.
- Added Products View.
- Removed unused deps.
- Changed and Modified viewsRoute index.js and logic handlers.
- Added cartView.
- Modified homeView to make the POST request.

## 15-04-2024

- Added JSON Payloads and other Object Data.
- Values works ONLY without quotes, otherwise will throw error.
- Set TRUE or FALSE on Status because i could not change Boolean to String.
- Used mongoose pagination for results.
- Added PUT and DELETE Methods.

## 14-04-2024

- Modified Project Structure.
- Added Query Filtering Options.
- Added Category and Status.

----------------------------------------------------------------------------------------

## 10-03-2024

- Fixed to Empty Cart Array in POST /.
- Fixed Cart and Product ID check.
- Fixed Quantity added with id of that Product to that Cart.
- For now the product will create only if cart exists.
- Modified Products.json status and added category.
- Added Feature to not update products with not found ID.

## 09-03-2024

- Added Cart Array.
- Added POST and GET elements to Cart to insert and retrieve data.
- Fixed Thumbnail and Products Array to check if Array or Simple String.
- Created Products ID with Cart ID in Main Array and Products Array.

## 08-03-2024

- Added Thumbnail Array.
- Added PUT and DELETE requests to products router.

## Started Date: 07-03-2024

- Routers Setup.
- Added GET and POST requests to products router.