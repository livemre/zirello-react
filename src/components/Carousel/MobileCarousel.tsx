import React, { useState } from "react";

const MobileCarousel = () => {
  const imgItems = [
    {
      id: 0,
      url: "https://images.ctfassets.net/rz1oowkt5gyp/3N2U3C71rApm61cGFxnc2E/970b010002488a09a420282df5e7b43a/Carousel_Image_Boards_2x.png?w=1140&fm=webp",
    },
    {
      id: 1,
      url: "https://images.ctfassets.net/rz1oowkt5gyp/4U0VUZYX2tQmB5KVGxBabp/7321ac088fe8ec39dbe3069c47d7df99/Carousel_Image_Lists_2x.png?w=1536&fm=webp",
    },
    {
      id: 2,
      url: "https://images.ctfassets.net/rz1oowkt5gyp/26CA6JZeRgoOK4nuRHnIlY/060702a80cf7c3be3651d9297d196267/Carousel_Image_Cards_2x.png?w=1080",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const handleDragStart = (e: React.MouseEvent) => {
    setDragStartX(e.clientX);
  };

  const handleDragEnd = (e: React.MouseEvent) => {
    if (dragStartX !== null) {
      const dragEndX = e.clientX;
      const dragDistance = dragStartX - dragEndX;

      // Eğer sola sürüklenirse bir sonraki görsele geç
      if (dragDistance > 50 && currentIndex < imgItems.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }

      // Eğer sağa sürüklenirse bir önceki görsele geç
      if (dragDistance < -50 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
    setDragStartX(null);
  };

  return (
    <div className="relative overflow-hidden max-w-full bg-gray-300">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
      >
        {imgItems.map((item) => (
          <div key={item.id} className="min-w-full">
            <img src={item.url} alt={`image-${item.id}`} className="w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileCarousel;
