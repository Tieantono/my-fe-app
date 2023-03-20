import axiosFetcher from "@/functions/axiosFetcher";
import { StudentListItem, StudentViewModel } from "@/interfaces/StudentListItem";
import { Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useState } from "react";
import useSWR from 'swr';

const IndexPage: React.FC = () => {
    const [queryParams, setQueryParams] = useState('');
    const url = `http://localhost:5009/api/v1/student${queryParams}`;
    const { data } = useSWR<StudentViewModel>(url, axiosFetcher);

    const paginationConfig: TablePaginationConfig = {
        total: data?.totalData,
        pageSize: 5,
        onChange: onChangePage
    }

    function onChangePage(page: number) {
        const params = `?page=${page}`;
        setQueryParams(params);
    }

    const tableColumns: ColumnsType<StudentListItem> = [
        {
            title: 'Student ID',
            dataIndex: 'studentId',
            key: 'studentId',
        },
        {
            title: 'Student Name',
            dataIndex: 'studentName'
        },
        {
            title: 'Nickname',
            dataIndex: 'nickname'
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber'
        },
        {
            title: 'School Name',
            dataIndex: 'schoolName'
        },
        {
            title: 'Joined At',
            dataIndex: 'joinedAt',
            render: (dateTimeString: string) => {
                const dateTime = new Date(dateTimeString);

                const date = dateTime.getDate();
                const month = dateTime.getMonth();
                const year = dateTime.getFullYear();
                const hour = dateTime.getHours();
                const minute = dateTime.getMinutes();
                const seconds = dateTime.getSeconds();

                return `${date}-${month}-${year} ${hour}:${minute}:${seconds}`;
            }
        },
    ]

    return <div style={{padding: '5em'}}>
        <Table style={{borderWidth: 1, borderColor: "black", borderStyle: "solid"}} 
        columns={tableColumns} 
        dataSource={data?.students}
        pagination={paginationConfig}
        ></Table>
    </div>;
}

export default IndexPage;