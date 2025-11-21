import React, { useState, useEffect } from 'react';
import './ModerateGearPage.scss';

function ModerateGearPage() {
  const [currentProduct, setCurrentProduct] = useState(0);

  const products = [
    {
      imageUrl: "https://th.bing.com/th/id/OIP.8PB9B1medeZrHn8F34TMhQHaE8?rs=1&pid=ImgDetMain",
      description: "Intermediate Climbing Shoes"
    },
    {
      imageUrl: "https://www.station13.co.uk/uploads/4/4/0/7/44077043/s510030507336046152_p35_i24_w2560.jpeg",
      description: "Lightweight Tent"
    },
    {
      imageUrl: "https://th.bing.com/th/id/R.6b387437151e01d1e7a217dc242dbfb9?rik=3pvGW9TTLP5Y4Q&pid=ImgRaw&r=0",
      description: "Sleeping Bag"
    },
     
    {
      imageUrl: "https://th.bing.com/th/id/OIP.K9ob7-noZTahdLSm76yaGQHaE8?rs=1&pid=ImgDetMain",
      description: "Hiking Boots"
    },
    {
      imageUrl: "https://images-na.ssl-images-amazon.com/images/I/81fR-ZZURxL.jpg",
      description: "Cooking Set"
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

export default ModerateGearPage;
