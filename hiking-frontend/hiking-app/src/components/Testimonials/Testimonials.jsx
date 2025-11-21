import React from 'react';
import './Testimonials.scss';

const generateRandomDescription = () => {
  const descriptions = [
    'I love this page because of its amazing features and user-friendly interface. It has made my life so much easier!',
    'This page has helped me tremendously in my daily tasks. Highly recommended! The support team is also very responsive.',
    "The content on this page is top-notch. I can't get enough of it! I've learned so much from this platform.",
    "I've never seen a better page than this. 5 stars all the way! The community here is also very supportive.",
    'This page is a game-changer. It has everything I need and more. The design is beautiful and intuitive.',
  ];
  const randomIndex = Math.floor(Math.random() * descriptions.length);
  return descriptions[randomIndex];
};

const Testimonials = () => {
  const generateStarRating = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<span key={i}>&#9733;</span>);
    }
    return stars;
  };

  // Testimonials data
  const testimonials = [
    {
      name: 'John Doe',
      rating: 5,
      image:
        'https://th.bing.com/th/id/OIP.WQvPJdjEpvh8OTXB-NBfJwHaHw?rs=1&pid=ImgDetMain',
    },
    {
      name: 'Jan Smith',
      rating: 4,
      image:
        'https://social-dna.de/wp-content/uploads/2018/04/social_dna_carmelo_russo.jpg',
    },
    {
      name: 'Allen Johnson',
      rating: 5,
      image:
        'https://bs-uploads.toptal.io/blackfish-uploads/talent/profile/picture_file/picture/1042111/huge_2cc12e05da390127a1037bc868856a67-94f19739f6324fe345ce0978585850ab.jpg',
    },
  ];

  return (
    <div className='testimonials-section'>
      <center>
        {' '}
        <h2>Users Testimonials</h2>
      </center>
      <div className='testimonials-container'>
        {testimonials.map((testimonial, index) => (
          <div className='testimonial' key={index}>
            <img
              src={testimonial.image}
              alt='User Icon'
              className='user-icon'
            />
            <div className='content'>
              <p className='quote'>{generateRandomDescription()}</p>
              <div className='rating'>
                {generateStarRating(testimonial.rating)}
              </div>
              <p className='author'>- {testimonial.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
