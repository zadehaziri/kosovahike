import React, { useState, useMemo, useEffect } from "react";
import { App } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { config } from "../../config";
import "./Gear.scss";
import RelatedArticles from "./../../pages/gear/articlesGear.jsx";
import gearImage1 from "../../assets/images/gear01.png";
import gearImage2 from "../../assets/images/gear02.png";
import gearImage3 from "../../assets/images/gear03.png";
import gearImage4 from "../../assets/images/gear04.png";
import gearImage5 from "../../assets/images/gear05.png";
import gearImage6 from "../../assets/images/gear06.png";
import gearImage7 from "../../assets/images/gear07.png";
import gearImage8 from "../../assets/images/gear08.png";
import gearImage9 from "../../assets/images/gear09.png";
import gearImage10 from "../../assets/images/gear10.png";
import gearImage11 from "../../assets/images/gear11.png";
import gearImage12 from "../../assets/images/gear12.png";
import gearImage13 from "../../assets/images/gear13.png";
import gearImage14 from "../../assets/images/gear14.png";
import ChatHelper from "../../components/ChatHelper/chathelper";

function GearShop() {
  const { message } = App.useApp();
  const userId = useSelector((state) => state.loggedUser.user?._id);
  const [searchCourse, setSearchCourse] = useState("");
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Cart functionality with API
  const addToCart = async (product) => {
    if (!userId) {
      message.warning('Please login to add products to cart');
      return;
    }

    try {
      const response = await axios.post(
        `${config.BASE_URL}/users/${userId}/cart`,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl
        }
      );

      if (response.status === 200) {
        const existingItem = response.data.find(item => item.productId === product.id);
        if (existingItem && existingItem.quantity > 1) {
          message.success(`${product.name} quantity updated in cart!`);
        } else {
          message.success(`${product.name} added to cart!`);
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      message.error(error.response?.data?.error || 'Failed to add product to cart');
    }
  };

  const categories = [
    {
      products: [
        {
          id: 1,
          name: "NORTIV 8 Men's Hiking Boots",
          price: 53.99,
          details: [
            "Sole material: Rubber",
            "Outer material: Leather & Mesh",
            "Closure type: Lace-Up",
            "Water resistance level: Water Resistant"],
          imageUrl: gearImage1,
        },
        {
          id: 2,
          name: "CC-Los Women's Waterproof H-Shoes",
          price: 56.99,
          details: [
            "Care instructions: Machine Wash",
            "Sole material: MD+TPR",
            "Outer material: Polyurethane+Mesh",
            "Closure type: Pull-On",
          ],
          imageUrl: gearImage2,
        },
        {
          id: 4,
          name: "SOBASO M/W Water Shoes ",
          price: 33.99,
          details: [
            "Care instructions: Machine Wash",
            "Fabric type: Synthetic EVA & Rubber",
            "Outer material: Mesh",
            "Sole material: Rubber",
          ],
          imageUrl: gearImage4,
        },
        {
          id: 5,
          name: "INOXTO 40L Hiking Backpack",
          price: 129.99,
          details: [
            "Color: Khaki, Unisex",
            "Outer material: MD+TPR",
            "Closure type: Lace-Up",
            "Water resistance level: Water Resistant with Rainy Cover",
          ],
          imageUrl: gearImage5,
        },
        {
          id: 6,
          name: "Men's Sport Fleece Hoodie Jacket",
          price: 42.99,
          details: [
            "Fabric type: Polyester",
            "Care instructions: Hand Wash Only",
            "Closure type: Zipper",
            "Closure type: Imported",
          ],
          imageUrl: gearImage6,
        },
        {
          id: 7,
          name: "Featherstone Backpacking Tent",
          price: 104.99,
          details: [
            "Brand: Featherstone",
            "Design: Camping Tent",
            "Material: Sil-Nylon Ripstop PU with a water pressure rating of 5000 mm",
            "Recommended Uses: Camping & Hiking",
            'Product Dimensions: 14"L x 4"W x 4"H',
            "Special Features: Water-Resistant, Rain-cover, Windproof, UV Protection, Lightweight",
          ],
          imageUrl: gearImage7,
        },
      ],
    },
    {
      title: "",
      products: [
        {
          id: 8,
          name: "Survival Paracord Bracelet- Gear Kit",
          price: 39.98,
          details: [
            "Multitools: Tactical Emergency Gear Kit",
            "SOS LED Light, 550 Grade, Adjustable",
            "Multitools, Fire Starter, Compass",
            "Brand: Nexfinity One",
            "Item Weight:3 Ounces",
          ],
          imageUrl: gearImage8,
        },
        {
          id: 9,
          name: "TOBTOS Lightweight Portable Chair",
          price: 38.99,
          details: [
            "Support Heavy Duty: 440 lbs",
            "Brand: TOBTOS",
            "Back Style: Solid Back",
            "Material: Aluminium",
          ],
          imageUrl: gearImage9,
        },
        {
          id: 10,
          name: "PTEROMY Hooded Rain Poncho",
          price: 18.99,
          details: [
            "Fabric type: Polyester",
            "Care instructions: Hand Wash Only",
            "Origin: Imported",
            "Country of Origin: China",
          ],
          imageUrl: gearImage10,
        },
        {
          id: 11,
          name: "Trekology Trek-Z Collapsible Hiking ",
          price: 43.99,
          details: [
            "Brand: TREKOLOGY",
            "Color: Gray",
            "Description: Collapsible Nordic H-Poles",
            "Shaft Material: Aluminum",
            "Extended Length: 130 Centimeters",
          ],
          imageUrl: gearImage11,
        },
        {
          id: 12,
          name: "HydraPak Seeker - (3L/100oz)",
          price: 26.62,
          details: [
            "Brand: HydraPak",
            "Material: Ultra-Durable TPU/ HDPE/ Silicone",
            "Color: Sutro Green",
            "Capacity: 3 Liters",
            "Special Feature: Filter",
          ],
          imageUrl: gearImage12,
        },
        {
          id: 13,
          name: "VEITORLD Cool Gadgets Survival Tools",
          price: 26.99,
          details: [
            "Color: Black",
            "Material: Stainless Steel",
            "Brand: Veitorld",
            "Included Components:",
            "Hammer, Sheath, Knife",
            "Number of Pieces: 1",
          ],
          imageUrl: gearImage13,
        },
        {
          id: 14,
          name: "Camping Sleeping Pads",
          price: 129.99,
          details: [
            "Special Feature: Inflatable, Portable",
            "Brand: LILTSDRAE",
            'Product Dimensions: 78"L x 29"W x 5"Th',
            "Included Components: self-inflating-sleeping-pads",
            "Model Name: self-inflating-sleeping-pads",
            "Product Care Instructions: Hand Wash Only",
          ],
          imageUrl: gearImage14,
        },
      ],
    },
  ];

  // Combine all products from all categories
  const allProducts = useMemo(() => {
    return categories.flatMap(category => category.products || []);
  }, []);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) =>
      product && product.name &&
      product.name.toLowerCase().includes(searchCourse.toLowerCase())
    );
  }, [allProducts, searchCourse]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchCourse]);

  // Hide nav bar when modal is open
  useEffect(() => {
    if (expandedProductId) {
      document.body.classList.add('modal-open');
      document.querySelector('.navContainer')?.classList.add('hidden');
    } else {
      document.body.classList.remove('modal-open');
      document.querySelector('.navContainer')?.classList.remove('hidden');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
      document.querySelector('.navContainer')?.classList.remove('hidden');
    };
  }, [expandedProductId]);

  const handleSearchChange = (event) => {
    setSearchCourse(event.target.value);
  };

  const toggleDetails = (productId) => {
    setExpandedProductId((prevExpandedId) =>
      prevExpandedId === productId ? null : productId
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="gear-shop">
      <div className="gear-header">
        <div className="main-container">
          <h1 className="gear-page-title">Best Hiking Gear</h1>
          <p className="gear-page-subtitle">Discover premium equipment for your next adventure</p>
          <div className="gear-search-bar">
            <input
              type="text"
              placeholder="Search for Hiking Products by name ..."
              value={searchCourse}
              onChange={handleSearchChange}
              className="gear-search-input"
            />
          </div>
        </div>
      </div>

      <div className="main-container">
        <div className="products-grid-container">
          <div className="products-grid">
            {currentProducts.map((product) => (
              <div key={product.id} className="product-item">
                <img src={product.imageUrl} alt={product.name} />
                <h3>{product.name}</h3>
                <p>${product.price}</p>
                <div className="button-container">
                  <button
                    className="more-info-button"
                    onClick={() => toggleDetails(product.id)}
                  >
                    <span>{expandedProductId === product.id ? "Less Info" : "More Info"}</span>
                  </button>
                  <button
                    className="buy-button"
                    onClick={() => addToCart(product)}
                  >
                    <span>Add to Cart - ${product.price}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className="pagination-btn next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Product Details Modal */}
      {expandedProductId && (() => {
        const selectedProduct = allProducts.find(p => p.id === expandedProductId);
        if (!selectedProduct) return null;

        return (
          <div className="product-modal-overlay" onClick={() => toggleDetails(null)}>
            <div className="product-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => toggleDetails(null)}>
                ×
              </button>
              <div className="modal-content">
                <div className="modal-image">
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.name} />
                </div>
                <div className="modal-info">
                  <h2>{selectedProduct.name}</h2>
                  <p className="modal-price">${selectedProduct.price}</p>
                  <div className="modal-details">
                    <h3>Product Details</h3>
                    <ul>
                      {selectedProduct.details.map((detail, index) => (
                        <li key={index}>
                          <span className="detail-icon">✓</span>
                          <span className="detail-text">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    className="modal-buy-button"
                    onClick={() => {
                      addToCart(selectedProduct);
                      toggleDetails(null);
                    }}
                  >
                    Add to Cart - ${selectedProduct.price}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <RelatedArticles />
      <ChatHelper />
    </div>
  );
}

export default GearShop;
