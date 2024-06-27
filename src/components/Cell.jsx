import React from 'react';
import styled from 'styled-components';
import { TETROMINOS } from '../tetrominos';
import cellBackground from '../assets/cell-background.png'; // 이미지 파일 경로

const StyledCell = styled.div`
	width: auto;
	background: ${(props) =>
		props.type === 0
			? 'rgba(0, 0, 0, 0.8)' // 배경 색상
			: props.useBackgroundImage
			? `url(${cellBackground}), rgba(${props.color}, 0.8)` // 배경 이미지와 색상
			: `rgba(${props.color}, 0.8)`}; // 색상만
	background-blend-mode: overlay; // 이미지와 색상 오버레이
	background-size: cover; // 배경 이미지 크기 조정
	border: ${(props) => (props.type === 0 ? '0px solid' : '4px solid')};
	border-bottom-color: rgba(${(props) => props.color}, 0.1);
	border-right-color: rgba(${(props) => props.color}, 1);
	border-top-color: rgba(${(props) => props.color}, 1);
	border-left-color: rgba(${(props) => props.color}, 0.3);
`;

const Cell = ({ type, useBackgroundImage }) => (
	<StyledCell
		type={type}
		color={TETROMINOS[type].color}
		useBackgroundImage={useBackgroundImage}
	/>
);

export default Cell;
