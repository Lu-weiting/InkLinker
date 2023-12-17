import React from 'react';
import './index.css';


const Fave = ({ size, fave }) => {

  const style = {
    width: size,
    height: size,
  };

  const animationClass = fave ? 'fave-ani' : '';

  // 返回JSX
  return <div className={`twitter-fave ${animationClass}`} style={style} />;
};


export default Fave;