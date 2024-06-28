import { useState, useCallback } from 'react';
import { TETROMINOS, randomTetromino } from '../tetrominos';
import { STAGE_WIDTH, checkCollision } from '../gameHelpers';

export const usePlayer = () => {
	const [player, setPlayer] = useState({
		pos: { x: 0, y: 0 },
		tetromino: TETROMINOS[0].shape,
		collided: false,
	});
	const [nextTetrominos, setNextTetrominos] = useState(
		Array.from({ length: 5 }, () => randomTetromino().shape)
	);
	const [holdTetromino, setHoldTetromino] = useState(null);
	const [isHoldUsed, setIsHoldUsed] = useState(false);

	const rotate = (matrix, dir) => {
		// 90도 회전 함수
		const rotate90 = (matrix) =>
			matrix
				.map((_, index) => matrix.map((col) => col[index]))
				.map((row) => row.reverse());

		if (dir === 2) {
			// 180도 회전
			return rotate90(rotate90(matrix));
		} else if (dir === -2) {
			// -180도 회전도 같은 방식으로 처리
			return rotate90(rotate90(matrix));
		} else {
			// 90도 또는 -90도 회전
			const rotatedTetro = rotate90(matrix);
			return dir > 0 ? rotatedTetro : rotatedTetro.reverse();
		}
	};

	const playerRotate = (stage, dir) => {
		const clonedPlayer = JSON.parse(JSON.stringify(player));
		clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

		const pos = clonedPlayer.pos.x;
		let offset = 1;
		while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
			clonedPlayer.pos.x += offset;
			offset = -(offset + (offset > 0 ? 1 : -1));
			if (offset > clonedPlayer.tetromino[0].length) {
				rotate(clonedPlayer.tetromino, -dir);
				clonedPlayer.pos.x = pos;
				return;
			}
		}
		setPlayer(clonedPlayer);
	};

	const updatePlayerPos = ({ x, y, collided }) => {
		setPlayer((prev) => ({
			...prev,
			pos: { x: prev.pos.x + x, y: prev.pos.y + y },
			collided,
		}));
	};

	const resetPlayer = useCallback(() => {
		setPlayer({
			pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
			tetromino: nextTetrominos[0],
			collided: false,
		});
		setNextTetrominos((prev) => [...prev.slice(1), randomTetromino().shape]);
		setIsHoldUsed(false);
	}, [nextTetrominos]);

	const swapWithHold = useCallback(() => {
		if (isHoldUsed) return;
		if (holdTetromino) {
			const temp = player.tetromino;
			setPlayer((prev) => ({
				...prev,
				tetromino: holdTetromino,
				pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
				collided: false,
			}));
			setHoldTetromino(temp);
		} else {
			setHoldTetromino(player.tetromino);
			resetPlayer();
		}
		setIsHoldUsed(true);
	}, [holdTetromino, player.tetromino, resetPlayer, isHoldUsed]);

	return [
		player,
		updatePlayerPos,
		resetPlayer,
		playerRotate,
		nextTetrominos,
		holdTetromino,
		swapWithHold,
		setHoldTetromino,
	];
};
