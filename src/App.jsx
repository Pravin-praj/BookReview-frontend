import React from 'react'
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom'
import Login from './Auth/Login'
import SignUp from './Auth/SignUp'
import AdminDashboard from './Admin/AdminDashboard'
import UserDashbaord from './User/UserDashbaord'
import BrowseBooks from './User/BrowseBooks'
import MyReviews from './User/MyReviews'
import Profile from './User/Profile'
import ManageBooks from './Admin/ManageBooks'
import ManageReviews from './Admin/ManageReviews'
import ManageUsers from './Admin/ManageUsers'
import OAuthSuccess from './Auth/OAuthSuccess'
import {ToastContainer} from 'react-toastify'
function App() {
  const token=localStorage.getItem("token")
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <Router>
        <Routes>

          <Route path="/signup" element={<SignUp />}/>
          <Route path="/" element={token ? (localStorage.getItem("role")==="ADMIN" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/dashboard" />) : <Navigate to="/login" />}/>
          <Route path="/login" element={<Login />}/>
         <Route
  path="/admin/dashboard"
  element={
    token && localStorage.getItem("role") ==="ADMIN"
      ? <AdminDashboard />
      : <Navigate to="/login" />
  }
/>

<Route
  path="/admin/books"
  element={
    token && localStorage.getItem("role") ==="ADMIN"
      ? <ManageBooks />
      : <Navigate to="/login" />
  }
/>


<Route
  path="/admin/reviews"
  element={
    token && localStorage.getItem("role") ==="ADMIN"
      ? <ManageReviews />
      : <Navigate to="/login" />
  }
/>

<Route
  path="/admin/users"
  element={
    token && localStorage.getItem("role") ==="ADMIN"
      ? <ManageUsers />
      : <Navigate to="/login" />
  }
/>













<Route
  path="/user/dashboard"
  element={
    token && localStorage.getItem("role") === "USER"
      ? <UserDashbaord />
      : <Navigate to="/login" />
  }
/>

<Route
  path="/user/books"
  element={
    token && localStorage.getItem("role") === "USER"
      ? <BrowseBooks />
      : <Navigate to="/login" />
  }
/>

<Route
  path="/user/reviews"
  element={
    token && localStorage.getItem("role") === "USER"
      ? <MyReviews />
      : <Navigate to="/login" />
  }
/>


<Route
  path="/profile"
  element={
    token && localStorage.getItem("role") === "USER"
      ? <Profile />
      : <Navigate to="/login" />
  }
/>



<Route
    path="/oauth-success"
    element={<OAuthSuccess />}
/>


        </Routes>
      </Router>
    </div>
  )
}

export default App
