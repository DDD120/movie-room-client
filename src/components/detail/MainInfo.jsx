import styled from "@emotion/styled";
import { Common, NoImg } from "styles/common";
import SkeletonMainInfo from "components/loading/SkeletonMainInfo";
import { BsPen } from "react-icons/bs";
import { useState } from "react";
import CreateReview from "components/modal/ReviewModal/CreateReview";
import { useSelector } from "react-redux";
import Button from "components/common/Button";
import useCheckWrittenReview from "hooks/useCheckWrittenReview";

const Background = styled.div`
  background-blend-mode: darken;
  background-color: rgba(0, 0, 0, 0.7);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  background-image: ${({ backdrop_path }) =>
    backdrop_path &&
    `url(${process.env.REACT_APP_THE_MOVIE_DB_IMG_BASE_URL}${backdrop_path})`};
`;

const MainInfoContiner = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  height: auto;
  display: flex;
  justify-content: center;
  gap: 28px;
  color: ${Common.colors.white};
  padding: 40px 0;
`;
const ImgWrapper = styled.div`
  flex: 2;
  max-width: 360px;
  width: 100%;
  aspect-ratio: 1 / 1.416;
  overflow: hidden;
  border-radius: 12px;
  position: relative;
`;
const Img = styled.img`
  width: 100%;
  object-fit: cover;
  aspect-ratio: 1 / 1.416;
  border-radius: 12px;
`;
const InfoContainer = styled.div`
  flex: 3;
  position: relative;
  padding-bottom: 60px;
`;
const Title = styled.h1`
  font-size: 2.275rem;
`;
const Year = styled.span`
  font-size: 1.225rem;
  margin: 0 4px;
  color: ${Common.colors.grey};
`;
const Info = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  margin: 20px 0;
`;
const Category = styled.span`
  color: ${Common.colors.grey};
`;
const Tagline = styled.i`
  font-size: 1.275rem;
  font-weight: 700;
`;
const Overview = styled.p`
  margin: 10px 0;
`;

const WriteReviewBtnWrapper = styled.div`
  position: absolute;
  bottom: 0;
`;

const PenIcon = styled.span`
  display: inline-block;
  margin-right: 8px;
  transform: translateY(2px);
`;

const MainInfo = ({ movie, isLoading }) => {
  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.user);
  const releaseYear = movie?.release_date.slice(0, 4);

  const isWritten = useCheckWrittenReview(movie?.id);

  const openWriteReviewModal = () => {
    setShowWriteReviewModal(true);
    document.body.classList.add("scroll_hidden");
  };

  const handleModalClose = () => {
    setShowWriteReviewModal(false);
    document.body.classList.remove("scroll_hidden");
  };

  return (
    <>
      {!isLoading ? (
        <Background backdrop_path={movie.backdrop_path}>
          <MainInfoContiner>
            <ImgWrapper>
              {movie.poster_path ? (
                <Img
                  src={`${process.env.REACT_APP_THE_MOVIE_DB_IMG_BASE_URL}${movie.poster_path}`}
                  alt={`${movie.title} 포스터`}
                />
              ) : (
                <NoImg>NO IMAGE</NoImg>
              )}
            </ImgWrapper>
            <InfoContainer>
              <Title>
                {movie.title}
                {releaseYear && <Year>({releaseYear})</Year>}
              </Title>
              <Info>
                <Category>원제</Category>
                <span>{movie.original_title}</span>
                <Category>원어</Category>
                <span>{movie.original_language?.toUpperCase()}</span>
                <Category>발매일</Category>
                <span>{movie.release_date}</span>
                <Category>장르</Category>
                <span>
                  {movie.genres?.map((genre) => genre.name).join("/")}
                </span>
                <Category>상영시간</Category>
                <span>{movie.runtime}분</span>
              </Info>
              {movie.tagline && <Tagline>"{movie.tagline}"</Tagline>}
              <Overview>{movie.overview}</Overview>
              {isLoggedIn && !isWritten && (
                <WriteReviewBtnWrapper>
                  <Button onClick={openWriteReviewModal}>
                    <PenIcon>
                      <BsPen />
                    </PenIcon>
                    리뷰 작성
                  </Button>
                </WriteReviewBtnWrapper>
              )}
              {showWriteReviewModal && (
                <CreateReview movie={movie} onClose={handleModalClose} />
              )}
            </InfoContainer>
          </MainInfoContiner>
        </Background>
      ) : (
        <SkeletonMainInfo />
      )}
    </>
  );
};

export default MainInfo;
