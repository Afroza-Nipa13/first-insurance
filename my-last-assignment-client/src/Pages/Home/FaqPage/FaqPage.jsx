import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router";
import faq from '../../../assets/faq.jpg'
import { Helmet } from "react-helmet-async";


const faqs = [
    {
        question: "What types of insurance policies do you offer?",
        answer: "We offer a variety of policies including life, health, education, and retirement insurance."
    },
    {
        question: "How can I apply for an insurance policy?",
        answer: "You can apply through our online application form or visit one of our authorized agents."
    },
    {
        question: "Can I cancel my policy anytime?",
        answer: "Yes, policies can be canceled anytime, although terms and refund eligibility may vary."
    },
    {
        question: "Is my personal information safe?",
        answer: "Absolutely. We use modern encryption and data protection practices to keep your data secure."
    }
];

const FaqPage = () => {
    const navigate = useNavigate();
    return (
        <section className="px-4 pt-26 pb-10 mx-auto text-end space-y-5 max-w-4xl lg:px-8">
            <Helmet>
                <title>FAQ | FIRST Life Insurance </title>
                <meta name="description" content="Welcome to FIRST Life Insurance - Your trusted partner in securing your future." />
            </Helmet>
            <h2 className="text-gray-600 text-5xl font-bold text-center mb-16 divider">Frequently <span className="text-primary">Asked </span> Questions</h2>
            <div
                data-aos="fade-up"
                data-aos-duration="3000"
                className="flex flex-col md:flex-row gap-4 p-8 rounded-2xl border border-gray-300">
                <div className="flex-1 mt-28 w-full">
                    <img src={faq} alt="" />
                </div>
                <div className="space-y-4 text-right flex-1">
                    {faqs.map((faq, index) => (
                        <Disclosure key={index}>
                            {({ open }) => (
                                <div className="border border-gray-200 rounded-xl shadow-md overflow-hidden">
                                    <Disclosure.Button className="flex justify-between items-center w-full px-6 py-4 text-left text-lg font-medium text-gray-500 hover:bg-gray-100 transition">
                                        <span>{faq.question}</span>
                                        <ChevronUpIcon
                                            className={`w-5 h-5 transition-transform duration-300 ${open ? "rotate-180 text-primary" : "rotate-0"
                                                }`}
                                        />
                                    </Disclosure.Button>
                                    <Disclosure.Panel className="px-6 pb-4 text-gray-600">
                                        {faq.answer}
                                    </Disclosure.Panel>
                                </div>
                            )}
                        </Disclosure>
                    ))}


                </div>

            </div>
            <button
                onClick={() => navigate('/')}
                className="mt-8 inline-flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
            >
                Back to Home
            </button>

        </section>
    );
};

export default FaqPage;
