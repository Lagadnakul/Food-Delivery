import React from 'react'
import HeroSection from '../components/HeroSection/HeroSection'
import SearchSection from '../components/SearchSection/SearchSection'
import MenuCategories from '../components/MenuCategories/MenuCategories'
import PopularRestaurants from '../components/PopularRestaurants/PopularRestaurants'

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <SearchSection />
      <div className="container-padding">
        <MenuCategories />
        <PopularRestaurants />
      </div>
    </div>
  )
}

export default Home