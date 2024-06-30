import { useState, useCallback } from 'react';
import { TETROMINOS, randomTetromino } from '../utils/tetrominos';
import { STAGE_WIDTH, checkCollision } from '../utils/gameHelpers';

export const usePlayer = () => {
	// 플레이어 상태
	const [player, setPlayer] = useState({
		pos: { x: 0, y: 0 }, // 초기 위치
		tetromino: TETROMINOS[0].shape, // 현재 테트로미노 모양
		collided: false, // 충돌 여부
	});

	// 다음 테트로미노
	const [nextTetrominos, setNextTetrominos] = useState(
		Array.from({ length: 5 }, () => randomTetromino().shape)
	);

	// 보관 테트로미노
	const [holdTetromino, setHoldTetromino] = useState(null);
	const [isHoldUsed, setIsHoldUsed] = useState(false);

	// 테트로미노 회전 함수
	const rotate = (matrix, dir) => {
		const rotate90 = (matrix) =>
			matrix
				.map((_, index) => matrix.map((col) => col[index]))
				.map((row) => row.reverse());

		if (dir === 1) return rotate90(matrix);
		if (dir === 2) return rotate90(rotate90(matrix));
		if (dir === -1) return rotate90(rotate90(rotate90(matrix)));
	};

	// 플레이어의 테트로미노를 회전시키는 함수
	const playerRotate = (stage, dir) => {
		const clonedPlayer = JSON.parse(JSON.stringify(player)); // 플레이어 객체를 복제
		clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir); // 테트로미노 회전

		const pos = clonedPlayer.pos.x;
		let offset = 1;

		// 충돌 체크 후 충돌 시 위치 조정
		while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
			clonedPlayer.pos.x += offset;
			offset = -(offset + (offset > 0 ? 1 : -1));
			if (offset > clonedPlayer.tetromino[0].length) {
				rotate(clonedPlayer.tetromino, -dir); // 회전 원상복구
				clonedPlayer.pos.x = pos;
				return;
			}
		}
		setPlayer(clonedPlayer); // 플레이어 상태 업데이트
	};

	// 플레이어 위치 업데이트 함수
	const updatePlayerPos = ({ x, y, collided }) => {
		setPlayer((prev) => ({
			...prev,
			pos: { x: prev.pos.x + x, y: prev.pos.y + y },
			collided,
		}));
	};

	// 플레이어 초기화 함수
	const resetPlayer = useCallback(() => {
		setPlayer({
			pos: { x: STAGE_WIDTH / 2 - 2, y: 0 }, // 중앙 상단으로 위치 초기화
			tetromino: nextTetrominos[0], // 다음 테트로미노 가져오기
			collided: false,
		});
		setNextTetrominos((prev) => [...prev.slice(1), randomTetromino().shape]); // 다음 테트로미노 갱신
		setIsHoldUsed(false); // 홀드 사용 여부 초기화
	}, [nextTetrominos]);

	// 홀드 수행 함수
	const swapWithHold = useCallback(() => {
		if (isHoldUsed) return; // 이미 홀드 사용 시 반환
		if (holdTetromino) {
			const temp = player.tetromino; // 현재 테트로미노와 홀드 테트로미노 교체
			setPlayer((prev) => ({
				...prev,
				tetromino: holdTetromino,
				pos: { x: STAGE_WIDTH / 2 - 2, y: 0 }, // 위치 초기화
				collided: false,
			}));
			setHoldTetromino(temp);
		} else {
			setHoldTetromino(player.tetromino); // 현재 테트로미노를 홀드
			resetPlayer(); // 플레이어 초기화
		}
		setIsHoldUsed(true); // 홀드 사용으로 설정
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
