import React, {useEffect, useRef, useState} from 'react';
import Blockly from "blockly";
import * as Ja from "blockly/msg/ja";

import Thread from "./Thread";
import {Mission} from "./mission";
import * as BlockSettings from "./blockSettings";
import * as BlockDefinitions from "./blockDefinitions";
import * as VariableCanvas from "./variableCanvas";
import "./App.scss";

function App () {
	const [variableCanvas, setVariableCanvas] = useState (new VariableCanvas.VariableCanvas ());
	const [threads, setThreads] = useState ([
		{index: 0},
		{index: 1},
		{index: 2},
		{index: 3}
	]);
	const [threadCount, setThreadCount] = useState (threads.length);
	const editorRef = useRef<Editor> (null);

	const [stopwatch, setStopwatch] = useState (new BlockDefinitions.Stopwatch ());

	const twoDimensionalArrays: { [key: string]: number[][] } = {};
	twoDimensionalArrays["Array1"] = [
		[1, 2, 3, 4],
		[5, 6, 7, 8]
	];
	twoDimensionalArrays["Array2"] = [
		[9, 10],
		[11, 12]
	];

	const [mission, setMission] = useState (new Mission ({}, twoDimensionalArrays,
		() => {
			variableCanvas.drawTable (mission.currentOneDimensionalArrays, mission.currentTwoDimensionalArrays);
		}));

	useEffect (() => {
		const canvas = document.getElementById ("variable-canvas") as HTMLCanvasElement;
		variableCanvas.initialize (canvas);
		variableCanvas.drawTable (mission.currentOneDimensionalArrays, mission.currentTwoDimensionalArrays);
		// リサイズ処理
		window.onresize = () => {
			variableCanvas.resize ();
			variableCanvas.drawTable (mission.currentOneDimensionalArrays, mission.currentTwoDimensionalArrays);
		};
	});

	return (
		<div style={{width: "100vw", height: "100vh"}}>
			<div id={"top-menu"}>
				<div>名前</div>
				<div>第1章 「OOOOOOOO」</div>
				<div>ユーザアイコン</div>
			</div>
			<div id={"main-view"}>
				<div id={"left-panel"}>
					<Editor ref={editorRef}/>
				</div>

				<div id={"center-panel"}>
					<div id={"variables-panel"}>
						<div>変数</div>
						<canvas id={"variable-canvas"}></canvas>
						<div>
							<button onClick={() => {
								setThreads ([...threads, {index: threadCount}]);
								setThreadCount (threadCount + 1);
							}}>
								スレッドを追加
							</button>
							<button onClick={() => {
								if (editorRef.current) {
									editorRef.current.parseBlocks (variableCanvas, mission);
								}
							}}>
								ブロックをパース
							</button>
							<button onClick={() => {
								if (editorRef.current) {
									editorRef.current.executeEntryFunction (variableCanvas, mission);
								}
							}}>
								ブロックを実行
							</button>
							<button onClick={() => {
								if (editorRef.current) {
									console.log (editorRef.current.getXml ());
								}
							}}>
								XML出力
							</button>
							<button onClick={() => {
								if (editorRef.current) {
									const xml = window.prompt ("XMLを入力");
									if (xml) {
										editorRef.current.xmlToWorkspace (xml);
									}
								}
							}}>
								XML入力
							</button>
						</div>
						<div>
							<button onClick={() => {
								stopwatch.start ();
							}}>SW開始
							</button>
							<button onClick={() => {
								stopwatch.stop ();
							}}>
								SW停止
							</button>
							<button onClick={() => {
								stopwatch.reset ();
							}}>SWリセット
							</button>
							<button onClick={() => {
								console.log (stopwatch.read ());
							}}>SW読み取り
							</button>
						</div>
					</div>
					<div id={"threads-panel"}>
						<div>スレッド</div>
						<div id={"threads-container"}>
							{
								threads.map ((thread) => {
									return <Thread key={thread.index} info={thread} count={threadCount}/>
								})
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

class Editor extends React.Component {
	workspace: Blockly.WorkspaceSvg | null = null;
	initialWorkspace = "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"entry_point\" id=\"5e{JeNdzKRK}Nyg(x2Ul\" x=\"58\" y=\"59\"></block></xml>";

	componentDidMount () {
		// ブロック定義とブロックリストを読み込み
		BlockSettings.initBlocks ();
		const xml = BlockSettings.getBlockListXml ();
		const xmlParser = new DOMParser ();
		const xmlDom = xmlParser.parseFromString (xml, "text/xml");

		// ワークスペースを生成
		const document: HTMLElement | undefined = xmlDom.getElementById ("toolbox") || undefined; // 要素取得して型合わせ
		Blockly.setLocale (Ja);
		this.workspace = Blockly.inject ("blocklyDiv", {
			toolbox: document,
			disable: true
		});

		// ========== 変数関連設定 ==========
		// 数値型変数カテゴリの定義
		this.workspace.registerToolboxCategoryCallback ("NUMBER_VARIABLE", (workspace) => {
			const xmlStringList = ["<button text=\"数値型変数の作成...\" callbackKey=\"createNumberVariableButtonPressed\"></button>"];

			// 数値型変数をリストアップ
			const numberVariables = workspace.getVariablesOfType ("Number");
			// 数値型変数あったら代入ブロックとそれぞれの取得ブロックを追加
			if (numberVariables.length > 0) {
				const value = `<value name="value"><shadow type="math_number"><field name="NUM">0</field></shadow></value>`;
				let field = `<field name="variable" id="${numberVariables[0].getId ()}" variabletype="Number"></field>`;
				xmlStringList.push (`<block type="variables_set_number">${field}${value}</block>`);
				for (const numberVariable of numberVariables) {
					field = `<field name="variable" id="${numberVariable.getId ()}" variabletype="Number"></field>`;
					xmlStringList.push (`<block type="variables_get_number">${field}</block>`);
				}
			}

			// xmlStringListをElement型にして返す
			return xmlStringList.map ((item) => {
				return Blockly.Xml.textToDom (item);
			});
		});

		// 数値型変数カテゴリのボタン挙動定義
		this.workspace.registerButtonCallback ("createNumberVariableButtonPressed", () => {
			if (this.workspace) {
				const name = window.prompt ("変数名を入力");
				if (name && name !== "") {
					this.workspace.createVariable (name, "Number");
				}
			}
		});

		// 文字列型変数カテゴリの定義
		this.workspace.registerToolboxCategoryCallback ("STRING_VARIABLE", (workspace) => {
			const xmlStringList = ["<button text=\"文字列型変数の作成...\" callbackKey=\"createStringVariableButtonPressed\"></button>"];

			// 数値型変数をリストアップ
			const stringVariables = workspace.getVariablesOfType ("String");
			// 数値型変数あったら代入ブロックとそれぞれの取得ブロックを追加
			if (stringVariables.length > 0) {
				const value = `<value name="value"><shadow type="text"></shadow></value>`;
				let field = `<field name="variable" id="${stringVariables[0].getId ()}" variabletype="String"></field>`;
				xmlStringList.push (`<block type="variables_set_string">${field}${value}</block>`);
				for (const numberVariable of stringVariables) {
					field = `<field name="variable" id="${numberVariable.getId ()}" variabletype="String"></field>`;
					xmlStringList.push (`<block type="variables_get_string">${field}</block>`);
				}
			}

			// xmlStringListをElement型にして返す
			return xmlStringList.map ((item) => {
				return Blockly.Xml.textToDom (item);
			});
		});

		// 文字列型変数カテゴリのボタン挙動定義
		this.workspace.registerButtonCallback ("createStringVariableButtonPressed", () => {
			if (this.workspace) {
				const name = window.prompt ("変数名を入力");
				if (name && name !== "") {
					this.workspace.createVariable (name, "String");
				}
			}
		});
		// ================================

		// 最初のワークスペースを読み込み
		const initialWorkspaceDom = Blockly.Xml.textToDom (this.initialWorkspace);
		Blockly.Xml.domToWorkspace (initialWorkspaceDom, this.workspace);
	}

	getXml () {
		if (this.workspace) {
			const dom = Blockly.Xml.workspaceToDom (this.workspace);
			return Blockly.Xml.domToText (dom);
		} else {
			return "";
		}
	}

	xmlToWorkspace (xml: string) {
		if (this.workspace) {
			this.workspace.clear ();
			const dom = Blockly.Xml.textToDom (xml);
			Blockly.Xml.domToWorkspace (dom, this.workspace);
		}
	}

	parseBlocks (variableCanvas: VariableCanvas.VariableCanvas, mission: Mission) {
		// ワークスペース上のブロックをプログラム化
		if (this.workspace) {
			const xml = Blockly.Xml.workspaceToDom (this.workspace);
			return new BlockDefinitions.UserProgram (xml, mission);
		} else {
			return null;
		}
	}

	async executeEntryFunction (variableCanvas: VariableCanvas.VariableCanvas, mission: Mission) {
		const userProgram = this.parseBlocks (variableCanvas, mission);
		if (userProgram) {
			// const thread = new BlockDefinitions.Thread ("スレッド", "スレッド", userProgram);
			// thread.execute ();
			mission.resetGlobalArray ();
			variableCanvas.drawTable (mission.currentOneDimensionalArrays, mission.currentTwoDimensionalArrays); // グローバル配列Canvasを初期化
			await userProgram.executeEntryFunction ();
		}
	}

	render () {
		return <div id="blocklyDiv" style={{width: "100%", height: "100%"}}/>;
	}
}

export default App;
