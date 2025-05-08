import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import useAuthStore from '../store/authstore'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

function App() {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore()
  
  useEffect(() => {
    checkAuth();
  }, []);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
      <Loader className="size-10 animate-spin" />
    </div>
    );
  return (
    <>
    <Routes>
      <Route path='/' element={authUser ? <HomePage/> : <Navigate to={"/login"}/>} />
      <Route path='/signup' element={!authUser ? <SignupPage/> : <Navigate to={"/"}/>} />
      <Route path='/login' element={! authUser ? <LoginPage/> : <Navigate to={"/"}/>} />
    </Routes>
    <Toaster/>
    </>
    )
}

export default App