import styled from "@emotion/styled";
import Container from "components/common/Container";
import ComfirmEmailModal from "components/modal/ComfirmEmailModal";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { saveData, sendEmailCertificationNumber } from "store/signup";
import { Common } from "styles/common";

const Layout = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.span`
  font-family: "Roboto", sans-serif;
  font-weight: 700;
  font-size: 1.725rem;
  color: ${Common.colors.black};
  margin: 40px 0 10px;
`;

const Head = styled.h1`
  font-weight: 700;
  font-size: 1.5rem;
  color: ${Common.colors.black};
  margin: 10px 0;
`;

const Form = styled.form`
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Input = styled.input`
  margin: 4px auto;
  width: 100%;
  border-radius: 50px;
  padding: 14px 30px;
  border: none;
  box-shadow: none;
  color: #fff;
  font-size: 1.025rem;
  cursor: ${({ submit }) => submit && "pointer"};
  background-color: ${({ submit }) =>
    submit ? `${Common.colors.cyan}` : `${Common.colors.orange}`};
  &::placeholder {
    color: #fff;
  }
  &:-webkit-autofill,
  :-webkit-autofill:hover,
  :-webkit-autofill:focus,
  :-webkit-autofill:active {
    box-shadow: 0 0 0 1000px ${Common.colors.orange} inset;
    transition: background-color 5000s ease-in-out 0s;
    -webkit-box-shadow: 0 0 0 1000px ${Common.colors.orange} inset;
    -webkit-text-fill-color: #fff;
    -webkit-transition: background-color 5000s ease-in-out 0s;
  }
`;

const ToLogin = styled.span`
  display: block;
  margin-bottom: 10px;
`;

const ErrorMsg = styled.p`
  color: #da0000;
  text-align: left;
  padding: 0 30px;
`;

const EMAIL_REGEX = /^[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[A-z]/;

const PW_REGEX = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,10}$/;

const ERROR_MSG = {
  required: "?????????????????????.",
  invalidEmail: "????????? ????????? ????????????.",
  invalidPw: "6~10??? ??????, ?????? ???????????? ???????????????.",
  invalidConfirmPw: "??????????????? ???????????? ????????????.",
};

const Signup = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    setIsOpenModal(true);
    dispatch(
      saveData({
        email: data.email,
        password: data.pw,
      })
    );
    dispatch(sendEmailCertificationNumber(data.email));
  };

  const closeHandler = () => {
    setIsOpenModal(false);
  };

  return (
    <Container>
      <Layout>
        <Logo>MOVIE ROOM</Logo>
        <Head>????????????</Head>
        <Form onSubmit={handleSubmit(onSubmit)} action="">
          <Input
            type="email"
            title="?????????"
            placeholder="?????????"
            autoFocus
            {...register("email", {
              required: ERROR_MSG.required,
              pattern: {
                value: EMAIL_REGEX,
                message: ERROR_MSG.invalidEmail,
              },
            })}
          />
          {errors.email && <ErrorMsg>{errors.email.message}</ErrorMsg>}
          <Input
            type="password"
            title="????????????"
            placeholder="????????????"
            {...register("pw", {
              required: ERROR_MSG.required,
              pattern: {
                value: PW_REGEX,
                message: ERROR_MSG.invalidPw,
              },
              onBlur: () => trigger("confirmPw"),
            })}
          />
          {errors.pw && <ErrorMsg>{errors.pw.message}</ErrorMsg>}
          <Input
            type="password"
            title="???????????? ??????"
            placeholder="???????????? ??????"
            {...register("confirmPw", {
              required: ERROR_MSG.required,
              validate: {
                confirmPw: (v) =>
                  v === getValues("pw") || ERROR_MSG.invalidConfirmPw,
              },
            })}
          />
          {errors.confirmPw && <ErrorMsg>{errors.confirmPw.message}</ErrorMsg>}
          <Input
            submit
            type="submit"
            title="????????????"
            value="????????????"
            disabled={isSubmitting}
          />
        </Form>
        <Link to="/login">
          <ToLogin>????????? ????????????</ToLogin>
        </Link>
        {isOpenModal && <ComfirmEmailModal closeHandler={closeHandler} />}
      </Layout>
    </Container>
  );
};

export default Signup;
