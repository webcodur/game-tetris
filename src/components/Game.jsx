import React, { useState, useEffect, useCallback, useRef } from 'react';
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { createStage, checkCollision } from '../gameHelpers';
import {} from '../gameHelpers';
import useInterval from '../hooks/useInterval';
import InfoBox from './InfoBox';
import { StyledTetrisWrapper, StyledTetris, ToggleButton } from './GameStyles';

const Game = () => {
	const [dropTime, setDropTime] = useState(null);
	const [gameOver, setGameOver] = useState(false);
	const [score, setScore] = useState(0);
	const [spacePressed, setSpacePressed] = useState(false);
	const [useBackgroundImage, setUseBackgroundImage] = useState(false); // 추가

	const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
	const [stage, setStage] = useStage(player, resetPlayer);

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
		setDropTime(1000);
		resetPlayer();
		setGameOver(false);
		setScore(0);
		setSpacePressed(false); // 게임 시작 시 spacePressed 초기화
		wrapperRef.current.focus(); // 포커스를 게임 영역으로 이동
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
		37: (ctrlKey) => (ctrlKey ? movePlayerToEdge('left') : movePlayer(-1)), // 왼쪽 방향키
		39: (ctrlKey) => (ctrlKey ? movePlayerToEdge('right') : movePlayer(1)), // 오른쪽 방향키
		40: () => dropPlayer(), // 아래 방향키
		38: () => playerRotate(stage, 1), // 위 방향키 (시계 방향 회전)
		88: () => playerRotate(stage, 1), // X 키 (시계 방향 회전)
		90: () => playerRotate(stage, -1), // Z 키 (반시계 방향 회전)
		65: () => playerRotate(stage, 2), // A 키 (180도 회전)
		32: () => handleSpacePress(), // 스페이스바
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
			// 왼쪽 끝까지 이동 가능한 거리 계산
			while (!checkCollision(player, stage, { x: moveX - 1, y: 0 })) {
				moveX -= 1;
			}
		} else if (direction === 'right') {
			// 오른쪽 끝까지 이동 가능한 거리 계산
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
			setSpacePressed(true); // 첫 번째 스페이스 키 누름 처리
		}
	}, [player, stage, updatePlayerPos, spacePressed]);

	const keyUp = useCallback(
		({ keyCode }) => {
			if (!gameOver) {
				if (keyCode === 40) {
					setDropTime(1000);
				} else if (keyCode === 32) {
					// space 키를 뗐을 때
					setSpacePressed(false); // 스페이스 키를 떼면 상태 초기화
				}
			}
		},
		[gameOver]
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

	const toggleBackground = () => {
		setUseBackgroundImage((prev) => !prev); // 배경 이미지 사용 여부 토글
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
							<Display text="Rows" />
							<Display text="Level" />
						</div>
					)}

					<StartButton callback={startGame} />
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
