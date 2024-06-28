import React, { useState, useEffect, useCallback, useRef } from 'react';
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { createStage, checkCollision } from '../gameHelpers';
import useInterval from '../hooks/useInterval';
import InfoBox from './InfoBox';
import { StyledTetrisWrapper, StyledTetris, ToggleButton } from './GameStyles';

const Game = () => {
	const [dropTime, setDropTime] = useState(null);
	const [gameOver, setGameOver] = useState(false);
	const [score, setScore] = useState(0);
	const [rows, setRows] = useState(0);
	const [level, setLevel] = useState(0);
	const [selectedLevel, setSelectedLevel] = useState(0); // 추가된 부분
	const [spacePressed, setSpacePressed] = useState(false);
	const [useBackgroundImage, setUseBackgroundImage] = useState(false);

	const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
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
		console.log('Game started');
		setStage(createStage());
		setDropTime(1000 / (selectedLevel + 1) + 200); // 선택된 레벨에 따른 낙하 속도 설정
		resetPlayer();
		setGameOver(false);
		setScore(0);
		setRows(0);
		setLevel(selectedLevel); // 선택된 레벨로 설정
		setSpacePressed(false);
		wrapperRef.current.focus();
	};

	const drop = useCallback(() => {
		if (!checkCollision(player, stage, { x: 0, y: 1 })) {
			updatePlayerPos({ x: 0, y: 1, collided: false });
		} else {
			if (player.pos.y < 1) {
				console.log('GAME OVER!!!');
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

	const moveActions = {
		37: (ctrlKey) => (ctrlKey ? movePlayerToEdge('left') : movePlayer(-1)),
		39: (ctrlKey) => (ctrlKey ? movePlayerToEdge('right') : movePlayer(1)),
		40: () => dropPlayer(),
		38: () => playerRotate(stage, 1),
		88: () => playerRotate(stage, 1),
		90: () => playerRotate(stage, -1),
		65: () => playerRotate(stage, 2),
		32: () => handleSpacePress(),
	};

	const move = useCallback(
		({ keyCode, ctrlKey }) => {
			if (!gameOver && moveActions[keyCode]) {
				moveActions[keyCode](ctrlKey);
			}
		},
		[gameOver, movePlayer, dropPlayer, playerRotate, stage, spacePressed]
	);

	const movePlayerToEdge = (direction) => {
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
	};

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

	const keyUp = useCallback(
		({ keyCode }) => {
			if (!gameOver) {
				if (keyCode === 40) {
					setDropTime(1000 / (level + 1) + 200);
				} else if (keyCode === 32) {
					setSpacePressed(false);
				}
			}
		},
		[gameOver, level]
	);

	useEffect(() => {
		const handleKeyDown = (event) => {
			move(event);
		};

		const handleKeyUp = (event) => {
			keyUp(event);
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [move, keyUp]);

	useInterval(() => {
		drop();
	}, dropTime);

	useEffect(() => {
		const calcScore = (rowsCleared) => {
			const linePoints = [40, 100, 300, 1200];
			if (rowsCleared > 0) {
				setScore((prev) => prev + linePoints[rowsCleared - 1] * (level + 1));
				setRows((prev) => prev + rowsCleared);
			}
		};

		calcScore(clearedRows);
	}, [clearedRows, level]);

	const toggleBackground = () => {
		setUseBackgroundImage((prev) => !prev);
	};

	return (
		<StyledTetrisWrapper role="button" tabIndex="0" ref={wrapperRef}>
			<StyledTetris>
				<Stage
					stage={stage}
					player={player}
					useBackgroundImage={useBackgroundImage}
				/>
				<aside>
					{gameOver && <Display gameOver={gameOver} text="Game Over" />}
					{!gameOver && (
						<div>
							<Display text={`Score: ${score}`} />
							<Display text={`Rows: ${rows}`} />
							<Display text={`Level: ${level}`} />
						</div>
					)}
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
