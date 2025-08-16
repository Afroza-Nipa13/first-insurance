import React from 'react';
import { createBrowserRouter } from 'react-router';
import MainLayOuts from '../LayOuts/MainLayOuts';
import AuthLayOuts from '../LayOuts/AuthLayOuts';
import Login from '../Authentication/Login/Login';
import Register from '../Authentication/Register/Register';
import DashboardLayOut from '../LayOuts/DashboardLayOut';
import Home from '../Pages/Home/Home';
import Coverage from '../Component/Coverage/Coverage';

import AllPolicies from '../Component/AllPolicies/AllPolicies';
import PolicyDetails from '../Component/AllPolicies/PolicyDetails';
import QuotePage from '../Component/AllPolicies/QuotePage';
import PrivetRoutes from './PrivetRoutes';
import ApplicationForm from '../Component/AppicationForm/ApplicationForm';
import MyPolicies from '../Component/Dashboard/MyPolicies/MyPolicies';
import AllApplications from '../Component/AllApplications/AllApplications';
import AboutUs from '../Component/AboutUs/AboutUs';
import PaymentStatus from '../Component/Dashboard/PaymentStatus/PaymentStatus';
import PaymentForm from '../Component/Dashboard/PaymentForm/PaymentForm';
import AssignedCustomers from '../Component/Dashboard/AssignedCustomers/AssignedCustomers';
import ManageBlogs from '../Component/Dashboard/ManageBlogs/ManageBlogs';
import ManageUsers from '../Component/ManageUsers/ManageUsers';
import ManagePolicies from '../Component/Dashboard/ManagePolicies/ManagePolicies';
import EditPolicy from '../Component/Dashboard/ManagePolicies/EditPolicy';
import ManageTransaction from '../Component/Dashboard/ManageTransaction/ManageTransaction';
import ProfilePage from '../Pages/Home/ProfilePage/ProfilePage';
import Blogs from '../Pages/Blogs/Blogs';
import Agents from '../Pages/Agents/Agents';
import BlogDetails from '../Pages/Blogs/BlogDetails';
import LatestBlogs from '../Pages/Home/LatestBlogs/LatestBlogs';
import NewsLetter from '../Pages/Home/NewsLetter/NewsLetter';
import MeetOurAgents from '../Pages/Home/OurAgents/MeetOurAgents';
import FaqPage from '../Pages/Home/FaqPage/FaqPage';
import DashHome from '../Pages/Dashboard/DashboardHome/Banner/DashHome';
import Error from '../Shared/Error';
import ForbiddenPage from '../Shared/ForbiddenPage';
import AdminRoute from './AdminRoute';
import AdminAgentRoute from './AdminAgentRoute';
import AgentRoute from './AgentRoute';
import ApprovedUsers from '../Component/Dashboard/AdminMenu/ApprovedUsers/ApprovedUsers';
import LoadingSpinner from '../Shared/LoadingSpinner';



export const router = createBrowserRouter([
    {
        path: '/',
        Component: MainLayOuts,
        hydrateFallbackElement:<LoadingSpinner/>,
        errorElement: <Error />,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: 'coverage',
                Component: Coverage
            },
            {
                path: 'about-us',
                Component: AboutUs
            },
            {
                path: 'all-policies',
                Component: AllPolicies
            },
            {
                path: 'all-policies/:id',
                element: <PolicyDetails></PolicyDetails>
            },
            {
                path: '/quote/:id',
                element: <PrivetRoutes><QuotePage />
                </PrivetRoutes>
            },
            {
                path: '/application-form/:id',
                element: <PrivetRoutes>
                    <ApplicationForm></ApplicationForm>
                </PrivetRoutes>
            },
            {
                path: 'blogs',
                Component: Blogs
            },
            {
                path: 'blogs/:id',
                Component: BlogDetails
            },
            {
                path: 'latest-blogs',
                Component: LatestBlogs
            },
            {
                path: 'agents',
                Component: Agents
            },
            {
                path: 'newsletter',
                Component: NewsLetter
            },
            {
                path: 'our-agents',
                Component: MeetOurAgents
            },
            {
                path: 'faqs',
                Component: FaqPage
            }


        ]

    },
    {

        path: '/',
        Component: AuthLayOuts,
        children: [

            {
                path: 'login',
                Component: Login
            },
            {
                path: 'register',
                Component: Register
            },


        ]

    },
    {
        path: '/dashboard',
        element: <PrivetRoutes>
            <DashboardLayOut></DashboardLayOut>
        </PrivetRoutes>,
        children: [
            {
                index: true,
                element: <DashHome></DashHome>
            },
            {
                path: 'my-policies',
                element: <MyPolicies></MyPolicies>
            },
            {
                path: 'admin/all-applications',
                element: <AdminRoute>
                    <AllApplications />
                </AdminRoute>
            },
            {
                path: 'payment-status',
                element: <PaymentStatus></PaymentStatus>
            },
            {
                path: 'payment-form/:id',
                element: <PaymentForm></PaymentForm>
            },
            {
                path: 'agent/assigned-customers',
                element: <AgentRoute>
                    <AssignedCustomers></AssignedCustomers>
                </AgentRoute>
            },
            {
                path:'agent/approved-customers',
                element:<AgentRoute>
                    <ApprovedUsers></ApprovedUsers>
                </AgentRoute>
            },
            {
                path: 'agent/manage-blogs',
                element: <AdminAgentRoute>
                    <ManageBlogs></ManageBlogs>
                </AdminAgentRoute>
            },
            {
                path: 'admin/manage-users',
                element: <AdminRoute>
                    <ManageUsers></ManageUsers>
                </AdminRoute>
            },
            {
                path: 'admin/manage-policies',
                element: <AdminRoute>
                    <ManagePolicies></ManagePolicies>
                </AdminRoute>
            },
            {
                path: 'admin/edit-policy/:id',
                element: <AdminRoute>
                    <EditPolicy></EditPolicy>
                </AdminRoute>,
            },
            {
                path: 'admin/manage-transaction',
                element: <AdminRoute>
                    <ManageTransaction></ManageTransaction>
                </AdminRoute>
            },
            {
                path: 'profilePage',
                element: <PrivetRoutes>
                    <ProfilePage></ProfilePage>
                </PrivetRoutes>
            }


        ]
    },
    {
        path: '*',
        element: <Error></Error>
    },
    {
        path: '/forbidden',
        element: <ForbiddenPage></ForbiddenPage>
    }




])


