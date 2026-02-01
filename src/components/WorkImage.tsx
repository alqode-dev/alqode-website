import { useState, useCallback } from "react";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
}

const WorkImage = (props: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, []);

  const handleMouseEnter = async () => {
    if (props.video) {
      setIsVideo(true);
      const response = await fetch(`src/assets/${props.video}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setVideo(blobUrl);
    }
  };

  return (
    <div className="work-image">
      <a
        className="work-image-in"
        href={props.link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVideo(false)}
        target="_blank"
        data-cursor={"disable"}
      >
        {props.link && (
          <div className="work-link">
            <MdArrowOutward />
          </div>
        )}
        {!isImageLoaded && (
          <div
            className="work-image-placeholder"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #1d1d1d 0%, #2d2d2d 100%)',
              filter: 'blur(20px)',
            }}
          />
        )}
        <img
          src={props.image}
          alt={props.alt}
          loading="lazy"
          onLoad={handleImageLoad}
          style={{
            opacity: isImageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
        {isVideo && <video src={video} autoPlay muted playsInline loop></video>}
      </a>
    </div>
  );
};

export default WorkImage;
