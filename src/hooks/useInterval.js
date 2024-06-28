import { useEffect, useRef } from 'react';

const useInterval = (cbFuncDrop, delay, gameStatus) => {
	const savedCallback = useRef();

	useEffect(() => {
		savedCallback.current = cbFuncDrop;
	}, [cbFuncDrop]);

	useEffect(() => {
		function tick() {
			savedCallback.current();
		}

		// 일시정지 상태가 아닐 때만 실행
		if (delay !== null && gameStatus !== 'paused') {
			const id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay, gameStatus]);
};

export default useInterval;
