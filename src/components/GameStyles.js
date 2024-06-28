import styled from 'styled-components';

export const StyledTetrisWrapper = styled.div`
	width: 100vw;
	height: 100vh;
	background: #000;
	background: wheat;
	background-size: cover;
	overflow: hidden;
`;

export const StyledTetris = styled.div`
	display: flex;
	align-items: flex-start;
	padding: 40px;
	margin: 0 auto;
	max-width: 1100px;
	background: brown;

	aside {
		width: 100%;
		max-width: 200px;
		display: block;
		padding: 0 20px;
	}
`;

export const LColumn = styled.div`
	padding: 0px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 90vh;
	width: 500px;
	margin-right: 20px;
`;

export const LTop = styled.div`
	height: 400px;
	background-color: green;
`;

export const LBottom = styled.div`
	height: 400px;
	background-color: green;
`;

export const RColumn = styled.div``;

export const ToggleButton = styled.button`
	box-sizing: border-box;
	margin: 20px 0;
	padding: 20px;
	min-height: 30px;
	width: 100%;
	border-radius: 20px;
	border: none;
	color: white;
	background: #333;
	font-family: Pixel, Arial, Helvetica, sans-serif;
	font-size: 1rem;
	outline: none;
	cursor: pointer;
`;
