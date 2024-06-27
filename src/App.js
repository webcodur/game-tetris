import { createGlobalStyle } from 'styled-components';
import Game from './components/Game';

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  * {
    box-sizing: border-box;
  }
`;

// ReactDOM.render 또는 App 컴포넌트 내에 GlobalStyle 컴포넌트를 추가
const App = () => (
	<>
		<GlobalStyle />
		<Game />
	</>
);

export default App;
