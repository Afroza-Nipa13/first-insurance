import React from 'react';
import Logo from '../Logo/Logo';
import { Link } from 'react-router';
import { FaTwitter, FaYoutube, FaFacebook } from 'react-icons/fa';


const Footer = () => {
    return (
        <footer className="footer footer-horizontal footer-center bg-neutral text-neutral-content md:pt-20 p-10">
            <aside>
                <Logo></Logo>
                <p className="font-bold">
                    FIRST Life Insurance Ltd.
                    <br />
                    Providing reliable tech since 2015
                </p>
                <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
            </aside>
            <nav>
                <div className="grid grid-flow-col gap-4 text-2xl text-blue-600">
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-sky-400"
                    >
                        <FaTwitter />
                    </a>
                    <a
                        href="https://www.youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-red-500"
                    >
                        <FaYoutube />
                    </a>
                    <a
                        href="https://web.facebook.com/groups/targetwebdevcareer/media?_rdc=1&_rdr#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-800"
                    >
                        <FaFacebook />
                    </a>
                </div>
            </nav>
        </footer >
    );
};

export default Footer;


