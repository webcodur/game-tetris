import { useState } from "react";
import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaRedo, FaUndo, FaSyncAlt } from "react-icons/fa";
import styled from "styled-components";

const InfoBoxStyle = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: #333;
  color: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  gap: 10px;
  padding: 15px;
  font-size: 1.2rem;
  border: 2px solid lightgray;

  table {
    width: 100%;
    border-collapse: collapse;
    th,
    td {
      padding: 5px 10px;
      text-align: left;
      vertical-align: middle;
    }
    th {
      text-align: center;
    }

    svg {
      font-size: 1rem;
    }
  }

  hr {
    width: 300px;
    text-align: center;
  }

  button {
    font-size: 20px;
    background: #333;
    color: white;
    cursor: pointer;
  }
`;

const InfoBox = () => {
  const [boxOn, setBoxOn] = useState(false);

  return (
    <InfoBoxStyle>
      {/* 설명서 */}
      {boxOn && (
        <>
          {" "}
          <table>
            <thead>
              <tr>
                <th>입력</th>
                <th>동작</th>
              </tr>
            </thead>
            <tbody>
              {/* CLOCK */}
              <tr>
                <td>
                  <FaArrowUp />, <b>X</b>
                </td>
                <td>
                  <FaRedo /> [시계방향 회전]
                </td>
              </tr>

              {/* ANTI CLOCK */}
              <tr>
                <td>
                  <b>Z</b>
                </td>
                <td>
                  <FaUndo /> [반시계방향 회전]
                </td>
              </tr>

              {/* 180 */}
              <tr>
                <td>
                  <b>A</b>
                </td>
                <td>
                  <FaSyncAlt /> [180도 회전]
                </td>
              </tr>

              {/* Soft Drop */}
              <tr>
                <td>
                  <FaArrowDown />
                </td>
                <td>Soft Drop</td>
              </tr>

              {/* Hard Drop */}
              <tr>
                <td>
                  <b>SPACE</b>
                </td>
                <td>Hard Drop</td>
              </tr>

              {/* EDGE */}
              <tr>
                <td>
                  <b>CTRL</b> <FaArrowLeft /> / <FaArrowRight />
                </td>
                <td>양 끝으로</td>
              </tr>

              {/* HOLD */}
              <tr>
                <td>
                  <b>C</b>
                </td>
                <td>보관함 이동</td>
              </tr>

              <tr>
                <td>
                  <b>p</b>
                </td>
                <td>puase/resume</td>
              </tr>

              <tr>
                <td>
                  <b>ENTER</b>
                </td>
                <td>게임시작</td>
              </tr>
            </tbody>
          </table>
          <hr />
        </>
      )}

      {/* ON/OFF 버튼 */}
      <button
        onClick={() => {
          setBoxOn((prev) => !prev);
        }}
      >
        키 설명
      </button>
    </InfoBoxStyle>
  );
};

export default InfoBox;
