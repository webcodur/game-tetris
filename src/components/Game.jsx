import React, {
	useState,
	useEffect,
	useCallback,
	useRef,
	useMemo,
} from 'react';
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { createStage, checkCollision } from '../gameHelpers';
import useInterval from '../hooks/useInterval';
import InfoBox from './InfoBox';
import {
	StyledTetrisWrapper,
	StyledTetris,
	ToggleButton,
	LColumn,
	LTop,
	LBottom,
	RColumn,
} from './GameStyles';
import Next from './Next';
import Hold from './Hold';

const Game = () => {
	const [dropTime, setDropTime] = useState(null);
	const [gameOver, setGameOver] = useState(false);
	const [score, setScore] = useState(0);
	const [rows, setRows] = useState(0);
	const [level, setLevel] = useState(0);
	const [selectedLevel, setSelectedLevel] = useState(0);
	const [spacePressed, setSpacePressed] = useState(false);
	const [useBackgroundImage, setUseBackgroundImage] = useState(false);
	const [loading, setLoading] = useState(true);
	const [keyState, setKeyState] = useState({});

	const [
		player,
		updatePlayerPos,
		resetPlayer,
		playerRotate,
		nextTetrominos,
		holdTetromino,
		swapWithHold,
	] = usePlayer();
	const [stage, setStage, clearedRows] = useStage(player, resetPlayer);

	const wrapperRef = useRef(null);

	const movePlayer = useCallback(
		(dir) => {
			if (!checkCollision(player, stage, { x: dir, y: 0 })) {
				updatePlayerPos({ x: dir, y: 0 });
			}
		},
		[player, stage, updatePlayerPos]
	);

	const startGame = () => {
		setStage(createStage());
		setDropTime(1000 / (selectedLevel + 1) + 200);
		resetPlayer();
		setGameOver(false);
		setScore(0);
		setRows(0);
		setLevel(selectedLevel);
		setSpacePressed(false);
		wrapperRef.current.focus();
	};

	const drop = useCallback(() => {
		if (!checkCollision(player, stage, { x: 0, y: 1 })) {
			updatePlayerPos({ x: 0, y: 1, collided: false });
		} else {
			if (player.pos.y < 1) {
				setGameOver(true);
				setDropTime(null);
			} else {
				updatePlayerPos({ x: 0, y: 0, collided: true });
			}
		}
	}, [player, stage, updatePlayerPos]);

	const dropPlayer = useCallback(() => {
		setDropTime(null);
		drop();
	}, [drop]);

	const movePlayerToEdge = useCallback(
		(direction) => {
			let moveX = 0;
			if (direction === 'left') {
				while (!checkCollision(player, stage, { x: moveX - 1, y: 0 })) {
					moveX -= 1;
				}
			} else if (direction === 'right') {
				while (!checkCollision(player, stage, { x: moveX + 1, y: 0 })) {
					moveX += 1;
				}
			}
			updatePlayerPos({ x: moveX, y: 0 });
		},
		[player, stage, updatePlayerPos]
	);

	const handleSpacePress = useCallback(() => {
		if (!spacePressed) {
			let yPos = player.pos.y;
			while (
				!checkCollision(player, stage, { x: 0, y: yPos - player.pos.y + 1 })
			) {
				yPos += 1;
			}
			updatePlayerPos({ x: 0, y: yPos - player.pos.y, collided: true });
			setSpacePressed(true);
		}
	}, [player, stage, updatePlayerPos, spacePressed]);

	const handleShiftPress = useCallback(() => {
		if (!gameOver) {
			swapWithHold();
		}
	}, [gameOver, swapWithHold]);

	const moveActions = useMemo(
		() => ({
			37: (ctrlKey) => (ctrlKey ? movePlayerToEdge('left') : movePlayer(-1)),
			39: (ctrlKey) => (ctrlKey ? movePlayerToEdge('right') : movePlayer(1)),
			40: () => dropPlayer(),
			38: () => playerRotate(stage, 1),
			88: () => playerRotate(stage, 1),
			90: () => playerRotate(stage, -1),
			65: () => playerRotate(stage, 2),
			32: () => handleSpacePress(),
			16: () => handleShiftPress(),
		}),
		[
			movePlayer,
			dropPlayer,
			playerRotate,
			stage,
			handleSpacePress,
			handleShiftPress,
			movePlayerToEdge,
		]
	);

	const handleKeyDown = useCallback(
		(event) => {
			setKeyState((prev) => ({ ...prev, [event.keyCode]: true }));
			if (!gameOver && moveActions[event.keyCode]) {
				moveActions[event.keyCode](event.ctrlKey);
			}
		},
		[gameOver, moveActions]
	);

	const handleKeyUp = useCallback(
		(event) => {
			setKeyState((prev) => ({ ...prev, [event.keyCode]: false }));
			if (!gameOver) {
				if (event.keyCode === 40) {
					setDropTime(1000 / (level + 1) + 200);
				} else if (event.keyCode === 32) {
					setSpacePressed(false);
				}
			}
		},
		[gameOver, level]
	);

	useEffect(() => {
		const interval = setInterval(() => {
			if (keyState[37] && keyState[40]) {
				movePlayer(-1);
				drop();
			} else if (keyState[39] && keyState[40]) {
				movePlayer(1);
				drop();
			} else if (keyState[37]) {
				movePlayer(-1);
			} else if (keyState[39]) {
				movePlayer(1);
			} else if (keyState[40]) {
				dropPlayer();
			}
		}, 50);
		return () => clearInterval(interval);
	}, [keyState, dropPlayer, movePlayer, drop]);

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [handleKeyDown, handleKeyUp]);

	useInterval(() => {
		drop();
	}, dropTime);

	useEffect(() => {
		if (clearedRows > 0) {
			const calcScore = (rowsCleared) => {
				const linePoints = [40, 100, 300, 1200];
				if (rowsCleared > 0) {
					setScore((prev) => prev + linePoints[rowsCleared - 1] * (level + 1));
					setRows((prev) => prev + rowsCleared);
				}
			};

			calcScore(clearedRows);
		}
	}, [clearedRows, level]);

	const toggleBackground = () => {
		setUseBackgroundImage((prev) => !prev);
	};

	useEffect(() => {
		setLoading(false);
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<StyledTetrisWrapper role="button" tabIndex="0" ref={wrapperRef}>
			<StyledTetris>
				<LColumn>
					<LTop>
						<Hold
							holdTetromino={holdTetromino}
							useBackgroundImage={useBackgroundImage}
						/>
					</LTop>
					<LBottom>
						{gameOver && <Display gameOver={gameOver} text="Game Over" />}
						{!gameOver && (
							<div>
								<Display text={`Score: ${score}`} />
								<Display text={`Rows: ${rows}`} />
								<Display text={`Level: ${level}`} />
							</div>
						)}
					</LBottom>
				</LColumn>
				<Stage
					stage={stage}
					player={player}
					useBackgroundImage={useBackgroundImage}
				/>
				<aside>
					<Next
						nextTetrominos={nextTetrominos}
						useBackgroundImage={useBackgroundImage}
					/>
					<StartButton callback={startGame} />
					<div>
						<label htmlFor="level-select">Select Level: </label>
						<select
							id="level-select"
							value={selectedLevel}
							onChange={(e) => setSelectedLevel(Number(e.target.value))}>
							{[...Array(10).keys()].map((level) => (
								<option key={level} value={level}>
									{level}
								</option>
							))}
						</select>
					</div>
					<ToggleButton onClick={toggleBackground}>
						<p>Toggle</p>
						<p>Background</p>
					</ToggleButton>
					<InfoBox />
				</aside>
			</StyledTetris>
		</StyledTetrisWrapper>
	);
};

export default Game;
