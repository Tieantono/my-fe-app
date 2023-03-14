import { Button, Card, Input, InputNumber, Space } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from '@/styles/Custom.module.css';
import RouteParam from "@/interfaces/RouteParams";
import { ProductDetail, ProductDetailProps } from "@/interfaces/ProductDetail";
import axios from "axios";
import UpdateProductForm from "@/interfaces/UpdateProductForm";

// Declare a React function component named ProductDetail.
// Use the React.FC as static typing from TypeScript.
// FC is the acronym for "function component".
const ProductDetail: React.FC<ProductDetailProps> = (props) => {
    const router = useRouter();
    const { id } = router.query;
    const [productDetail, setProductDetail] = useState<ProductDetail>({
        productId: props.productDetail.productId,
        name: props.productDetail.name,
        price: props.productDetail.price,
        quantity: props.productDetail.quantity
    });

    /**
     * Handle on form submission event.
     * @param e 
     */
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const client = axios.create();

        const updatedProductDetail: UpdateProductForm = {
            productName: productDetail.name,
            price: productDetail.price,
            quantity: productDetail.quantity,
        }

        console.info(updatedProductDetail);
        const response = await client.put(`http://localhost:5009/api/product/${props.productDetail.productId}`, updatedProductDetail);

        console.info(response.data);
    }

    /**
     * Render the Product Detail data.
     * @returns 
     */
    function renderDetail() {
        return <div className={styles.layout}>
            <Space direction="vertical" size={16}>
                <Card title={`Product Detail: ${id}`}>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <Space direction="vertical" size={16}>
                            <Input addonBefore="Name: " defaultValue={productDetail.name} 
                            onChange={(e) => setProductDetail({
                                ...productDetail,
                                // Use the event.target.value to obtain the new input.
                                name: e.target.value
                            })} />
                            <InputNumber addonBefore="Price: " defaultValue={productDetail.price}
                            onChange={(e) => setProductDetail({
                                ...productDetail,
                                // Use ternary expression for simple handling null value.
                                price: e ?? 0
                            })} />
                            <InputNumber addonBefore="Quantity: " defaultValue={productDetail.quantity}
                            onChange={(e) => setProductDetail({
                                ...productDetail,
                                // Use ternary expression for simple handling null value.
                                quantity: e ?? 0
                            })} />
                            <Button htmlType="submit" type="primary" block>
                                Submit
                            </Button>
                        </Space>
                    </form>
                </Card>
            </Space>
        </div>
    }

    return <>{renderDetail()}</>;
}

// Server-side Rendering (SSR) to fetch the data from the BE and render the view from FE server.
export async function getServerSideProps({ params }: RouteParam) {
    // params contains the post `id`.
    // If the route is like /product/1, then params.id is 1
    const paramsId = params.id;

    // Call an external API endpoint to get product detail using fetch API.
    const response = await fetch(`http://localhost:5009/api/product/${paramsId}`);

    // Parse the response as JSON data.
    const productDetail = await response.json() as ProductDetail;

    // Pass data to the page component (PageDetail) via props.
    return { props: { productDetail } }
}

export default ProductDetail;