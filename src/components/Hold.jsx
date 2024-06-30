import React from "react";
import styled from "styled-components";
import Cell from "./Cell";

const StyledHoldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const StyledHoldTitle = styled.h3`
  font-family: Pixel, Arial, Helvetica, sans-serif;
  font-size: 1rem;
  color: #999;
  margin: 0 0 10px 0;
`;

const StyledHold = styled.div`
  display: grid;
  grid-template-rows: repeat(${(props) => props.height}, 20px);
  grid-template-columns: repeat(${(props) => props.width}, 20px);

  grid-gap: 1px;
  border: 2px solid #333;
  /* width: 100%; */
  max-width: 10vw;
  background: #111;
  margin-bottom: 10px;
`;

const Hold = ({ holdTetromino, $useBackgroundImage }) => (
  <StyledHoldWrapper>
    <StyledHoldTitle>Hold</StyledHoldTitle>
    {holdTetromino ? (
      <StyledHold width={holdTetromino[0].length} height={holdTetromino.length}>
        {holdTetromino.map((row, y) => row.map((cell, x) => <Cell key={x} type={cell} $useBackgroundImage={$useBackgroundImage} />))}
      </StyledHold>
    ) : (
      <StyledHold width={4} height={2}>
        <Cell key={0} type={0} $useBackgroundImage={$useBackgroundImage} />
      </StyledHold>
    )}
  </StyledHoldWrapper>
);

export default Hold;
