import { useState, useEffect } from 'react';
import { createStage } from '../gameHelpers';

export const useStage = (player, resetPlayer) => {
	const [stage, setStage] = useState(createStage());
	const [clearedRows, setClearedRows] = useState(0);

	const sweepRows = (newStage) => {
		const rowsCleared = newStage.reduce((ack, row) => {
			// 행이 모두 채워졌는지 확인
			if (row.findIndex((cell) => cell[0] === 0) === -1) {
				// 행이 모두 채워졌다면 제거할 행 수를 증가시키고
				// 새로운 빈 행을 스테이지의 맨 위에 추가
				setClearedRows((prev) => prev + 1); // 제거된 줄 수 증가
				ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
				return ack;
			}
			// 행이 모두 채워지지 않았다면 그대로 ack에 추가
			ack.push(row);
			return ack;
		}, []);

		return rowsCleared;
	};

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

			// 게임이 종료된 경우, 플레이어를 리셋하고 줄을 제거
			if (player.collided) {
				resetPlayer();
				return sweepRows(newStage);
			}

			return newStage;
		};

		setStage((prev) => updateStage(prev));
	}, [player, resetPlayer]);

	useEffect(() => {
		setClearedRows(0);
	}, [player.pos.y]); // 줄 수 초기화

	return [stage, setStage, clearedRows];
};
