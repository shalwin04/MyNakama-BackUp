// import {BrowserRouter} from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import ChatInterface from './ChatInterface';
import Login from './Login';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import Journal from './journalpages/Journal';
import ProtectedRoute from './ProtectedRoute';
import Blogs from './Blogs';
import ProfilePage from './ProfilePage';
import SignupSuccess from './SignupSuccess';

const AllRoutes = () => {
    return (
        // <Routes>
        //     <Route path="/" element={<Login />} />
        //     {/* <Route path='/trynow' element={<LoginPage/>} /> */}
        //     <ProtectedRoute path="/chat" element={<ChatInterface />} />
        //     <ProtectedRoute path="/journal" element={<Journal />} />
        //     <Route path='/login' element={<LoginForm/>} />
        //     <Route path='/signup' element={<SignupForm/>} />
        //     {/* <Route path='/chat' element={<ChatInterface />} /> */}
        //     {/* <Route path='/journal' element={<Journal/>}/> */}
        // </Routes>
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path='/signup' element={<SignupForm/>}/>
                <Route path="/" element={<Login />} />
                <Route path="/signupsuccess" element={<SignupSuccess />} />
                <Route path='/blogs' element={<Blogs/>}/>
                {/* <Route path="/journal" element={<Journal/>}/> */}
                <Route 
                    path="/journal" 
                    element={
                        <ProtectedRoute>
                            <Journal />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/chat" 
                    element={
                        <ProtectedRoute>
                            <ChatInterface />
                        </ProtectedRoute>
                    } 
                />
                <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            </Routes>

    );
}

export default AllRoutes;