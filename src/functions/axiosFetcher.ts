import axios from 'axios';
const axiosFetcher = async (url: string) => {
    try {
        const response = await axios.get(url);

        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export default axiosFetcher;