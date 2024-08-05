# Proyecto Final Backend

## 05-08-2024
- Added Ticket per Session.
- Removed function to prevent Admin to Add and View Products in Cart.
- Fixed Remove from Cart not displaying with a Product in Cart.

## 04-08-2024
- Unit and Integration Testing with Carts, Products and Users.
- Fixed inconsitences between Passport and Users.

## 03-08-2024
- Stylized BS5 HomePage.
- Added Not Available Product Logic.
- Updated Swagger Documents.
- Fixed User and Roles not showing on Ticket Info.
- Fixed userData in ChatBox.

## 02-08-2024
- Fixed Handlebars not getting Premium Users.
- Removed Admin from Users Switcher List.
- Added DELETE operation for Role Switcher.
- If email is not set to use the username.
- Fixed Admin Middleware in ProductsRouter.
- Added Premium permissions for CRUD on Products.
- Added Checkout before Ticket submit.

## 01-08-2024
- Added RoleSwitcher for All Users.
- Splitted Multer into two File Uploaders.
- Added New Function to get the IDs of the Users.
- Fixed Users updating all instead of selected ones.
- Added DELETE endpoint for deleting Single User.
- Added Switcher Button to Admin only.
- Fixed Switcher rolling back preventing selectbox to keep canceled state.
- Images will not upload to repository on Github.
- Fixed DAO User preventing adding products.

## 31-07-2024
- Fixed True/False status in entire instance of the App.
- Added GET all Users with Auth Bearer.
- Fixed JWT for retrieve users with token if is Admin.
- Added Login and Logout Functions.
- Implemented Function to DELETE users that did not log in/out last two Days.
- Fixed TimeZone.
- Added Recover and Change Password View.
- Fixed Redirect to Home after Succesfull Login.
- Fixed Password Function to update.

## 30-07-2024
- Added BS5 por Handlebars.
- Fixed Multer filehandlers from Frontend to work.
- Added abstract faker new images randomly.
- Fixed ChatBox template and undefined message at start.
- Changed PUT Endpoint for Products to update only the selected field.

----------------------------------------------------------------------------------------

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
