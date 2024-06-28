import React from 'react';
import {
	FaArrowUp,
	FaArrowDown,
	FaArrowLeft,
	FaArrowRight,
	FaRedo,
	FaUndo,
	FaSyncAlt,
} from 'react-icons/fa';
import styled from 'styled-components';

const InfoBoxStyle = styled.div`
	background: #333;
	color: white;
	border-radius: 20px;
	width: 400px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
	padding: 15px;
	padding-left: 30px;
	font-size: 1.2rem;

	table {
		width: 100%;
		border-collapse: collapse;
		th,
		td {
			padding: 5px 10px;
			text-align: left;
			vertical-align: middle;
		}

		svg {
			font-size: 1rem;
		}
	}
`;

const InfoBox = () => {
	return (
		<InfoBoxStyle>
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
						<td>SPACE</td>
						<td>Hard Drop</td>
					</tr>

					{/* EDGE */}
					<tr>
						<td>
							CTRL + <FaArrowLeft /> / <FaArrowRight />
						</td>
						<td>양 끝으로</td>
					</tr>

					{/*  */}
					<tr>
						<td>SHIFT</td>
						<td>보관함 이동</td>
					</tr>
				</tbody>
			</table>
		</InfoBoxStyle>
	);
};

export default InfoBox;
