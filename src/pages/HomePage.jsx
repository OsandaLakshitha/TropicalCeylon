import React from 'react';
import Header from '../components/Header';
import FeaturedHotels from '../components/FeaturedHotels';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import Particles from '../components/Particles';
import GridDistortion from '../components/GridDistortionWithText';
import ChromaGrid from '../components/ChromaGrid ';
import CircularGallery from '../components/CircularGallery'
import InfiniteMenu from '../components/InfiniteMenu'

const items = [
  {
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=300&fit=crop",
    title: "Ocean Breeze Resort",
    subtitle: "Kandy, Sri Lanka",
    handle: "@oceanbreeze",
    borderColor: "#3B82F6",
    gradient: "linear-gradient(145deg, #3B82F6, #000)",
    url: "https://github.com/sarahjohnson"
  },
  {
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=300&fit=crop",
    title: "Ocean Breeze Resort",
    subtitle: "Kandy, Sri Lanka",
    handle: "@oceanbreeze",
    borderColor: "#3B82F6",
    gradient: "linear-gradient(145deg, #3B82F6, #000)",
    url: "https://github.com/sarahjohnson"
  },
  {
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=300&h=300&fit=crop&q=80",
    title: "Mike Chen",
    subtitle: "Backend Engineer",
    handle: "@mikechen",
    borderColor: "#10B981",
    gradient: "linear-gradient(180deg, #10B981, #000)",
    url: "https://linkedin.com/in/mikechen"
  }
];

const demoItems = [
  { link: '#', text: 'Kandy', image: 'https://images.unsplash.com/photo-1559372122-1a97b2d22c22?w=900&h=200&fit=crop' },
  { link: '#', text: 'Anuradhapura', image: 'https://plus.unsplash.com/premium_photo-1697729579479-e8a3be6ccf98?w=900&h=200&fit=crop' },
  { link: '#', text: 'Yala', image: 'https://images.unsplash.com/photo-1709727442097-00396fe9a278?w=900&h=200&fit=crop' },
  { link: '#', text: 'Jaffna', image: 'https://images.unsplash.com/photo-1626046126504-2c2dc647d718?w=900&h=200&fit=crop' }
];

const Circleitems = [
  {
    image: 'https://picsum.photos/300/300?grayscale',
    link: 'https://google.com/',
    title: 'Item 1',
    description: 'This is pretty cool, right?'
  },
  {
    image: 'https://picsum.photos/400/400?grayscale',
    link: 'https://google.com/',
    title: 'Item 2',
    description: 'This is pretty cool, right?'
  },
  {
    image: 'https://picsum.photos/500/500?grayscale',
    link: 'https://google.com/',
    title: 'Item 3',
    description: 'This is pretty cool, right?'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale',
    link: 'https://google.com/',
    title: 'Item 4',
    description: 'This is pretty cool, right?'
  }
];

const HomePage = () => {
  return (
    <div>
        <Header />
        <Particles/>
        <Testimonials />
        <div className="px-6 py-12 bg-gray-50">
          {/* Big Heading */}
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
            Featured Hotels
          </h1>
          {/* Chroma Grid */}
          <div style={{ height: 'auto', position: 'relative' }}>
            <ChromaGrid
              items={items}
              radius={500}
              damping={0.1}
              fadeOut={0.6}
              ease="power3.out"
            />
          </div>
        </div>
        <GridDistortion />
        <div style={{ height: '600px', position: 'relative' }}>
          <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} />
        </div>
        <Footer />
    </div>
  );
};

export default HomePage;