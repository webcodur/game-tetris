import React from 'react';
import styled from 'styled-components';

const Btn = styled.button`
	display: block;
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
		color: black;
		font-weight: bold;
	}

	&:focus {
		outline: 3px solid #fff;
	}
`;

const GameBtns = ({ gameStatus, cb1, cb2, cb3 }) => {
	return (
		<div>
			<Btn onClick={cb1}>게임 시작</Btn>
			<Btn onClick={cb2}>
				{gameStatus === 'paused' ? '게임 재개' : '일시 정지'}
			</Btn>
			<Btn onClick={cb3}>타일 배경 토글</Btn>
		</div>
	);
};

export default GameBtns;

// gameStatus
