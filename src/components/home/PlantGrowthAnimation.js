import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

const PlantGrowthAnimation = () => {
  return (
    <Player
      autoplay
      loop
      src="/Animation.json" // Asegúrate de que esta ruta sea correcta
      style={{ height: '300px', width: '300px' }}
    />
  );
};

export default PlantGrowthAnimation;
