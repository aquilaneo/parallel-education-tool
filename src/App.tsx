import React, {useEffect, useRef, useState} from 'react';
import Blockly from "blockly";
import * as Ja from "blockly/msg/ja";

import ThreadView from "./ThreadView";
import {Mission} from "./mission";
import * as BlockSettings from "./blockSettings";
import * as BlockDefinitions from "./blockDefinitions";
import * as VariableCanvas from "./variableCanvas";
import "./App.scss";

function App () {
	const [variableCanvas, setVariableCanvas] = useState (new VariableCanvas.VariableCanvas ());
	const [threadIndexes, setThreadIndexes] = useState ([] as number[]);
	const [threadCount, setThreadCount] = useState (threadIndexes.length);
	const [stopwatch, setStopwatch] = useState (new BlockDefinitions.Stopwatch ());

	const editorRef = useRef<EditorView> (null);
	const consoleRef = useRef<ConsoleView> (null);

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
		},
		(text: string) => {
			if (consoleRef.current) {
				consoleRef.current.writeConsole (text);
			}
		}
	));

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
					<EditorView ref={editorRef}/>
				</div>

				<div id={"center-panel"}>
					<div id={"variables-panel"}>
						<div>変数</div>
						<canvas id={"variable-canvas"}></canvas>
						<div>
							<button onClick={() => {
								setThreadIndexes ([...threadIndexes, threadCount]);
								setThreadCount (threadCount + 1);
							}}>
								スレッドを追加
							</button>
							<button onClick={() => {
								const newThreadIndexes = [...threadIndexes];
								newThreadIndexes.splice (newThreadIndexes.length - 1, 1);
								setThreadIndexes (newThreadIndexes);
								setThreadCount (newThreadIndexes.length);
							}}>
								スレッド削除
							</button>
							<button onClick={() => {
								if (editorRef.current) {
									editorRef.current.parseBlocks (variableCanvas, mission);
								}
							}}>
								ブロックをパース
							</button>
							<button onClick={() => {
								if (consoleRef.current) {
									consoleRef.current.clearConsole ();
								}
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
						<div>
							<button onClick={() => {
								if (consoleRef.current) {
									consoleRef.current.writeConsole ("ABC");
								}
							}}>コンソール追加
							</button>
							<button onClick={() => {
								if (consoleRef.current) {
									consoleRef.current.clearConsole ();
								}
							}}>コンソール削除
							</button>
						</div>
					</div>
					<div id={"threads-panel"}>
						<div>スレッド</div>
						<div id={"threads-container"}>
							{
								threadIndexes.map ((threadIndex) => {
									return <ThreadView key={threadIndex}
													   threadIndex={threadIndex} threadCount={threadCount}
													   blocks={"<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"entry_point\" id=\"5e{JeNdzKRK}Nyg(x2Ul\" x=\"58\" y=\"59\"></block></xml>"}/>
								})
							}
						</div>
					</div>
				</div>

				<div id={"right-panel"}>
					<div>コンソール</div>
					<ConsoleView ref={consoleRef}/>
				</div>
			</div>
		</div>
	)
}

class EditorView extends React.Component {
	workspace: Blockly.WorkspaceSvg | null = null;
	initialWorkspace = "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"entry_point\" id=\"5e{JeNdzKRK}Nyg(x2Ul\" x=\"58\" y=\"59\"></block></xml>";
	isExecuting = false;

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
		// 数値型変数追加ボタンの定義
		this.workspace.registerButtonCallback ("createNumberVariableButtonPressed", () => {
			if (this.workspace) {
				const name = window.prompt ("変数名を入力");
				if (name && name !== "") {
					this.workspace.createVariable (name, "Number");
				}
			}
		});
		// 文字列型変数追加ボタンの定義
		this.workspace.registerButtonCallback ("createStringVariableButtonPressed", () => {
			if (this.workspace) {
				const name = window.prompt ("変数名を入力");
				if (name && name !== "") {
					this.workspace.createVariable (name, "String");
				}
			}
		});

		// ローカル変数カテゴリの定義
		this.workspace.registerToolboxCategoryCallback ("TYPED_VARIABLE", (workspace) => {
			const xmlStringList = [];

			// 数値型変数追加ボタン
			xmlStringList.push ("<button text=\"数値型変数の作成...\" callbackKey=\"createNumberVariableButtonPressed\"></button>");
			// 数値型変数をリストアップ
			const numberVariables = workspace.getVariablesOfType ("Number");
			// 数値型変数あったら代入ブロックとそれぞれの取得ブロックを追加
			if (numberVariables.length > 0) {
				// 数値型変数書き込み
				let field = `<field name="variable" id="${numberVariables[0].getId ()}" variabletype="Number"></field>`;
				let value = `<value name="value"><shadow type="math_number"><field name="NUM">0</field></shadow></value>`;
				xmlStringList.push (`<block type="variables_set_number">${field}${value}</block>`);
				// 数値型変数加算
				value = `<value name="value"><shadow type="math_number"><field name="NUM">1</field></shadow></value>`;
				xmlStringList.push (`<block type="variables_add_number">${field}${value}</block>`);
				// 数値型変数読み込み
				for (const numberVariable of numberVariables) {
					field = `<field name="variable" id="${numberVariable.getId ()}" variabletype="Number"></field>`;
					xmlStringList.push (`<block type="variables_get_number">${field}</block>`);
				}
			}

			// 文字列型変数追加ボタン
			xmlStringList.push ("<button text=\"文字列型変数の作成...\" callbackKey=\"createStringVariableButtonPressed\"></button>");
			// 文字列型変数をリストアップ
			const stringVariables = workspace.getVariablesOfType ("String");
			// 文字列型変数あったら代入ブロックとそれぞれの取得ブロックを追加
			if (stringVariables.length > 0) {
				// 文字列型変数書き込み
				let field = `<field name="variable" id="${stringVariables[0].getId ()}" variabletype="String"></field>`;
				const value = `<value name="value"><shadow type="text"></shadow></value>`;
				xmlStringList.push (`<block type="variables_set_string">${field}${value}</block>`);
				// 文字列型変数読み込み
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
		if (!this.isExecuting) {
			this.isExecuting = true;
			const userProgram = this.parseBlocks (variableCanvas, mission);
			if (userProgram) {
				// const thread = new BlockDefinitions.ThreadView ("スレッド", "スレッド", userProgram);
				// thread.execute ();
				mission.resetGlobalArray ();
				variableCanvas.drawTable (mission.currentOneDimensionalArrays, mission.currentTwoDimensionalArrays); // グローバル配列Canvasを初期化
				await userProgram.executeEntryFunction ();
			}
			this.isExecuting = false;
		}
	}

	render () {
		return <div id="blocklyDiv" style={{width: "100%", height: "100%"}}/>;
	}
}

class ConsoleView extends React.Component<{}, { outputs: string[] }> {
	state: { outputs: string[] };

	constructor (props: {}) {
		super (props);
		this.state = {outputs: []};
	}

	writeConsole (text: string) {
		this.setState (state => ({
			outputs: [...state.outputs, text]
		}));
	}

	clearConsole () {
		this.setState ({...this.state, outputs: []});
	}

	render () {
		const outputs = this.state.outputs.map ((item) => {
			return <li key={item}>{item}</li>;
		});

		return (
			<div>
				<ul>{outputs}</ul>
			</div>
		);
	}
}

export default App;
