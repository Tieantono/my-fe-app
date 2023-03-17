import { Button, Card, Input, InputNumber, Space } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from '@/styles/Custom.module.css';
import RouteParam from "@/interfaces/RouteParams";
import { ProductDetail, ProductDetailProps } from "@/interfaces/ProductDetail";
import axios from "axios";

// Declare a React function component named ProductDetail.
// Use the React.FC as static typing from TypeScript.
// FC is the acronym for "function component".
const DeleteProductConfirmationPage: React.FC<ProductDetailProps> = (props) => {
    const router = useRouter();
    const { id } = router.query;
    const [productDetail, _setProductDetail] = useState<ProductDetail>({
        productId: props.productDetail.productId,
        name: props.productDetail.name,
        price: props.productDetail.price,
        quantity: props.productDetail.quantity
    });
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * Handle on click confirm delete (Yes) button.
     */
    async function onClickConfirmDeleteButton() {
        const client = axios.create();

        try {
            await client.delete(`http://localhost:5009/api/product/${productDetail.productId}`);

            router.push('/product');
        } catch (error) {
            // You can breakdown the error as Axios response error.
            // For this example, we'll just use a simple error message.
            setErrorMessage('Error when deleting the data in the server.');
            console.error(error);
        }
    }

    /**
     * Render the Product Detail data.
     * @returns 
     */
    function renderDetail() {
        return <div className={styles.layout}>
            <Space direction="vertical" size={16}>
                <Card title={`Product Detail: ${id}`}>
                    <Space direction="vertical" size={16}>
                        <h2 className={styles['danger-text']}>Are you sure want to delete this data?</h2>
                        <Input addonBefore="Name: " defaultValue={productDetail.name}
                            disabled />
                        <InputNumber addonBefore="Price: " defaultValue={productDetail.price}
                            disabled />
                        <InputNumber addonBefore="Quantity: " defaultValue={productDetail.quantity}
                            disabled />
                        <Space direction="horizontal">
                            <Button type="text"
                                onClick={onClickConfirmDeleteButton}
                            >Yes</Button>

                            <Button type="primary"
                            onClick={() => router.push('/product')}
                            >No</Button>
                        </Space>

                        {errorMessage.length > 0 &&
                                <span className={styles['danger-text']}>{errorMessage}</span>
                            }
                    </Space>
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

export default DeleteProductConfirmationPage;