import { useState, useEffect } from 'react';
import { createStage } from '../gameHelpers';

export const useStage = (player, resetPlayer) => {
	const [stage, setStage] = useState(createStage());

	const sweepRows = (newStage) =>
		newStage.reduce((ack, row) => {
			if (row.findIndex((cell) => cell[0] === 0) === -1) {
				ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
				return ack;
			}
			ack.push(row);
			return ack;
		}, []);

	useEffect(() => {
		const updateStage = (prevStage) => {
			// 이전 스테이지를 지우고 새로운 스테이지를 생성
			const newStage = prevStage.map((row) =>
				row.map((cell) => (cell[1] === 'clear' ? [0, 'clear'] : cell))
			);

			// 플레이어의 테트로미노를 스테이지에 그리기
			player.tetromino.forEach((row, y) => {
				row.forEach((value, x) => {
					if (value !== 0) {
						// 배열 범위를 벗어나지 않도록 확인
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

			// 게임이 종료된 경우, 플레이어를 리셋
			if (player.collided) {
				resetPlayer();
				return sweepRows(newStage);
			}

			return newStage;
		};

		setStage((prev) => updateStage(prev));
	}, [player, resetPlayer]);

	return [stage, setStage];
};
