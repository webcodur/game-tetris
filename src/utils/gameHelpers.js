export const STAGE_WIDTH = 10; // 테트리스 게임의 일반적인 너비
export const STAGE_HEIGHT = 20; // 테트리스 게임의 일반적인 높이

export const createStage = () =>
	Array.from(Array(STAGE_HEIGHT), () =>
		new Array(STAGE_WIDTH).fill([0, 'clear'])
	);

export const checkCollision = (player, stage, { x: moveX, y: moveY }) => {
	for (let y = 0; y < player.tetromino.length; y += 1) {
		for (let x = 0; x < player.tetromino[y].length; x += 1) {
			if (player.tetromino[y][x] !== 0) {
				if (
					!stage[y + player.pos.y + moveY] ||
					!stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
					stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !==
						'clear'
				) {
					return true;
				}
			}
		}
	}
	return false;
};
export const calculateDropPosition = (player, stage) => {
	const { tetromino, pos } = player;

	// 각 열에서 최하단 블록이 충돌할 y 좌표 계산
	const dropDistance = tetromino[0].map((_, x) => {
		let y = pos.y;
		while (y < stage.length) {
			for (let row = 0; row < tetromino.length; row++) {
				if (
					tetromino[row][x] !== 0 &&
					(!stage[y + row] ||
						!stage[y + row][pos.x + x] ||
						stage[y + row][pos.x + x][1] !== 'clear')
				) {
					return y - pos.y - 1;
				}
			}
			y += 1;
		}
		return y - pos.y - 1;
	});

	// 각 열의 최하단 블록이 충돌할 위치 중 가장 위쪽 y 좌표 선택
	const dropPosY = Math.min(...dropDistance) + pos.y;

	return { x: pos.x, y: dropPosY };
};
