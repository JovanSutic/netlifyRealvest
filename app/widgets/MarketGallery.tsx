import { useState } from "react";
import ChevronLeft from "../components/chevron/ChevronLeft";
import ChevronRight from "../components/chevron/ChevronRight";
import { PhotoItem } from "../types/market.types";

const setLimit = (device: string): number => {
  if (device === "mobile") return 1;
  if (device === "tablet") return 3;

  return 5;
};

const Gallery = ({ photos, device }: { photos: PhotoItem[], device: string }) => {
  const limit = setLimit(device);
  const [galleryPhotos, setGalleryPhotos] = useState<PhotoItem[]>(
    photos?.slice(0, limit)
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalPhoto, setModalPhoto] = useState<PhotoItem>();

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex + 1 > photos.length - 1 ? 0 : prevIndex + 1;
    });
    setGalleryPhotos(() => {
      const current =
        currentIndex + 1 > photos.length - 1 ? 0 : currentIndex + 1;
      if (current + limit > photos.length) {
        const range = photos.length - current;
        const start = range > 0 ? photos.slice(-range) : [];
        const end = range > limit - 1 ? [] : photos.slice(0, limit - range);
        return [...start, ...end];
      }

      return photos.slice(current, current + limit);
    });
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex - 1 < 0 ? photos.length - 1 : prevIndex - 1;
    });
    setGalleryPhotos(() => {
      const current =
        currentIndex - 1 < 0 ? photos.length - 1 : currentIndex - 1;
      if (current + limit > photos.length) {
        const range = photos.length - current;
        const start = range > 0 ? photos.slice(-range) : [];
        const end = range > limit - 1 ? [] : photos.slice(0, limit - range);
        return [...start, ...end];
      }

      return photos.slice(current, current + limit);
    });
  };

  const handleModalNext = () => {
    setModalPhoto((prevPhoto) => {
      const currentIndex = photos.findIndex((item) => prevPhoto?.id === item.id);
      const nextIndex =
        currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
      return photos[nextIndex];
    });
  };

  const handleModalPrevious = () => {
    setModalPhoto((prevPhoto) => {
      const currentIndex = photos.findIndex((item) => prevPhoto?.id === item.id);
      const nextIndex =
        currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
      return photos[nextIndex];
    });
  };

  const handlePhotoClick = (photo: PhotoItem) => {
    setModalPhoto(photo);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="w-full relative">
      <div className="w-full relative min-h-[260px] md:min-h-[100%]">
        <ChevronLeft
          onClick={handlePrevious}
          style={`absolute top-[calc(50%-17px)] left-[4px] ${
            photos.length < limit + 1 && "hidden"
          }`}
        />
        <ChevronRight
          style={`absolute top-[calc(50%-17px)] right-[4px] ${
            photos.length < limit + 1 && "hidden"
          }`}
          onClick={handleNext}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {galleryPhotos.map((photo) => (
            <button key={photo.id} onClick={() => handlePhotoClick(photo)}>
              <img
                alt=""
                src={photo.link}
                className="object-cover cursor-pointer rounded-xl"
              />
            </button>
          ))}
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center z-[9999] justify-center px-2 lg:px-0">
          <div className="relative bg-white p-6 py-10 rounded shadow-lg">
            <button
              onClick={handleModalClose}
              className="absolute top-1 right-1 p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <ChevronLeft
              onClick={handleModalPrevious}
              style="absolute left-6 top-1/2 transform -translate-y-1/2 p-2"
            />
            <img
              src={modalPhoto?.link}
              alt=""
              className="w-full h-full object-cover rounded-xl"
            />
            <ChevronRight
              onClick={handleModalNext}
              style="absolute right-6 top-1/2 transform -translate-y-1/2 p-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
