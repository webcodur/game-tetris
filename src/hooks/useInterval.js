import { useEffect, useRef } from 'react';

export const useInterval = (dropCallback, delay, gameStatus) => {
	const savedCallback = useRef();

	useEffect(() => {
		savedCallback.current = dropCallback;
	}, [dropCallback]);

	useEffect(() => {
		function tick() {
			savedCallback.current();
		}

		// 일시정지 상태가 아닐 때만 실행
		if (delay !== null && gameStatus !== 'paused' && gameStatus !== 'clear') {
			const id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay, gameStatus]);
};
