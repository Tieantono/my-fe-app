import SchoolListItem from "@/interfaces/SchoolListItem";
import { Table } from 'antd';
import type { ColumnsType } from "antd/es/table";

const IndexPage: React.FC<SchoolIndexPageProps> = (props) => {
    const tableColumns: ColumnsType<SchoolListItem> = [
        {
            title: 'School ID',
            dataIndex: 'schoolId',
            key: 'schoolId',
        },
        {
            title: 'School Name',
            dataIndex: 'schoolName'
        },
        {
            title: 'Established At',
            dataIndex: 'establishedAt',
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
        <Table style={{borderWidth: 1, borderColor: "black", borderStyle: "solid"}} columns={tableColumns} dataSource={props.schools}></Table>
    </div>;
}

// Example for get the school list using SSR technique.
export async function getServerSideProps() {
    // Call an external API endpoint to get product detail using fetch API.
    const response = await fetch(`http://localhost:5009/api/v1/school`);

    // Parse the response as JSON data.
    const schools = await response.json() as SchoolListItem[];

    // Pass data to the page component (PageDetail) via props.
    return { props: { schools } }
}

// You can also define the page component's props interface in the same file as the page component definitions.
interface SchoolIndexPageProps {
    schools: SchoolListItem[]
}

export default IndexPage;