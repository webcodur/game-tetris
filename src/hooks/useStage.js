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
            // 각 블록의 게임판 내 위치를 계산
            const blockY = y + player.pos.y;
            const blockX = x + player.pos.x;

            // 각 블록이 게임판의 경계를 벗어나지 않는지 확인
            if (
              blockY >= 0 && // 위쪽 경계 확인
              blockY < newStage.length && // 아래쪽 경계 확인
              blockX >= 0 && // 왼쪽 경계 확인
              blockX < newStage[0].length // 오른쪽 경계 확인
            ) {
              // 테트로미노의 위치를 게임판에 반영
              newStage[blockY][blockX] = [value, `${player.collided ? "merged" : "clear"}`];
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

// clear 상태:
// 테트로미노가 아직 이동 중이거나 내려오고 있는 상태.
// 테트로미노 블록이 이동할 수 있는 상태를 의미한다.
// 이 상태에서는 테트로미노 블록이 다른 블록이나 바닥에 닿지 않아서 계속 움직일 수 있다.

// merged 상태:
// 테트로미노가 더 이상 이동하지 않는 상태.
// 테트로미노 블록이 바닥이나 다른 블록에 닿아서 고정된 상태를 의미한다.
// 이 상태에서는 테트로미노 블록이 이동을 멈추고 게임판의 일부가 되어 더 이상 움직이지 않는다.
