import React, { useEffect, useState } from 'react';
import styles from '@/styles/Custom.module.css';
import { Button, Input, Space } from 'antd';
import ProductListItem from '@/interfaces/ProductListItem';
import useSWR from 'swr';
import axiosFetcher from '@/functions/axiosFetcher';
import { SearchOutlined } from '@ant-design/icons';

const Index: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [queryParams, setQueryParams] = useState('');
    // Whenever queryParams value has changed, since we put the url constant as key in useSWR function, it will
    // automatically fetch data from the server.
    const url = `http://localhost:5009/api/product${queryParams}`;
    const { data } = useSWR<ProductListItem[]>(url, axiosFetcher);

    // Not the recommended way, please use swr instead!
    // const [data, setData] = useState<ProductListItem[]>();

    // /**
    //  * Fetch the product list from the server.
    //  */
    // async function fetchList(){
    //     const client = axios.create();
    //     const productListApiUri = 'http://localhost:5009/api/product';

    //     const response = await client.get<ProductListItem[]>(productListApiUri);

    //     setProductList(response.data);
    // }

    // useEffect(() => {
    //     fetchList();
    //     // Use [] to tell the useEffect to run the codes once on this component mount lifecycle.
    // }, []);

    /**
     * Render the product list component.
     * @returns 
     */
    function renderProductList() {
        // Use ! to check whether the data is undefined or null.
        if (!data) {
            return;
        }

        const productElement = data.map((product) => {
            return <tr key={product.productId}>
                <td>{product.productId}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>
                    <a href={`product/${product.productId}`}>Detail</a>
                </td>
                <td>
                    <a href={`product/delete/${product.productId}`}
                    className={styles['danger-btn']}
                    >Hapus</a>
                </td>
            </tr>;
        });

        return renderHtmlTable(productElement);
    }

    /**
     * Render the product list table using standard HTML element.
     * @param el 
     * @returns 
     */
    function renderHtmlTable(el: JSX.Element[]) {
        return <table className={styles.table}>
            <thead>
                <tr>
                    <th>
                        Product ID
                    </th>
                    <th>
                        Product Name
                    </th>
                    <th>
                        Product Price
                    </th>
                    <th>
                        Product Quantity
                    </th>
                    <th colSpan={2}>
                        Action
                    </th>
                </tr>
            </thead>
            <tbody>
                {el}
            </tbody>
        </table>
    }


    function onSubmitSearchTextBox(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const params = `?productName=${searchText}`;
        setQueryParams(params);
    }

    function renderSearchTextBox() {
        return <form onSubmit={onSubmitSearchTextBox}>
            <Space direction="vertical" size={16}>
                <Input placeholder='Search product name' addonAfter={<SearchOutlined />}
                    onChange={(e) => setSearchText(e.target.value)} />
            </Space>
        </form>
    }

    return <div className={styles.layout}>
        <Space direction="vertical" size={16}>
            <h1>Product List</h1>
            {renderSearchTextBox()}
            {renderProductList()}
        </Space>
    </div>;
}

export default Index;