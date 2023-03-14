/**
 * Update Product Detail data model for request body to the BE endpoint.
 */
export default interface UpdateProductForm {
    productName: string,
    price: number,
    quantity: number
}