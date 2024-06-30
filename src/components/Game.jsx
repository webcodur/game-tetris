import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";

import Stage from "./Stage";
import Display from "./Display";
import GameBtns from "./GameBtns";
import Next from "./Next";
import Hold from "./Hold";
import Settings from "./Settings.jsx";

import { usePlayer } from "hooks/usePlayer";
import { useStage } from "hooks/useStage";
import { useInterval } from "hooks/useInterval";
import { createStage, checkCollision } from "utils/gameHelpers";
import changeDropTimeByLevel from "utils/changeDropTimeByLevel";
import { playSingleAudio } from "utils/playAudio";

import InfoBox from "./InfoBox";
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
} from "./GameStyles";

import { useAtom } from "jotai";
import startLevelAtom from "atoms/startLevel";
import linesToClearAtom from "atoms/linesToClear";
import DasAtom from "atoms/das";
import ARRAtom from "atoms/arr";

const Game = () => {
  const [DAS] = useAtom(DasAtom);
  const [ARR] = useAtom(ARRAtom);
  const [startLevel] = useAtom(startLevelAtom);
  const [linesToClear] = useAtom(linesToClearAtom);
  const [level, setLevel] = useState(startLevel);
  const [$gameStatus, $setgameStatus] = useState("Hello");
  const [gamePhrase, setGamePhrase] = useState("Hello");
  const [dropTime, setDropTime] = useState(null);
  const [gameTime, setGameTime] = useState(0);
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [$useBackgroundImage, $setuseBackgroundImage] = useState(false);
  const [keyState, setKeyState] = useState({});
  const [keyDownTime, setKeyDownTime] = useState({}); // 각 키가 처음 눌린 시간
  const [animationKey, setAnimationKey] = useState("");
  const [intervalId, setIntervalId] = useState(null);
  const wrapperRef = useRef(null);
  const selectedLevel = useRef(startLevel);

  const [player, updatePlayerPos, resetPlayer, playerRotate, nextTetrominos, holdTetromino, swapWithHold, setHoldTetromino] = usePlayer();

  const [stage, setStage, clearedRows, setClearedRows] = useStage(player, resetPlayer);

  const movePlayer = useCallback(
    (dir) => {
      if (!checkCollision(player, stage, { x: dir, y: 0 })) {
        updatePlayerPos({ x: dir, y: 0 });
      }
    },
    [player, stage, updatePlayerPos],
  );

  // [게임 시작]
  const gameStart = useCallback(async () => {
    changeDropTimeByLevel(selectedLevel.current, setDropTime);
    resetPlayer();
    $setgameStatus("running");
    setAnimationKey((prev) => prev + "1");
    const curLvl = selectedLevel.current;
    const isTest = curLvl === 0;
    setGamePhrase(`게임 시작: ${isTest ? "테스트 모드 " : "level " + curLvl}`);
    const id = setInterval(() => setGameTime((prev) => prev + 1), 1000);
    setIntervalId(id);
  }, [resetPlayer, $setgameStatus, setGamePhrase, setAnimationKey]);

  // [게임 시작 3초전]
  const delayedGameStart = useCallback(async () => {
    if ($gameStatus === "ready") return;
    $setgameStatus("ready");
    setGamePhrase("3");
    setTimeout(() => setGamePhrase("2"), 1000);
    setTimeout(() => setGamePhrase("1"), 2000);
    setTimeout(() => $setgameStatus("starting"), 3000);
    setDropTime(null);
    setStage(createStage());
    setScore(0);
    setRows(0);
    setLevel(selectedLevel.current);
    wrapperRef.current.focus();
    setHoldTetromino(null);
    clearInterval(intervalId);
    setGameTime(0);
    playSingleAudio("countdown.mp3");
  }, [setStage, setHoldTetromino, setDropTime, selectedLevel, $gameStatus, intervalId]);

  useEffect(() => {
    if ($gameStatus === "starting") gameStart();
  }, [$gameStatus, gameStart]);

  const handleGameOver = useCallback(() => {
    $setgameStatus("game over");
    setGamePhrase("game over");
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
      if (direction === "left") {
        while (!checkCollision(player, stage, { x: moveX - 1, y: 0 })) {
          moveX -= 1;
        }
      } else if (direction === "right") {
        while (!checkCollision(player, stage, { x: moveX + 1, y: 0 })) {
          moveX += 1;
        }
      }
      updatePlayerPos({ x: moveX, y: 0 });
    },
    [player, stage, updatePlayerPos],
  );

  const handleSpacePress = useCallback(() => {
    let yPos = player.pos.y;
    while (!checkCollision(player, stage, { x: 0, y: yPos - player.pos.y + 1 })) {
      yPos += 1;
    }
    if (yPos - player.pos.y <= 0) {
      handleGameOver();
    } else {
      updatePlayerPos({ x: 0, y: yPos - player.pos.y, collided: true });
      setKeyState({}); // 블럭이 새로 생성될 때 키 상태 초기화
    }
  }, [player, stage, updatePlayerPos, handleGameOver]);

  const handleRestoreBlocks = useCallback(() => {
    if ($gameStatus === "running") swapWithHold();
  }, [$gameStatus, swapWithHold]);

  const handleNextGame = useCallback(() => {
    selectedLevel.current++;
    delayedGameStart();
  }, [selectedLevel, delayedGameStart]);

  const handleExitGame = useCallback(() => {
    $setgameStatus("exit");
    setGamePhrase("게임 종료");
    setDropTime(null);
    setStage(createStage());
    setHoldTetromino(null);
    wrapperRef.current.focus();
    setHoldTetromino(null);
    setAnimationKey((prev) => prev + "1");
    clearInterval(intervalId); // 게임 종료 시 타이머 클리어
  }, [$setgameStatus, setGamePhrase, setDropTime, setStage, setHoldTetromino, wrapperRef, setAnimationKey, intervalId]);

  const pause = useCallback(() => {
    $setgameStatus("paused");
    setGamePhrase("일시 정지");
    clearInterval(intervalId); // 게임 일시정지 시 타이머 클리어
  }, [$setgameStatus, setGamePhrase, intervalId]);

  const resume = useCallback(() => {
    wrapperRef.current.focus();
    $setgameStatus("running");
    setGamePhrase("게임 재개");
    const id = setInterval(() => setGameTime((prev) => prev + 1), 1000);
    setIntervalId(id); // 게임 재개 시 타이머 시작
  }, []);

  const handlePauseResumeToggle = useCallback(() => {
    if ($gameStatus !== "running" && $gameStatus !== "paused") return; // 블락 사운드 내지 리턴
    if ($gameStatus === "paused") resume();
    else if ($gameStatus === "running") pause();
  }, [$gameStatus, resume, pause]);

  const keyActions = useMemo(
    () => ({
      // 37: (ctrlKey) => (ctrlKey ? movePlayerToEdge("left") : movePlayer(-1)),
      // 39: (ctrlKey) => (ctrlKey ? movePlayerToEdge("right") : movePlayer(1)),
      // 40: () => dropPlayer(),

      37: (ctrlKey) => (ctrlKey ? movePlayerToEdge("left") : movePlayer(-1)),
      39: (ctrlKey) => (ctrlKey ? movePlayerToEdge("right") : movePlayer(1)),
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
      // $gameStatus,
    ],
  );

  useEffect(() => {
    const handleKeyDownInterval = (keyCode, action, condition) => {
      if (keyState[keyCode] && condition()) {
        action();
      }
    };

    const interval = setInterval(() => {
      const now = Date.now();

      const isDASExceeded = (keyCode) => now - keyDownTime[keyCode] > DAS;

      // 대각선 입력 처리 (좌하단, 우하단)
      if (keyState[37] && keyState[40]) {
        if (isDASExceeded(37) || isDASExceeded(40)) {
          movePlayer(-1);
          drop();
        }
      } else if (keyState[39] && keyState[40]) {
        if (isDASExceeded(39) || isDASExceeded(40)) {
          movePlayer(1);
          drop();
        }
      }
      // 개별 키 입력 처리 (좌측, 우측)
      else {
        handleKeyDownInterval(
          37,
          () => movePlayer(-1),
          () => isDASExceeded(37),
        );
        handleKeyDownInterval(
          39,
          () => movePlayer(1),
          () => isDASExceeded(39),
        );
        if (keyState[40]) dropPlayer(); // 아래 키
      }
    }, ARR);

    // 컴포넌트 언마운트 시 인터벌 클리어
    return () => clearInterval(interval);
  }, [keyState, dropPlayer, movePlayer, keyDownTime, drop, ARR, DAS]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const keyCode = event.keyCode;

      // [게임 클리어] 기타 키 접근제어
      if ($gameStatus === "clear") {
        if (keyCode === 89) handleNextGame(); // 'y'
        if (keyCode === 78) handleExitGame(); // 'n'
        return;
      }

      setKeyState((prev) => ({ ...prev, [keyCode]: true }));
      setKeyDownTime((prev) => ({ ...prev, [keyCode]: Date.now() }));

      if ($gameStatus === "running" || $gameStatus === "clear") {
        if (keyActions[keyCode]) {
          keyActions[keyCode](event.ctrlKey);
        }
      }
      if (keyCode === 13 && $gameStatus !== "ready") delayedGameStart();
      if (keyCode === 80 && $gameStatus === "paused") resume();
      if (keyCode === 80 && $gameStatus === "running") pause();
    };

    const handleKeyUp = (event) => {
      const keyCode = event.keyCode;
      setKeyState((prev) => ({ ...prev, [keyCode]: false }));
      if ($gameStatus === "running" && keyCode === 40) {
        changeDropTimeByLevel(level, setDropTime);
      }
      setKeyDownTime((prev) => ({ ...prev, [keyCode]: null }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [$gameStatus, keyActions, level, delayedGameStart, pause, resume]);

  useInterval(
    () => {
      if (level !== 0) drop();
    },
    dropTime,
    $gameStatus,
  );

  useEffect(() => {
    if (clearedRows > 0) {
      setAnimationKey((prev) => prev + "1");
      setGamePhrase(`${clearedRows}줄 클리어!`);
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
      $setgameStatus("clear");
      setGamePhrase("game clear !!!");
      setStage(createStage());
      clearInterval(intervalId); // 레벨 클리어 시 타이머 클리어
    }
  }, [rows, intervalId, setStage, linesToClear]);

  const toggleBackground = () => {
    $setuseBackgroundImage((prev) => !prev);
    wrapperRef.current.focus();
  };

  return (
    <>
      {/* 중앙 메시지 */}
      {gamePhrase !== "running" && $gameStatus !== "clear" && (
        <CentralMessage key={gamePhrase + animationKey} $gameStatus={$gameStatus}>
          {gamePhrase}
        </CentralMessage>
      )}

      {$gameStatus === "clear" && (
        <CentralButtonWrapper key={gamePhrase + animationKey}>
          <div>GAME CLEAR!</div>
          <div>클리어 시간: {new Date(gameTime * 1000).toISOString().substr(11, 8)}</div>
          <div>다음 레벨로 진입하시겠습니까?</div>
          <div>
            <button onClick={handleNextGame}>Y</button> &nbsp;
            <button onClick={handleExitGame}>N</button>
          </div>
        </CentralButtonWrapper>
      )}

      {gamePhrase === "exit" && <CentralMessage key={gamePhrase + animationKey}>게임 종료</CentralMessage>}

      <StyledTetrisWrapper role="button" tabIndex="0" ref={wrapperRef}>
        <StyledTetris>
          <LColumn>
            <LTop>
              <Hold holdTetromino={holdTetromino} $useBackgroundImage={$useBackgroundImage} />
            </LTop>
            <LBottom>
              {/* 수치 확인 */}
              <div>
                <Display Ltext={`점수`} Rtext={score} />
                <Display Ltext={`처리 행`} Rtext={`${rows}/${linesToClear}`} />
                <Display Ltext={`현재 레벨`} Rtext={level} />
                <Display Ltext={`게임 시간`} Rtext={new Date(gameTime * 1000).toISOString().substr(11, 8)} />{" "}
              </div>

              {/* 레벨 선택 */}
              <StyledSelectDiv>
                레벨 선택
                <StyledSelect
                  id="level-select"
                  value={selectedLevel.current}
                  onChange={(e) => (selectedLevel.current = Number(e.target.value))}
                >
                  {[...Array(10).keys()].map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </StyledSelect>
              </StyledSelectDiv>
            </LBottom>
          </LColumn>
          <Stage stage={stage} player={player} $useBackgroundImage={$useBackgroundImage} $gameStatus={$gameStatus} />
          <RColumn>
            <Next nextTetrominos={nextTetrominos} $useBackgroundImage={$useBackgroundImage} />
            <GameBtns $gameStatus={$gameStatus} cb1={delayedGameStart} cb2={handlePauseResumeToggle} cb3={toggleBackground} />
          </RColumn>
        </StyledTetris>
      </StyledTetrisWrapper>
      <Settings />
      <InfoBox />
    </>
  );
};

export default Game;
