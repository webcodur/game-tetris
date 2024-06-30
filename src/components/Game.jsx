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
import Next from './Next';
import Hold from './Hold';
import Settings from './Settings.jsx';

import { usePlayer } from 'hooks/usePlayer';
import { useStage } from 'hooks/useStage';
import { useInterval } from 'hooks/useInterval';

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
	CentralButtonWrapper,
	StyledSelectDiv,
} from './GameStyles';

import { createStage, checkCollision } from 'utils/gameHelpers';
import changeDropTimeByLevel from 'utils/changeDropTimeByLevel';

import { useAtom } from 'jotai';
import startLevelAtom from 'atoms/startLevel';
import linesToClearAtom from 'atoms/linesToClear';

const Game = () => {
	const [gameStatus, setGameStatus] = useState('Hello');
	const [gamePhrase, setGamePhrase] = useState('Hello');
	const [dropTime, setDropTime] = useState(null);
	const [score, setScore] = useState(0);
	const [rows, setRows] = useState(0);

	const selectedLevel = useRef(0);
	const [$useBackgroundImage, $setuseBackgroundImage] = useState(false);
	const [loading, setLoading] = useState(true);
	const [keyState, setKeyState] = useState({});
	const [animationKey, setAnimationKey] = useState('');

	const [startLevel] = useAtom(startLevelAtom);
	const [level, setLevel] = useState(startLevel);
	const [linesToClear] = useAtom(linesToClearAtom);

	// 게임 시간 상태
	const [gameTime, setGameTime] = useState(startLevel);
	const [intervalId, setIntervalId] = useState(null);

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

	const handleGameOver = useCallback(() => {
		setGameStatus('game over');
		setGamePhrase('game over');
		setDropTime(null);
		clearInterval(intervalId); // 게임 종료 시 타이머 클리어
	}, [intervalId]);

	const drop = useCallback(() => {
		if (!checkCollision(player, stage, { x: 0, y: 1 })) {
			updatePlayerPos({ x: 0, y: 1, collided: false });
		} else {
			if (player.pos.y <= 0) {
				handleGameOver();
			} else {
				updatePlayerPos({ x: 0, y: 0, collided: true });
			}
		}
	}, [player, stage, updatePlayerPos, handleGameOver]);

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
		let yPos = player.pos.y;
		while (
			!checkCollision(player, stage, { x: 0, y: yPos - player.pos.y + 1 })
		) {
			yPos += 1;
		}
		if (yPos - player.pos.y <= 0) {
			handleGameOver();
		} else {
			updatePlayerPos({ x: 0, y: yPos - player.pos.y, collided: true });
		}
	}, [player, stage, updatePlayerPos, handleGameOver]);

	const handleRestoreBlocks = useCallback(() => {
		if (gameStatus === 'running') swapWithHold();
	}, [gameStatus, swapWithHold]);

	const handleNextGame = useCallback(() => {
		selectedLevel.current++;
		gameStart();
	}, [selectedLevel, gameStart]);

	const handleExitGame = useCallback(() => {
		setGameStatus('exit');
		setGamePhrase('게임 종료');
		setDropTime(null);
		setStage(createStage());
		setHoldTetromino(null);
		wrapperRef.current.focus();
		setHoldTetromino(null);
		setAnimationKey((prev) => prev + '1');
		clearInterval(intervalId); // 게임 종료 시 타이머 클리어
	}, [
		setGameStatus,
		setGamePhrase,
		setDropTime,
		setStage,
		setHoldTetromino,
		wrapperRef,
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
		if (clearedRows >= 0) {
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

	useEffect(() => {
		if (rows >= linesToClear) {
			setGameStatus('clear');
			setGamePhrase('game clear !!!');
			setStage(createStage());
			clearInterval(intervalId); // 레벨 클리어 시 타이머 클리어
		}
	}, [rows, intervalId, setStage, linesToClear]);

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

	const gamePauseClicked = () => {
		if (gameStatus !== 'running' && gameStatus !== 'paused') return; // 블락 사운드 내지 리턴
		if (gameStatus === 'paused') wrapperRef.current.focus(); // 포커스 이동

		if (gameStatus === 'running') {
			setGameStatus('paused');
			clearInterval(intervalId); // 게임 일시정지 시 타이머 클리어
		}
		if (gameStatus === 'paused') {
			setGameStatus('running');
			const id = setInterval(() => setGameTime((prev) => prev + 1), 1000);
			setIntervalId(id); // 게임 재개 시 타이머 시작
		}

		if (gameStatus === 'paused') setGamePhrase('running');
		if (gameStatus === 'running') setGamePhrase('paused');
	};

	return (
		<>
			{/* 중앙 메시지 */}
			{gamePhrase !== 'running' && gameStatus !== 'clear' && (
				<CentralMessage key={gamePhrase + animationKey}>
					{gamePhrase}
				</CentralMessage>
			)}

			{gameStatus === 'clear' && (
				<CentralButtonWrapper key={gamePhrase + animationKey}>
					<div>GAME CLEAR!</div>
					<div>
						클리어 시간: {new Date(gameTime * 1000).toISOString().substr(11, 8)}
					</div>
					<div>다음 레벨로 진입하시겠습니까?</div>
					<div>
						<button onClick={handleNextGame}>Y</button> &nbsp;
						<button onClick={handleExitGame}>N</button>
					</div>
				</CentralButtonWrapper>
			)}

			{gamePhrase === 'exit' && (
				<CentralMessage key={gamePhrase + animationKey}>
					게임 종료
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
								<Display Ltext={`처리 행`} Rtext={`${rows}/${linesToClear}`} />
								<Display Ltext={`현재 레벨`} Rtext={level} />
								<Display
									Ltext={`게임 시간`}
									Rtext={new Date(gameTime * 1000).toISOString().substr(11, 8)}
								/>{' '}
								{/* 게임 시간 표시 */}
							</div>

							<StyledSelectDiv>
								레벨 선택
								<StyledSelect
									id="level-select"
									value={selectedLevel.current}
									onChange={(e) =>
										(selectedLevel.current = Number(e.target.value))
									}>
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
						gameStatus={gameStatus}
					/>
					<RColumn>
						<Next
							nextTetrominos={nextTetrominos}
							$useBackgroundImage={$useBackgroundImage}
						/>
						<GameBtns
							gameStatus={gameStatus}
							cb1={gameStart}
							cb2={gamePauseClicked}
							cb3={toggleBackground}
						/>
					</RColumn>
				</StyledTetris>
			</StyledTetrisWrapper>
			<Settings />
			<InfoBox />
		</>
	);
};

export default Game;
