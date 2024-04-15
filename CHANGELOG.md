# Segunda Pre-entrega Proyecto Final

Desarrollar el servidor basado en Node.JS y express, que escuche en el puerto 8080 y disponga de dos grupos de rutas: /products y /carts. Dichos endpoints estarán implementados con el router de express.

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