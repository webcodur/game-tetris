import { useState, useEffect } from "react";
import React from "react";
import Modal from "react-modal";
import { useAtom } from "jotai";
import lockAtom from "../atoms/lock";
import startLevelAtom from "../atoms/startLevel";
import linesToClearAtom from "../atoms/linesToClear";
import DasAtom from "atoms/das";
import ARRAtom from "atoms/arr";

import SettingsStyle from "./SettingsStyle";
Modal.setAppElement("#root");

const Settings = () => {
  const [boxOn, setBoxOn] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // LOCK
  const [lock, setLock] = useAtom(lockAtom);

  // GLOBAL VALUES
  const [DAS, setDAS] = useAtom(DasAtom);
  const [ARR, setARR] = useAtom(ARRAtom);
  const [startLevel, setStartLevel] = useAtom(startLevelAtom);
  const [linesToClear, setLinesToClear] = useAtom(linesToClearAtom);

  // LOCAL VALUES
  const [localDAS, setLocalDAS] = useState(DAS);
  const [localARR, setLocalARR] = useState(ARR);
  const [localStartLevel, SetLocalStartLevel] = useState(startLevel);
  const [localLinesToClear, setlocalLinesToClear] = useState(linesToClear);

  const handleChange = (event) => setInputValue(event.target.value);

  const handleStartLevelChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value >= 0 && value <= 9) {
      SetLocalStartLevel(value);
    }
  };

  const handleDASchange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value >= 50 && value <= 500) {
      setLocalDAS(value);
    }
  };

  const handleARRchange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value >= 10 && value <= 300) {
      setLocalARR(value);
    }
  };

  const handleLinesToClearChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value >= 3 && value <= 100) {
      setlocalLinesToClear(value);
    }
  };

  const handleSettings = () => {
    setStartLevel(localStartLevel);
    setLinesToClear(localLinesToClear);
    setDAS(localDAS);
    setARR(localARR);
    alert("설정값 적용되었습니다.");
  };

  const handleBoxOpen = () => {
    if (boxOn) {
      SetLocalStartLevel(startLevel);
      setLocalDAS(DAS);
      setLocalARR(ARR);
      setlocalLinesToClear(linesToClear);
      setBoxOn(false);
    } else {
      setBoxOn(true);
    }
  };

  useEffect(() => {
    if (inputValue === "123123") setLock(false);
  }, [inputValue, setLock]);

  return (
    <SettingsStyle>
      {lock && <input type="password" value={inputValue} onChange={handleChange} placeholder="관리자 비밀번호" />}

      {boxOn && !lock && (
        <>
          <table>
            <thead>
              <tr>
                <th>항목</th>
                <th>값</th>
              </tr>
            </thead>

            <tbody>
              {/* 1 */}
              <tr>
                <td>레벨 클리어</td>
                <td>
                  <input
                    type="number"
                    value={localLinesToClear}
                    onChange={handleLinesToClearChange}
                    onInput={handleLinesToClearChange} // 입력 시 제한 적용
                    min={3}
                    max={100}
                  />
                  &nbsp;행 격파 시
                </td>
              </tr>

              {/* 2 */}
              <tr>
                <td>시작 레벨</td>
                <td>
                  <input
                    type="number"
                    value={localStartLevel}
                    onChange={handleStartLevelChange}
                    onInput={handleStartLevelChange} // 입력 시 제한 적용
                    min={0}
                    max={9}
                  />
                  &nbsp;레벨
                </td>
              </tr>

              <tr>
                <td>DAS</td>
                <td>
                  <input
                    type="number"
                    value={localDAS}
                    onChange={handleDASchange}
                    onInput={handleDASchange} // 입력 시 제한 적용
                    min={50}
                    max={500}
                  />
                  &nbsp;ms{" "}
                  <button onClick={openModal} style={{ marginLeft: "10px" }}>
                    [ℹ]
                  </button>
                </td>
              </tr>

              <tr>
                <td>ARR</td>
                <td>
                  <input
                    type="number"
                    value={localARR}
                    onChange={handleARRchange}
                    onInput={handleARRchange} // 입력 시 제한 적용
                    min={10}
                    max={300}
                  />
                  &nbsp;ms{" "}
                  <button onClick={openModal} style={{ marginLeft: "10px" }}>
                    [ℹ]
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <button onClick={handleSettings}>설정 적용</button>
          <hr />
        </>
      )}

      <button onClick={handleBoxOpen}>게임 설정</button>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>DAS</h2>
        <div>
          <p>Delayed Auto Shift (DAS)</p>
          <p>최초 수치: 200ms </p>
          <p>제한 범위: 50ms ~ 500ms </p>
          <p>키를 길게 눌렀을 때 이동이 시작되기까지의 지연 시간</p>
        </div>
        <hr />
        <h2>ARR</h2>
        <div>
          <p>Auto Repeat Rate (ARR)</p>
          <p>최초 수치: 20ms </p>
          <p>제한 범위: 10ms ~ 300ms </p>
          <p>키를 누르고 있을 때 해당 키가 반복적으로 입력되는 속도</p>
        </div>
        <button onClick={closeModal}>닫기</button>
      </Modal>
    </SettingsStyle>
  );
};

export default Settings;
