import React, { useState, useEffect } from 'react';
import './HardGearPage.scss';

function HardGearPage() {
  const [currentProduct, setCurrentProduct] = useState(0);

  const products = [
    {
      imageUrl: "https://th.bing.com/th/id/OIP.ygNV7tb3h7b95Hp8QalgMQHaE8?rs=1&pid=ImgDetMain",
      description: "Advanced Hiking Shoes"
    },
    {
      imageUrl: "https://thehikingadventure.com/wp-content/uploads/2022/02/Mountaineering-tents-on-snow-425-%C3%97-630-px-945-%C3%97-630-px.jpg",
      description: "Mountaineering Tent"
    },
    {
      imageUrl: "https://th.bing.com/th/id/R.6bd8cce36294156cb599a9f6d848a02d?rik=5RcqsiiN2ZNSXw&pid=ImgRaw&r=0",
      description: "Crampons"
    },
     
    {
      imageUrl: "https://th.bing.com/th/id/R.176aaa0f4c441ebecda167d38682311c?rik=JixLAjqgntiHMw&pid=ImgRaw&r=0",
      description: "GPS Device "
    },
    {
      imageUrl: "https://cdn.shopify.com/s/files/1/1095/7170/products/PariaOutdoorProducts-Arches2PProductPhoto3_1800x1800.jpg?v=1637728928",
      description: "Emergency Shelter"
    }



    
  ];

  const nextProduct = () => {
    setCurrentProduct((currentProduct + 1) % products.length);
  };

  const prevProduct = () => {
    setCurrentProduct((currentProduct - 1 + products.length) % products.length);
  };

  useEffect(() => {
    const interval = setInterval(nextProduct, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, [currentProduct]);

  return (
    <div className="easy-gear-container">
      <div className="image-container">
        <img src={products[currentProduct].imageUrl} alt={products[currentProduct].description} />
        <p className="description">{products[currentProduct].description}</p>
       
      </div>
    </div>
  );
}

export default HardGearPage;
