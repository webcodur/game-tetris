import { useState, useEffect } from "react";
import { createStage } from "../utils/gameHelpers";

export const useStage = (player, resetPlayer) => {
  const [stage, setStage] = useState(createStage());
  const [clearedRows, setClearedRows] = useState(0);

  const sweepRows = (newStage) => {
    const rowsCleared = newStage.reduce((ack, row) => {
      if (row.findIndex((cell) => cell[0] === 0) === -1) {
        setClearedRows((prev) => prev + 1);
        ack.unshift(new Array(newStage[0].length).fill([0, "clear"]));
        return ack;
      }
      ack.push(row);
      return ack;
    }, []);
    return rowsCleared;
  };

  useEffect(() => {
    const updateStage = (prevStage) => {
      // 이전 게임판을 복사하고, 'clear' 상태인 셀은 [0, "clear"]로 초기화
      const newStage = prevStage.map((row) => row.map((cell) => (cell[1] === "clear" ? [0, "clear"] : cell)));

      // 플레이어의 테트로미노를 게임판에 배치
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            // 테트로미노의 블록이 비어있지 않을 때
            if (
              y + player.pos.y >= 0 &&
              y + player.pos.y < newStage.length &&
              x + player.pos.x >= 0 &&
              x + player.pos.x < newStage[0].length
            ) {
              // 테트로미노의 위치를 게임판에 반영
              newStage[y + player.pos.y][x + player.pos.x] = [value, `${player.collided ? "merged" : "clear"}`];
            }
          }
        });
      });

      // 플레이어가 충돌했을 때
      if (player.collided) {
        resetPlayer(); // 플레이어 상태를 초기화
        return sweepRows(newStage); // 줄을 제거하고 업데이트된 게임판 반환
      }

      return newStage; // 충돌하지 않았을 때 업데이트된 게임판 반환
    };

    setStage((prev) => updateStage(prev));
  }, [player, resetPlayer]);

  return [stage, setStage, clearedRows, setClearedRows];
};
