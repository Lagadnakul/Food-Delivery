import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="logo-container">
          <img src={assets.HH_logo} className="logo" alt="Hunger Hive" />
        </div>
        
        <div className="profile-container">
          <button className="profile-btn">
            <img src={assets.profile_image} className="profile" alt="Profile" />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar