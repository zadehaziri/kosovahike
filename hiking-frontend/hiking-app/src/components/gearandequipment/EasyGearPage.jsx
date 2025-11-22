import React, { useState, useEffect, useCallback } from "react";
import "./EasyGearPage.scss";

function EasyGearPage() {
  const [currentProduct, setCurrentProduct] = useState(0);

  const products = [
    {
      imageUrl:
        "https://www.tripsavvy.com/thmb/uYeDT5vhuuTVumqt3TtKJaBmLM0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/spain--navarra--bardenas-reales--hiking-shoes-of-young-woman-in-nature-park--close-up-697554917-93aaa9598178443a89d0fd501d6f7875.jpg",
    },
    {
      imageUrl:
        "https://th.bing.com/th/id/OIP.F5w8mtNjbnztmxf9IWcT5AHaE8?rs=1&pid=ImgDetMain",
    },
    {
      imageUrl:
        "https://th.bing.com/th/id/R.cc95c44c65cfe97140d7432f750db177?rik=I0lbaAY0bp5j5A&pid=ImgRaw&r=0",
    },
    {
      imageUrl:
        "https://th.bing.com/th/id/OIP.9GnXGpgg-9fZnZE3N-G5ewHaHa?w=2000&h=2000&rs=1&pid=ImgDetMain",
    },
    {
      imageUrl:
        "https://freedesignfile.com/upload/2017/06/Climbers-in-snow-Stock-Photo.jpg",
    },
  ];

  const nextProduct = useCallback(() => {
    setCurrentProduct((prev) => (prev + 1) % products.length);
  }, [products.length]);

  useEffect(() => {
    const interval = setInterval(nextProduct, 4000);
    return () => clearInterval(interval);
  }, [nextProduct]);

  return (
    <div className="easy-gear-container">
      <div className="image-container">
        <img src={products[currentProduct].imageUrl} alt="Hiking gear equipment" />
      </div>
    </div>
  );
}

export default EasyGearPage;
