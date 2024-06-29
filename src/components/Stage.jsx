import React from 'react';
import styled from 'styled-components';
import Cell from './Cell';
import { calculateDropPosition } from '../gameHelpers';

const StyledStage = styled.div`
	display: grid;
	grid-template-rows: repeat(${(props) => props.height}, 35px);
	grid-template-columns: repeat(${(props) => props.width}, 35px);
	grid-gap: 1px;
	border: 2px solid #333;
	background: #111;
`;

const Stage = ({ stage, player, $useBackgroundImage }) => {
	const dropPosition = calculateDropPosition(player, stage);

	return (
		<StyledStage width={stage[0].length} height={stage.length}>
			{stage.map((row, y) =>
				row.map((cell, x) => {
					const $isSilhouette =
						dropPosition.y <= y &&
						y < dropPosition.y + player.tetromino.length &&
						dropPosition.x <= x &&
						x < dropPosition.x + player.tetromino[0].length &&
						player.tetromino[y - dropPosition.y][x - dropPosition.x] !== 0;
					return (
						<Cell
							key={x}
							type={cell[0]}
							$useBackgroundImage={$useBackgroundImage}
							$isSilhouette={$isSilhouette}
						/>
					);
				})
			)}
		</StyledStage>
	);
};

export default Stage;
