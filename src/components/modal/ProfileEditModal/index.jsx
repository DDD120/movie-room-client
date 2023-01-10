import styled from "@emotion/styled";
import { Common } from "styles/common";
import Modal from "../Modal";
import { IoMdReverseCamera } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit3 } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateProfileMutation } from "apis/server-api";
import Button from "components/common/Button";
import { setUser } from "store/user";

const Base = styled.form`
  width: 80%;
`;

const Content = styled.div`
  display: flex;
  gap: 60px;
  margin-bottom: 40px;
`;

const Thumbnail = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  background-color: ${Common.colors.grey};

  img {
    filter: brightness(0.5);
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  input {
    display: none;
  }

  label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: ${Common.colors.white};
    font-size: 2.2rem;
    cursor: pointer;
  }
`;

const Info = styled.div`
  flex-grow: 1;
  text-align: left;
  font-size: 1.2rem;
`;

const InfoItem = styled.div`
  margin: 10px 0;
`;

const Name = styled.p`
  font-weight: 700;
  margin: 4px 0;
`;

const InputBox = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  border: none;
  border-bottom: 1px solid ${Common.colors.greyOpacity};
  padding: 10px;
  padding-right: 40px;
  background-color: ${Common.colors.beige};
  font-size: 1.2rem;
`;

const EditIcon = styled.div`
  color: ${Common.colors.grey};
  position: absolute;
  top: 10px;
  right: 10px;
  pointer-events: none;
`;

const ErrorMsg = styled.p`
  color: #da0000;
  font-size: 0.9rem;
`;

const ProfileEditModal = ({ closeHandler }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });
  const [isThumbnailChage, setIsThumbnailChage] = useState(false);
  const [newThumbnailUrl, setNewThumbnailUrl] = useState("");
  const [updateProfile, { data: profileRes = {}, isSuccess }] =
    useUpdateProfileMutation();
  const dispatch = useDispatch();
  const { id, nickname, email, thumbnail } = useSelector(
    (state) => state.user.user
  );

  const image = watch("image");

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("image", data.image[0]);
    formData.append("nickname", data.nickname);
    formData.append("id", id);
    await updateProfile(formData);
  };

  useEffect(() => {
    if (image && image.length > 0) {
      setIsThumbnailChage(true);
      const file = image[0];
      setNewThumbnailUrl(URL.createObjectURL(file));
    }
  }, [image]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        setUser({
          nickname: profileRes.nickname,
          thumbnail: profileRes.thumbnail,
        })
      );
      closeHandler();
    }
  }, [isSuccess, dispatch, profileRes, closeHandler]);

  return (
    <Modal closeHandler={closeHandler}>
      <Base onSubmit={handleSubmit(onSubmit)}>
        <Content>
          <Thumbnail>
            <img
              src={isThumbnailChage ? newThumbnailUrl : thumbnail}
              alt="프로필 사진"
            />
            <input
              {...register("image")}
              type="file"
              id="edit"
              accept="image/*"
            />
            <label htmlFor="edit">
              <IoMdReverseCamera />
            </label>
          </Thumbnail>
          <Info>
            <InfoItem>
              <Name>닉네임</Name>
              <InputBox>
                <Input
                  type="text"
                  defaultValue={nickname}
                  autoFocus
                  {...register("nickname", {
                    required: "필수 정보입니다.",
                  })}
                />
                <EditIcon>
                  <FiEdit3 />
                </EditIcon>
              </InputBox>
              {errors.nickname && (
                <ErrorMsg>{errors.nickname.message}</ErrorMsg>
              )}
            </InfoItem>
            <InfoItem>
              <Name>이메일</Name>
              <Input type="text" disabled value={email} />
            </InfoItem>
            <div>
              <button>회원탈퇴</button>
            </div>
          </Info>
        </Content>
        <Button type="submit" disabled={isSubmitting}>
          수정
        </Button>
      </Base>
    </Modal>
  );
};

export default ProfileEditModal;