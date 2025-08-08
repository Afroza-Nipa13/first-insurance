import React from 'react';
import { useNavigate } from 'react-router';
import Lottie from 'lottie-react';
import errorAnimation from "../assets/lottie/error.json"

const Error = () => {
    const navigate= useNavigate()
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 text-center p-6">
            <div className="max-w-md w-full">
                <Lottie animationData={errorAnimation} loop={true} className="w-full h-80" />
                <h1 className="text-4xl font-bold text-error mb-4">Oops! Page Not Found</h1>
                <p className="mb-6 text-gray-600">
                    The page you’re looking for doesn’t exist or has been moved.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="btn btn-primary btn-wide"
                >
                    Go Back Home
                </button>
            </div>
        </div>
    );
};

export default Error;