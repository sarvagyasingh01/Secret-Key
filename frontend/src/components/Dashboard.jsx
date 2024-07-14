import React from 'react'
import Navbar from './Navbar'
import Manager from './Manager'
export const URL = import.meta.env.VITE_APP_BACKEND_URL
const Dashboard = () => {
  
  return (
    <>
        <Navbar loggedIn={true}/>
        <Manager />
    </>
  )
}

export default Dashboard