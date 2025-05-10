import React from 'react';
import bgImage from '../../assets/bg.png';

const Background = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        filter: 'blur(7px)',
        zIndex: -1,
      }}
    />
  );
};

export default Background; 