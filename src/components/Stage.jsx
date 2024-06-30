import React from 'react';
import styled from 'styled-components';
import Cell from './Cell';
import { calculateDropPosition } from 'utils/gameHelpers';

const StyledStage = styled.div`
	display: grid;
	grid-template-rows: repeat(${(props) => props.height}, 35px);
	grid-template-columns: repeat(${(props) => props.width}, 35px);
	grid-gap: 1px;
	border: 2px solid #333;
	background: #111;
`;

const Stage = ({ stage, player, $useBackgroundImage, gameStatus }) => {
	const dpos = calculateDropPosition(player, stage);
	const pTetH = player.tetromino.length;
	const pTetW = player.tetromino[0].length;

	return (
		<StyledStage width={stage[0].length} height={stage.length}>
			{stage.map((row, y) =>
				row.map((cell, x) => {
					// 실루엣 출력 여부
					let isSil;
					if (gameStatus === 'running') {
						isSil =
							dpos.y <= y &&
							y < dpos.y + pTetH &&
							dpos.x <= x &&
							x < dpos.x + pTetW &&
							player.tetromino[y - dpos.y][x - dpos.x] !== 0;
					} else isSil = false;

					return (
						<Cell
							key={x}
							type={cell[0]}
							$useBackgroundImage={$useBackgroundImage}
							$isSilhouette={isSil}
						/>
					);
				})
			)}
		</StyledStage>
	);
};

export default Stage;
