// styles/GameStyles.js
import styled from 'styled-components';

export const StyledTetrisWrapper = styled.div`
	width: 100vw;
	height: 100vh;
	background: black;
`;

export const StyledTetris = styled.div`
	display: flex;
	align-items: flex-start;
	padding: 40px;
	margin: 0 auto;
	max-width: 900px;

	aside {
		width: 100%;
		max-width: 200px;
		display: block;
		padding: 0 20px;
	}
`;

export const ToggleButton = styled.button`
	box-sizing: border-box;
	margin: 0 0 20px 0;
	padding: 5px;
	min-height: 30px;
	width: 200px;
	border-radius: 20px;
	border: none;
	color: white;
	background: #333;
	font-family: Pixel, Arial, Helvetica, sans-serif;
	font-size: 1rem;
	outline: none;
	cursor: pointer;

	&:focus {
		outline: 3px solid #fff;
	}
`;
