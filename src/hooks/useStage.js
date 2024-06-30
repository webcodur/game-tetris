import { useState, useEffect } from 'react';
import { createStage } from '../utils/gameHelpers';

export const useStage = (player, resetPlayer) => {
	const [stage, setStage] = useState(createStage());
	const [clearedRows, setClearedRows] = useState(0);

	const sweepRows = (newStage) => {
		const rowsCleared = newStage.reduce((ack, row) => {
			if (row.findIndex((cell) => cell[0] === 0) === -1) {
				setClearedRows((prev) => prev + 1);
				ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
				return ack;
			}
			ack.push(row);
			return ack;
		}, []);
		return rowsCleared;
	};

	useEffect(() => {
		const updateStage = (prevStage) => {
			const newStage = prevStage.map((row) =>
				row.map((cell) => (cell[1] === 'clear' ? [0, 'clear'] : cell))
			);

			player.tetromino.forEach((row, y) => {
				row.forEach((value, x) => {
					if (value !== 0) {
						if (
							y + player.pos.y >= 0 &&
							y + player.pos.y < newStage.length &&
							x + player.pos.x >= 0 &&
							x + player.pos.x < newStage[0].length
						) {
							newStage[y + player.pos.y][x + player.pos.x] = [
								value,
								`${player.collided ? 'merged' : 'clear'}`,
							];
						}
					}
				});
			});
			if (player.collided) {
				resetPlayer();
				return sweepRows(newStage);
			}
			return newStage;
		};

		setStage((prev) => updateStage(prev));
	}, [player, resetPlayer]);

	return [stage, setStage, clearedRows, setClearedRows];
};
