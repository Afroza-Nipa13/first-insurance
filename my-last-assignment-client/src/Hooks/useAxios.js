import axios from "axios";
// http://localhost:3000
//https://insurance-server-sigma.vercel.app
const axiosInstance = axios.create({
    baseURL: `http://localhost:3000`,
    withCredentials:true
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;