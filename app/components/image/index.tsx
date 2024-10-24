import { useEffect, useState } from "react";
import Loader from "../loader";

const ImageLoader = ({ src, type }: { src: string; type: 'card' | 'gallery' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const image = new Image();
    image.src = src;

    image.onload = () => {
      setIsLoading(false);
    };

    image.onerror = () => {
      setError("image not loaded");
      setIsLoading(false);
    };

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [src]);

  if (error) {
    return <div>Error loading image: {error}</div>;
  }

  return (
    <div className={type === 'gallery' ? "min-h-[260px] md:min-h-[160px] relative" : ""}>
      {isLoading ? (
        <Loader open={true} />
      ) : (
        <img
          src={src}
          loading="lazy"
          className={type === 'gallery' ? "object-cover cursor-pointer rounded-xl" : "h-full w-full object-center"}
          alt={type === 'gallery' ? "gallery_photo": "card_photo"}
        />
      )}
    </div>
  );
};

export default ImageLoader;
