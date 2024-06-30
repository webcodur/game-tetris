const changeDropTimeByLevel = (levelValue, setDropTime) => {
	const speedLevels = [
		1000, // level 0
		800, // level 1
		600, // level 2
		400, // level 3
		300, // level 4
		200, // level 5
		150, // level 6
		100, // level 7
		80, // level 8
		60, // level 9
	];
	setDropTime(speedLevels[levelValue] || 60);
	// default to fastest if levelValue exceeds array length
};

export default changeDropTimeByLevel;
