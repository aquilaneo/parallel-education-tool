import * as Mission from "./mission";

export const missionContents: Mission.MissionContent[] = [];

// ミッション1-1
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	missionContents.push ({
		missionTitle: "[1章 基本操作編 - 1.ブロックの並べ方とprintブロック]",
		missionExplanation: "ブロックの操作とprintブロックの使い方を学びます。",
		missionID: "mission1-1",
		goal: `コンソールに "Hello" と出力する`,
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			return consoleOutputs.length === 1 && consoleOutputs[0] === "Hello";
		}
	});
}

// ミッション1-5
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	twoDimensionalArrays.addConstArray ("Array1", [
		[1, 2, 3, 4],
		[5, 6, 7, 8]
	]);
	twoDimensionalArrays.addRandomArray ("Array2", 2, 2, 0, 100);
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	oneDimensionalArrays.addRandomArray ("Array3", 4, 0, 10);
	missionContents.push ({
		missionTitle: "[1章 基本操作編 - 5.グローバル配列]",
		missionExplanation: "グローバル配列について学びます。",
		missionID: "mission1-5",
		goal: `グローバル配列 "Array1" の値をすべて0にする`,
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			for (const row of twoDimensionalArraysResult["Array1"]) {
				for (const element of row) {
					if (element !== 0) {
						return false;
					}
				}
			}
			return true;
		}

	})
}
