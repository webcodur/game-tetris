import styled from "styled-components";

const SettingsStyle = styled.div`
  position: fixed;
  bottom: 10px;
  left: 10px;
  background: #333;
  color: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
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
      div {
        text-align: center;
        line-height: 30px;
        border: 1px solid gray;
        padding: 5px;
      }
    }

    th {
      text-align: center;
    }

    svg {
      font-size: 1rem;
    }
  }

  button {
    font-size: 20px;
    background: #333;
    color: white;
    cursor: pointer;
  }

  input {
    background: #444;
    color: white;
    border: 1px solid #555;
    border-radius: 5px;
    padding: 5px;
    font-size: 1rem;
    width: 80px;

    &::placeholder {
      color: #888;
    }
  }
  hr {
    width: 350px;
    text-align: center;
  }
`;

export default SettingsStyle;
