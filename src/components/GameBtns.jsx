import React from 'react';
import styled from 'styled-components';

const Btn = styled.button`
	box-sizing: border-box;
	margin: 0 0 20px 0;
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

	&:hover {
		background-color: wheat;
	}

	&:focus {
		outline: 3px solid #fff; /* 포커스 스타일 추가 */
	}
`;

const GameBtns = ({ cb1, cb2, cb3 }) => (
	<>
		<Btn onClick={cb1}>게임 시작</Btn>
		<Btn onClick={cb2}>일시 정지</Btn>
		<Btn onClick={cb3}>타일 배경 토글</Btn>
	</>
);

export default GameBtns;
