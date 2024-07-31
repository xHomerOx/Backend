class ProductDto {
    constructor(product) {
      this.title = product.title ?? 'Unknown';
      this.description = product.description ?? 'No description';
      this.code = product.code ?? 'Unknown';
      this.price = product.price ?? null;
      this.status = product.status ? "Available" : "Not Available";
      this.stock = product.stock ?? 0;
      this.category = product.category ?? 'Unknown';
      this.thumbnail = product.thumbnail ?? null;
    }
}

export default ProductDto;
