// Next.jsx
import React from 'react';
import styled from 'styled-components';
import Cell from './Cell';

const StyledNextWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 20px;
`;

const StyledNextTitle = styled.h3`
	font-family: Pixel, Arial, Helvetica, sans-serif;
	font-size: 1rem;
	color: #999;
	margin: 0 0 10px 0;
`;

const StyledNext = styled.div`
	display: grid;
	grid-template-rows: repeat(${(props) => props.height}, 1fr);
	grid-template-columns: repeat(${(props) => props.width}, 1fr);
	grid-gap: 1px;
	border: 2px solid #333;
	width: 100%;
	max-width: 10vw;
	background: #111;
	margin-bottom: 10px;
`;

const Next = ({ nextTetrominos, useBackgroundImage }) => (
	<StyledNextWrapper>
		<StyledNextTitle>Next</StyledNextTitle>
		{nextTetrominos.map((tetromino, index) => (
			<StyledNext
				key={index}
				width={tetromino[0].length}
				height={tetromino.length}>
				{tetromino.map((row, y) =>
					row.map((cell, x) => (
						<Cell key={x} type={cell} useBackgroundImage={useBackgroundImage} />
					))
				)}
			</StyledNext>
		))}
	</StyledNextWrapper>
);

export default Next;
