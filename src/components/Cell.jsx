import React from 'react';
import styled from 'styled-components';
import { TETROMINOS } from '../tetrominos';
import cellBackground from '../assets/cell-background.png'; // 이미지 파일 경로

const StyledCell = styled.div`
	width: auto;
	background: ${(props) =>
		props.type === 0
			? 'rgba(0, 0, 0, 0.8)'
			: props.$useBackgroundImage
			? `url(${cellBackground}), rgba(${props.color}, 0.8)`
			: `rgba(${props.color}, 0.8)`};
	background-blend-mode: overlay;
	background-size: cover;

	border: ${(props) =>
		props.$isSilhouette
			? '1px dashed rgba(255, 255, 255, 1)'
			: props.type === 0
			? '0px solid'
			: '4px solid'};
	border-bottom-color: ${(props) =>
		props.$isSilhouette
			? 'rgba(255, 255, 255, 1)'
			: `rgba(${props.color}, 0.1)`};
	border-right-color: ${(props) =>
		props.$isSilhouette ? 'rgba(255, 255, 255, 1)' : `rgba(${props.color}, 1)`};
	border-top-color: ${(props) =>
		props.$isSilhouette ? 'rgba(255, 255, 255, 1)' : `rgba(${props.color}, 1)`};
	border-left-color: ${(props) =>
		props.$isSilhouette
			? 'rgba(255, 255, 255, 0.6)'
			: `rgba(${props.color}, 0.3)`};
`;

const Cell = ({ type, $useBackgroundImage, $isSilhouette }) => (
	<StyledCell
		type={type}
		color={TETROMINOS[type].color}
		$useBackgroundImage={$useBackgroundImage}
		$isSilhouette={$isSilhouette} // 실루엣 여부 전달
	/>
);

export default Cell;
