import styled, { keyframes, css } from "styled-components";

export const StyledTetrisWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-size: cover;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
`;

export const StyledTetris = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: center;
  padding: 40px;
  margin: 0 auto;
  height: 90vh;
  background: black;
`;

export const LColumn = styled.div`
  width: 230px;
  padding: 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 750px;
  /* background: pink; */
`;

export const LTop = styled.div``;

export const LBottom = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const RColumn = styled.div`
  width: 230px;
  height: 750px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
  padding: 0 20px;
  /* background: pink; */
`;

export const ToggleButton = styled.button`
  box-sizing: border-box;
  margin: 20px 0;
  padding: 20px;
  min-height: 30px;
  width: 100%;
  border-radius: 20px;
  border: none;
  color: white;
  background: #333;
  font-family: Pixel, Arial, Helvetica, sans-serif;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
`;

export const StyledSelectDiv = styled.div`
  padding: 10px;
  border: 5px solid #333;
  border-radius: 15px;
  color: lightgray;
  background: black;
  margin: 0 auto;
`;

export const StyledSelect = styled.select`
  padding: 5px;
  cursor: pointer;
  border: 2px solid #333;
  border-radius: 15px;
  color: lightgray;
  background: black;
  margin: 5px;
`;

const fadeInOut = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

const fadeInOutAnimation = css`
  animation: ${fadeInOut} 2s linear forwards;
`;

const countdownAnimation = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

const countdownEffect = css`
  animation: ${countdownAnimation} 1s ease-in-out forwards;
`;

export const CentralMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: Pixel, Arial, Helvetica, sans-serif;
  color: #fff;
  font-size: 2rem;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  ${(props) => (props.gameStatus === "ready" ? countdownEffect : fadeInOutAnimation)};
`;

export const CentralButtonWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: Pixel, Arial, Helvetica, sans-serif;
  color: #fff;
  font-size: 1.5rem;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 5px;
  border: 1px solid red;
  div {
    text-align: center;
    line-height: 50px;
    button {
      cursor: pointer;
      font-size: 20px;
      width: 30px;
      height: 30px;
      border-radius: 10px;
      background-color: black;
      color: white;
      &:hover {
        background-color: wheat;
        color: black;
        font-weight: bold;
      }
    }
  }
`;

export const aaa = styled.button``;
