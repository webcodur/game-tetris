import { useCallback, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import startLevelAtom from 'atoms/startLevel';
import linesToClearAtom from 'atoms/linesToClear';

const useGameControls = ({
	player,
	stage,
	updatePlayerPos,
	resetPlayer,
	playerRotate,
	setHoldTetromino,
	setStage,
	setDropTime,
	setGameStatus,
	setGamePhrase,
	setScore,
	setRows,
	setLevel,
	wrapperRef,
	intervalId,
	setIntervalId,
	gameStatus,
	handleGameOver,
	drop,
}) => {
	const [keyState, setKeyState] = useState({});
	const [animationKey, setAnimationKey] = useState('');
	const selectedLevel = useRef(0);
	const [startLevel] = useAtom(startLevelAtom);
	const [linesToClear] = useAtom(linesToClearAtom);

	const movePlayer = useCallback(
		(dir) => {
			if (!checkCollision(player, stage, { x: dir, y: 0 })) {
				updatePlayerPos({ x: dir, y: 0 });
			}
		},
		[player, stage, updatePlayerPos]
	);

	const gameStart = useCallback(() => {
		setStage(createStage());
		changeDropTimeByLevel(selectedLevel.current, setDropTime);
		resetPlayer();
		setGameStatus('running');
		setGamePhrase(() => {
			const msg =
				selectedLevel.current === 0
					? '테스트 모드 '
					: 'level ' + selectedLevel.current;
			return `게임 시작: ${msg}`;
		});
		setScore(0);
		setRows(0);
		setLevel(selectedLevel.current);
		wrapperRef.current.focus();
		setHoldTetromino(null);
		setAnimationKey((prev) => prev + '1');
		setGameTime(0);
		clearInterval(intervalId);
		const id = setInterval(() => setGameTime((prev) => prev + 1), 1000);
		setIntervalId(id);
	}, [
		setStage,
		setDropTime,
		selectedLevel,
		resetPlayer,
		setGameStatus,
		setGamePhrase,
		setScore,
		setRows,
		setLevel,
		wrapperRef,
		setHoldTetromino,
		setAnimationKey,
		intervalId,
	]);

	const keyActions = useMemo(
		() => ({
			37: (ctrlKey) => (ctrlKey ? movePlayerToEdge('left') : movePlayer(-1)),
			39: (ctrlKey) => (ctrlKey ? movePlayerToEdge('right') : movePlayer(1)),
			40: () => dropPlayer(),
			38: () => playerRotate(stage, 1),
			88: () => playerRotate(stage, 1),
			90: () => playerRotate(stage, -1),
			65: () => playerRotate(stage, 2),
			32: () => handleSpacePress(),
			67: () => handleRestoreBlocks(),
			89: () => handleNextGame(), // 'y'
			78: () => handleExitGame(), // 'n'
		}),
		[
			movePlayer,
			dropPlayer,
			playerRotate,
			stage,
			handleSpacePress,
			handleRestoreBlocks,
			movePlayerToEdge,
			handleNextGame,
			handleExitGame,
		]
	);

	const handleKeyDown = useCallback(
		(event) => {
			setKeyState((prev) => ({ ...prev, [event.keyCode]: true }));
			if (gameStatus === 'running' || gameStatus === 'clear') {
				if (keyActions[event.keyCode]) {
					keyActions[event.keyCode](event.ctrlKey);
				}
			}
		},
		[gameStatus, keyActions]
	);

	const handleKeyUp = useCallback(
		(event) => {
			const curKey = event.keyCode;
			setKeyState((prev) => ({ ...prev, [curKey]: false }));
			if (gameStatus === 'running') {
				if (curKey === 40) changeDropTimeByLevel(level, setDropTime);
			}
		},
		[gameStatus, level]
	);

	return {
		gameStart,
		handleKeyDown,
		handleKeyUp,
		keyState,
		animationKey,
		selectedLevel,
	};
};

export default useGameControls;
