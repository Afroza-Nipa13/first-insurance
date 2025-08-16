import axios from 'axios';
import React from 'react';
// http://localhost:3000
//https://insurance-server-sigma.vercel.app
const axiosSecure = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials:true
  
});

const useAxiosSecure = () => {
    return axiosSecure;
};

export default useAxiosSecure;