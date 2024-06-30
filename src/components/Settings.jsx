import { useState, useEffect } from 'react';
import React from 'react';

import { useAtom } from 'jotai';
import lockAtom from '../atoms/lock';
import startLevelAtom from '../atoms/startLevel';
import linesToClearAtom from '../atoms/linesToClear';

import SettingsStyle from './SettingsStyle';

const Settings = () => {
	const [boxOn, setBoxOn] = useState(false);
	const [inputValue, setInputValue] = useState('');

	const [lock, setLock] = useAtom(lockAtom);

	const [startLevel, setStartLevel] = useAtom(startLevelAtom);
	const [linesToClear, setLinesToClear] = useAtom(linesToClearAtom);

	const [localStartLevel, SetLocalStartLevel] = useState(startLevel);
	const [localLinesToClear, setlocalLinesToClear] = useState(linesToClear);

	const handleChange = (event) => setInputValue(event.target.value);

	const handleStartLevelChange = (event) => {
		SetLocalStartLevel(parseInt(event.target.value, 10));
	};

	const handleLinesToClearChange = (event) => {
		setlocalLinesToClear(parseInt(event.target.value, 10));
	};

	const handleSettings = () => {
		setStartLevel(localStartLevel);
		setLinesToClear(localLinesToClear);
		alert('설정값 적용되었습니다.');
	};

	useEffect(() => {
		if (inputValue === '123123') setLock(false);
		// eslint-disable-next-line
	}, [inputValue]);

	return (
		<SettingsStyle>
			{lock && (
				<input
					type="password"
					value={inputValue}
					onChange={handleChange}
					placeholder="관리자 비밀번호"
				/>
			)}

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
										min={0}
										max={9}
									/>
									&nbsp;레벨
								</td>
							</tr>
						</tbody>
					</table>
					<br />
					<button onClick={handleSettings}>설정 적용</button>
					<hr />
				</>
			)}

			<button
				onClick={() => {
					setBoxOn((prev) => !prev);
				}}>
				게임 설정
			</button>
		</SettingsStyle>
	);
};

export default Settings;
