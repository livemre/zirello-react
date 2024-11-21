import { useEffect, useState } from "react";
import HomeCarouselItem from "./HomeCarouselItem";

const HomeCarousel = () => {
  const [imgIndex, setImgIndex] = useState<number>(0);
  const [animate, setAnimate] = useState<boolean>(false); // Animasyon durumu

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

  const getIndex = (index: number) => {
    setAnimate(false); // Animasyonu sıfırla
    setTimeout(() => {
      setImgIndex(index); // Yeni resim yüklendiğinde güncelle
      setAnimate(true); // Animasyonu başlat
    }, 100); // Hafif bir gecikme veriyoruz
  };

  useEffect(() => {
    setAnimate(true); // İlk renderda animasyon olsun
  }, []);

  return (
    <div className="flex flex-col-reverse  h-full gap-1 justify-between  my-5 container mx-auto xl:max-w-[1140px] lg:max-w-[1100px] md:max-w-[720px] sm:max-w-[540px] lg:flex-row ">
      <HomeCarouselItem getIndex={getIndex} />
      <img
        src={imgItems[imgIndex].url}
        className={`w-full h-full   rounded-md transform transition-transform duration-600  mb-5 lg:w-[700px] lg:pl-[20px]  ${
          animate ? "opacity-100  scale-100" : "opacity-10  scale-50"
        }`}
      />
    </div>
  );
};

export default HomeCarousel;
