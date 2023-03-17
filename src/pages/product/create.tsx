import { Button, Card, Input, InputNumber, Space } from "antd";
import styles from '@/styles/Custom.module.css';
import axios from "axios";
import NewProductForm from "@/interfaces/NewProductForm";
import { useState } from "react";

const CreateProductPage: React.FC = () => {
    const [newProductForm, setNewProductForm] = useState<NewProductForm>({
        name: '',
        price: 0,
        quantity: 0
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * Handle on form submission event.
     * @param e 
     */
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Validate name field.
        if (!newProductForm.name) {
            setErrorMessage('Name must not be empty.');
            return;
        }
        if (newProductForm.name.length < 3 || newProductForm.name.length > 32) {
            setErrorMessage('Name must be between 3 to 32 characters.');
            return;
        }

        // Validate price field.
        if (newProductForm.price < 100 || newProductForm.price > 1_000_000) {
            setErrorMessage('Price must be between 100 to 1.000.000.');
            return;
        }

        // Validate quantity field.
        if (newProductForm.quantity < 1 || newProductForm.quantity > 100) {
            setErrorMessage('Quantity must be between 1 to 100.');
            return;
        }

        const client = axios.create();

        try {
            const response = await client.post(`http://localhost:5009/api/product`, newProductForm);

            setErrorMessage('');
            setSuccessMessage(`Success. ${response.data}`);
        } catch (error) {
            // You can breakdown the error as Axios response error.
            // For this example, we'll just use a simple error message.
            setErrorMessage('Error when sending the data to the server.');
            console.error(error);
        }
    }

    function renderForm() {
        return <div className={styles.layout}>
            <Space direction="vertical" size={16}>
                <Card title={`Create New Product`}>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <Space direction="vertical" size={16}>
                            <Input addonBefore="Name: "
                                onChange={(e) => setNewProductForm({
                                    ...newProductForm,
                                    name: e.target.value
                                })} />
                            <InputNumber addonBefore="Price: " defaultValue={0}
                                onChange={(e) => setNewProductForm({
                                    ...newProductForm,
                                    price: e ?? 0
                                })} />
                            <InputNumber addonBefore="Quantity: " defaultValue={0}
                                onChange={(e) => setNewProductForm({
                                    ...newProductForm,
                                    quantity: e ?? 0
                                })} />
                            <Button htmlType="submit" type="primary" block>
                                Submit
                            </Button>

                            
                            {successMessage.length > 0 &&
                                <span className={styles['success-text']}>{successMessage}</span>
                            }
                            {errorMessage.length > 0 &&
                                <span className={styles['danger-text']}>{errorMessage}</span>
                            }
                        </Space>
                    </form>
                </Card>
            </Space>
        </div>
    }

    return <>{renderForm()}</>;
}

export default CreateProductPage;