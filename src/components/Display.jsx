import React from 'react';
import styled from 'styled-components';

const StyledDisplay = styled.div`
	box-sizing: border-box;
	display: flex;
	align-items: center;
	margin: 0 0 20px 0;
	padding: 15px;
	border: 4px solid #333;
	/* min-height: 30px; */
	width: 100%;
	border-radius: 20px;
	color: #999;
	background: #000;
	font-family: Pixel, Arial, Helvetica, sans-serif;
	font-size: 1rem;
	width: 150px;
`;

const Display = ({ gameOver, text }) => (
	<StyledDisplay $gameOver={gameOver}>{text}</StyledDisplay> // 수정된 부분
);

export default Display;
