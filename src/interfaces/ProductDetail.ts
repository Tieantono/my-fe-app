/**
 * Product Detail page props model.
 */
export interface ProductDetailProps {
    productDetail: ProductDetail;
}

/**
 * Product Detail data model based on the BE's response.
 */
export interface ProductDetail {
    productId: string,
    name: string,
    price: number,
    quantity: number
}