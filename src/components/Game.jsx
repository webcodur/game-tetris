import React, {
	useState,
	useEffect,
	useCallback,
	useRef,
	useMemo,
} from 'react';
import Stage from './Stage';
import Display from './Display';
import GameBtns from './GameBtns';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { createStage, checkCollision } from '../gameHelpers';
import useInterval from '../hooks/useInterval';
import InfoBox from './InfoBox';
import {
	StyledTetrisWrapper,
	StyledTetris,
	LColumn,
	LTop,
	LBottom,
	RColumn,
	StyledSelect,
	CentralMessage,
	StyledSelectDiv,
} from './GameStyles';
import Next from './Next';
import Hold from './Hold';
import { playSingleAudio } from '../playAudio';

const Game = () => {
	const [gameStatus, setGameStatus] = useState('Hello');
	const [gamePhrase, setGamePhrase] = useState('Hello');

	const [dropTime, setDropTime] = useState(null);

	const [score, setScore] = useState(0);
	const [rows, setRows] = useState(0);
	const [level, setLevel] = useState(0);
	const [selectedLevel, setSelectedLevel] = useState(0);
	const [spacePressed, setSpacePressed] = useState(false);
	const [$useBackgroundImage, $setuseBackgroundImage] = useState(false);
	const [loading, setLoading] = useState(true);
	const [keyState, setKeyState] = useState({});
	const [animationKey, setAnimationKey] = useState('');

	const [
		player,
		updatePlayerPos,
		resetPlayer,
		playerRotate,
		nextTetrominos,
		holdTetromino,
		swapWithHold,
		setHoldTetromino,
	] = usePlayer();
	const [stage, setStage, clearedRows, setClearedRows] = useStage(
		player,
		resetPlayer
	);

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
		setDropTime(1000 / ((selectedLevel + 1) * 3) + 200);
		setDropTime(1000 / ((selectedLevel + 1) * 3) + 200);
		resetPlayer();
		setGameStatus(() => 'running');
		setGamePhrase(() => {
			const msg =
				selectedLevel === 0 ? '테스트 모드 ' : 'level ' + selectedLevel;
			return `게임 시작: ${msg}`;
		});
		setScore(0);
		setRows(0);
		setLevel(selectedLevel);
		setSpacePressed(false);
		wrapperRef.current.focus();
		setHoldTetromino(null);
		setAnimationKey((prev) => prev + '1');
	};

	const drop = useCallback(() => {
		if (!checkCollision(player, stage, { x: 0, y: 1 })) {
			updatePlayerPos({ x: 0, y: 1, collided: false });
		} else {
			if (player.pos.y < 1) {
				setGameStatus(() => 'game over');
				setGamePhrase(() => 'game over');
				setDropTime(null);
			} else {
				playSingleAudio('drop.mp3');
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
			playSingleAudio('anchor.mp3');
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

	const handleRestoreBlocks = useCallback(() => {
		if (gameStatus === 'running') swapWithHold();
	}, [gameStatus, swapWithHold]);

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
			67: () => handleRestoreBlocks(),
		}),
		[
			movePlayer,
			dropPlayer,
			playerRotate,
			stage,
			handleSpacePress,
			handleRestoreBlocks,
			movePlayerToEdge,
		]
	);

	const handleKeyDown = useCallback(
		(event) => {
			setKeyState((prev) => ({ ...prev, [event.keyCode]: true }));
			if (gameStatus === 'running' && moveActions[event.keyCode]) {
				moveActions[event.keyCode](event.ctrlKey);
			}
		},
		[gameStatus, moveActions]
	);

	const handleKeyUp = useCallback(
		(event) => {
			setKeyState((prev) => ({ ...prev, [event.keyCode]: false }));
			if (gameStatus === 'running') {
				if (event.keyCode === 40) {
					setDropTime(1000 / (level + 1) + 200);
				} else if (event.keyCode === 32) {
					setSpacePressed(false);
				}
			}
		},
		[gameStatus, level]
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
		}, 110);
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

	useInterval(
		() => {
			if (level !== 0) drop();
		},
		dropTime,
		gameStatus
	);

	useEffect(() => {
		if (clearedRows > 0) {
			playSingleAudio('lineClear.mp3');
			const calcScore = (rowsCleared) => {
				const linePoints = [40, 100, 300, 1200];
				if (rowsCleared > 0) {
					setScore((prev) => prev + linePoints[rowsCleared - 1] * (level + 1));
					setRows((prev) => prev + rowsCleared);
				}
			};
			calcScore(clearedRows);
			setClearedRows(0);
		}
	}, [clearedRows, level, setClearedRows]);

	const toggleBackground = () => {
		$setuseBackgroundImage((prev) => !prev);
		wrapperRef.current.focus();
	};

	useEffect(() => {
		setLoading(false);
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	const pauseGameBtnClicked = () => {
		if (gameStatus !== 'running' && gameStatus !== 'paused') return; // 블락 사운드 내지 리턴
		if (gameStatus === 'paused') wrapperRef.current.focus(); // 포커스 이동

		if (gameStatus === 'running') setGameStatus('paused');
		if (gameStatus === 'paused') setGameStatus('running');

		if (gameStatus === 'paused') setGamePhrase('running');
		if (gameStatus === 'running') setGamePhrase('paused');
	};

	return (
		<>
			{/* 중앙 메시지 */}
			{gamePhrase !== 'running' && (
				<CentralMessage key={gamePhrase + animationKey}>
					{gamePhrase}
				</CentralMessage>
			)}

			<StyledTetrisWrapper role="button" tabIndex="0" ref={wrapperRef}>
				<StyledTetris>
					<LColumn>
						<LTop>
							<Hold
								holdTetromino={holdTetromino}
								$useBackgroundImage={$useBackgroundImage}
							/>
						</LTop>
						<LBottom>
							{/* 점수박스 */}
							<div>
								<Display Ltext={`점수`} Rtext={score} />
								<Display Ltext={`처리 행`} Rtext={rows} />
								<Display Ltext={`현재 레벨`} Rtext={level} />
							</div>

							<StyledSelectDiv>
								레벨 선택
								<StyledSelect
									id="level-select"
									value={selectedLevel}
									onChange={(e) => setSelectedLevel(Number(e.target.value))}>
									{[...Array(10).keys()].map((level) => (
										<option key={level} value={level}>
											{level}
										</option>
									))}
								</StyledSelect>
							</StyledSelectDiv>
						</LBottom>
					</LColumn>
					<Stage
						stage={stage}
						player={player}
						$useBackgroundImage={$useBackgroundImage}
					/>
					<RColumn>
						<Next
							nextTetrominos={nextTetrominos}
							$useBackgroundImage={$useBackgroundImage}
						/>
						<GameBtns
							gameStatus={gameStatus}
							cb1={startGame}
							cb2={pauseGameBtnClicked}
							cb3={toggleBackground}
						/>
					</RColumn>
				</StyledTetris>
			</StyledTetrisWrapper>
			<InfoBox />
		</>
	);
};

export default Game;
