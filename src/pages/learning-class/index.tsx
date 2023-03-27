import React, { useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import axiosFetcher from '@/functions/axiosFetcher';
import { LearningClassListItem, LearningClassViewModel } from '@/interfaces/LearningClassListItem';
import { Button, Card, DatePicker, Input, InputNumber, Select, Space, Table } from 'antd'
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { SearchOutlined } from '@ant-design/icons';
import styles from '@/styles/Custom.module.css';
import { NewLearningClassForm, NewLearningClassSubmissionData } from '@/interfaces/NewLearningClassForm';
import LecturerDropdownModel from '@/interfaces/LecturerDropdownModel';
import { DebounceSelect } from '@/components/DebounceSelect';
import axios from 'axios';
import StudentDropdownModel from '@/interfaces/StudentDropdownModel';

const IndexPage: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [queryParams, setQueryParams] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [newLearningClass, setNewLearningClass] = useState<NewLearningClassForm>({
        learningClassId: '',
        lecturer: {
            label: '',
            value: ''
        },
        students: [],
        startDate: new Date(),
        finishDate: new Date()
    });

    const url = `http://localhost:5009/api/v1/learning-class${queryParams}`;
    const { data, mutate } = useSWR<LearningClassViewModel>(url, axiosFetcher);

    const paginationConfig: TablePaginationConfig = {
        total: data?.totalData,
        pageSize: 5,
        onChange: onChangePage
    }

    function onChangePage(page: number) {
        let params = `?page=${page}`;

        if (searchText) {
            params = params + `&lecturerName=${searchText}`;
        }

        setQueryParams(params);
    }

    async function fetchLecturerDropdown(lecturerName: string){
        let queryParams = '?lecturerName=';
        if (lecturerName) {
            queryParams = queryParams + lecturerName;
        }

        try {
            const response = await axios.get<LecturerDropdownModel[]>(`http://localhost:5009/api/v1/learning-class/lecturers${queryParams}`);

            return response.data;
        } catch (error) {
            console.error(error);
        }

        return [];
    }

    async function fetchStudentDropdown(lecturerName: string){
        let queryParams = '?studentName=';
        if (lecturerName) {
            queryParams = queryParams + lecturerName;
        }

        try {
            const response = await axios.get<LecturerDropdownModel[]>(`http://localhost:5009/api/v1/learning-class/students${queryParams}`);

            return response.data;
        } catch (error) {
            console.error(error);
        }

        return [];
    }

    const tableColumns: ColumnsType<LearningClassListItem> = [
        {
            title: 'Learning Class ID',
            dataIndex: 'learningClassId',
            key: 'learningClassId',
        },
        {
            title: 'Lecturer Name',
            dataIndex: 'lecturerName'
        },
        {
            title: 'Subject',
            dataIndex: 'subject'
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            render: (dateTimeString: string) => {
                const dateTime = new Date(dateTimeString);

                const date = dateTime.getDate();
                const month = dateTime.getMonth();
                const year = dateTime.getFullYear();
                const hour = dateTime.getHours();
                const minute = dateTime.getMinutes();
                const seconds = dateTime.getSeconds();

                return `${year}/${month}/${date} ${hour}:${minute}:${seconds}`;
            }
        },
        {
            title: 'Finish Date',
            dataIndex: 'finishDate',
            render: (dateTimeString: string) => {
                const dateTime = new Date(dateTimeString);

                const date = dateTime.getDate();
                const month = dateTime.getMonth();
                const year = dateTime.getFullYear();
                const hour = dateTime.getHours();
                const minute = dateTime.getMinutes();
                const seconds = dateTime.getSeconds();

                return `${year}/${month}/${date} ${hour}:${minute}:${seconds}`;
            }
        },
    ]

    function onSubmitSearchTextBox(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const params = `?lecturerName=${searchText}`;
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

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!newLearningClass.learningClassId) {
            setErrorMessage('Learning Class ID must not be empty.');
            return;
        }
        if (newLearningClass.learningClassId.length < 3 || newLearningClass.learningClassId.length > 20) {
            setErrorMessage('Learning Class ID must be between 3 to 20 characters.');
            return;
        }

        const currentDate = new Date(Date.UTC(new Date().getUTCFullYear(), 
        new Date().getUTCMonth(), 
        new Date().getUTCDate()));

        const startDate = new Date(Date.UTC(newLearningClass.startDate.getUTCFullYear(), 
        newLearningClass.startDate.getUTCMonth(), 
        newLearningClass.startDate.getUTCDate()));
        if (startDate <= currentDate) {
            setErrorMessage('Start Date must be +1 day from the current date.');
            return;
        }

        const finishDate = new Date(Date.UTC(newLearningClass.finishDate.getUTCFullYear(), 
        newLearningClass.finishDate.getUTCMonth(), 
        newLearningClass.finishDate.getUTCDate()));
        if (finishDate <= currentDate) {
            setErrorMessage('Finish Date must be at least +1 day from the current date.');
            return;
        }

        if (!newLearningClass.lecturer.value) {
            setErrorMessage('Lecture must be filled.');
            return;
        }

        if (newLearningClass.students.length === 0) {
            setErrorMessage('Students must be filled.');
            return;
        }

        const client = axios.create();

        try {
            // Initialize into new object because lecturer and students object seems polluted with antd Select's objects.
            // Also, we only need to send the lecturer's ID and students' IDs.
            const data: NewLearningClassSubmissionData = {
                learningClassId: newLearningClass.learningClassId,
                lecturerId: newLearningClass.lecturer.value,
                studentIds: newLearningClass.students.map(student => student.value),
                startDate: newLearningClass.startDate,
                finishDate: newLearningClass.finishDate
            }
            const response = await client.post(`http://localhost:5009/api/v1/learning-class`, data);

            setErrorMessage('');
            setSuccessMessage(`Success. ${response.data}`);

            setNewLearningClass({
                learningClassId: '',
                lecturer: {
                    label: '',
                    value: ''
                },
                students: [],
                startDate: new Date(),
                finishDate: new Date()
            });
        } catch (error) {
            // You can breakdown the error as Axios response error.
            // For this example, we'll just use a simple error message.
            setErrorMessage('Error when sending the data to the server.');
            console.error(error);
        }
        
        mutate();
    }

    function onSetStartDate(_date: unknown, dateString: string) {
        const startDate = new Date(dateString);

        setNewLearningClass({
            ...newLearningClass,
            startDate: startDate
        });
    }

    function onSetFinishDate(_date: unknown, dateString: string) {
        const finishDate = new Date(dateString);

        setNewLearningClass({
            ...newLearningClass,
            finishDate: finishDate
        });
    }

    function renderForm() {
        return <div className={styles.layout}>
            <Space direction="vertical" size={16}>
                <Card title={`Create New Learning Class`}>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <Space direction="vertical" size={16}>
                            <Input addonBefore="Learning Class ID: "
                                onChange={(e) => setNewLearningClass({
                                    ...newLearningClass,
                                    learningClassId: e.target.value
                                })} />

                            <DebounceSelect
                                showSearch
                                value={newLearningClass.lecturer}
                                placeholder="Select lecturer"
                                fetchOptions={fetchLecturerDropdown}
                                onChange={(newValue) => {
                                    setNewLearningClass({
                                        ...newLearningClass,
                                        lecturer: newValue as LecturerDropdownModel
                                    });
                                }}
                                style={{ width: '100%' }}
                            />
                            <DebounceSelect
                                mode='multiple'
                                value={newLearningClass.students}
                                placeholder="Select students"
                                fetchOptions={fetchStudentDropdown}
                                onChange={(newValue) => {
                                    setNewLearningClass({
                                        ...newLearningClass,
                                        students: newValue as StudentDropdownModel[]
                                    });
                                }}
                                style={{ width: '100%' }}
                            />
                            <DatePicker onChange={onSetStartDate} />
                            <DatePicker onChange={onSetFinishDate} />
                            {/* <InputNumber addonBefore="Price: " defaultValue={0}
                                onChange={(e) => setNewProductForm({
                                    ...newProductForm,
                                    price: e ?? 0
                                })} />
                            <InputNumber addonBefore="Quantity: " defaultValue={0}
                                onChange={(e) => setNewProductForm({
                                    ...newProductForm,
                                    quantity: e ?? 0
                                })} /> */}
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

    return <div style={{ padding: '5em' }}>
        <h1>Learning Classes</h1>
        {renderSearchTextBox()}
        <Table style={{ borderWidth: 1, borderColor: "black", borderStyle: "solid" }}
            columns={tableColumns}
            dataSource={data?.learningClasses}
            pagination={paginationConfig}
        ></Table>
        {renderForm()}
    </div>;
}

export default IndexPage;