// src/pages/Home.jsx
import Hero from '../components/home/Hero';
import Categories from '../components/home/Categories';
import NearbyPlaces from '../components/home/NearbyPlaces';
import PopularPlaces from '../components/home/PopularPlaces';
import Footer from '../components/common/Footer';

export default function Home() {
  return (
    <div>
      <Hero />
      <Categories />
      <PopularPlaces />
      <NearbyPlaces />
      <Footer />
    </div>
  );
}
