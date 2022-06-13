import Carousel from "components/common/Carousel";
import PersonCard from "./PersonCard";
import { CarouselItem } from "styles/common";
import { useState } from "react";

const MainCastCarousel = ({ name, castList }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Carousel
      name={name}
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
      itemCount={castList?.length}
      showCount={5}
    >
      {castList?.map((cast) => (
        <CarouselItem activeIndex={activeIndex} key={cast.id}>
          <PersonCard
            id={cast.id}
            name={cast.name}
            profile_path={cast.profile_path}
            character={cast.character}
          />
        </CarouselItem>
      ))}
    </Carousel>
  );
};

export default MainCastCarousel;
