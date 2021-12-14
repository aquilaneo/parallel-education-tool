import React, {useEffect, useRef, useState} from 'react';
import {Link} from "react-router-dom";
import Blockly, {WorkspaceSvg} from "blockly";
import * as Ja from "blockly/msg/ja";

import {Mission, MissionContent} from "./mission";
import {missionContents} from "./missionContents";
import * as BlockSettings from "./blockSettings";
import * as BlockDefinitions from "./blockDefinitions";
import * as VariableCanvas from "./variableCanvas";
import * as PlaygroundModals from "./playground-modals";
import {UserProgram} from "./blockDefinitions";

import "./playground.scss";
import HomeIcon from "./img/Home.svg";
import NextIcon from "./img/Next.svg";
import ClearSmallIcon from "./img/Clear_small.svg";
import NotClearPurpleIcon from "./img/NotClear_purple.svg";
import NotClearWhiteIcon from "./img/NotClear_white.svg";
import FlagIcon from "./img/Flag.svg";
import InfoIcon from "./img/Info.svg";
import ProgramIcon from "./img/Program.svg";
import VisualizerIcon from "./img/Visualizer.svg";
import ConsoleIcon from "./img/Console.svg";
import ThreadIcon from "./img/Threads.svg";
import PlayIcon from "./img/Play.svg";
import BinIcon from "./img/Bin.svg";

const Playground: React.FC<{ missionID: string }> = (props) => {
	// state定義
	const [isDetailVisible, setIsDetailVisible] = useState (true);
	const [isClearVisible, setIsClearVisible] = useState (false);
	const [isFailedVisible, setIsFailedVisible] = useState (false);
	const [variableCanvas, setVariableCanvas] = useState (() => {
		return new VariableCanvas.VariableCanvas ()
	});
	const [threadInfos, setThreadInfos] = useState ([] as { name: string, blocksXml: string }[]);
	const [threadCount, setThreadCount] = useState (threadInfos.length);
	const [missionFailReason, setMissionFailReason] = useState ("");
	const [programSpeed, setProgramSpeed] = useState (1);

	// 参照の取得
	const editorRef = useRef<EditorView> (null);
	const threadRefs: (ThreadView | null)[] = [];
	const consoleRef = useRef<ConsoleView> (null);

	// ミッション定義
	const foundMission = missionContents.findMissionByID (props.missionID);
	let missionContent: MissionContent;
	if (foundMission) {
		missionContent = foundMission;
	} else {
		missionContent = missionContents.missionContents[0].contents[0];
	}
	const nextMission = missionContents.findNextMission (missionContent.missionID);

	const [mission, setMission] = useState (() => {
		return new Mission (missionContent, variableCanvas,
			(output: { text: string, type: ConsoleOutputType }) => {
				if (consoleRef.current) {
					consoleRef.current.writeConsole (output);
				}
			},
			() => {
				if (consoleRef.current) {
					consoleRef.current.clearConsole ();
				}
			},
			(threadInfo: { name: string, blocksXml: string }) => {
				setThreadInfos ((oldThreadNames) => [...oldThreadNames, threadInfo]);
				setThreadCount ((oldThreadCount) => oldThreadCount + 1);
			},
			(threadName: string) => {
				setThreadInfos ((oldThreadInfos) => {
					const newThreadNames = [...oldThreadInfos].filter ((item) => {
						return item.name !== threadName;
					});
					setThreadCount (newThreadNames.length);
					return newThreadNames;
				});
			}
		)
	});

	// エディタパネルリサイズ処理
	function onEditorPanelResized () {
		if (editorRef.current) {
			editorRef.current.onResize ();
		}
	}

	// 中央パネルリサイズ処理
	function onCenterPanelResized () {
		variableCanvas.resize ();
		variableCanvas.drawTable (mission.currentTwoDimensionalArrays, mission.currentOneDimensionalArrays, mission.currentVariables);
		for (const threadView of threadRefs) {
			if (threadView) {
				threadView.onResize ();
			}
		}
	}

	useEffect (() => {
		// 変数パネル
		const canvas = document.getElementById ("variable-canvas") as HTMLCanvasElement;
		variableCanvas.initialize (canvas);
		onCenterPanelResized ();

		// リサイズ処理
		window.addEventListener ("resize", onCenterPanelResized);
	});

	const isGlobalDataExists = Object.keys (missionContent.globalVariables.variables).length > 0 ||
		Object.keys (missionContent.oneDimensionalArrays.arrays).length > 0 ||
		Object.keys (missionContent.twoDimensionalArrays.arrays).length > 0;
	const isThreadsExists = threadCount > 0;

	return (
		<div style={{width: "100vw", height: "100vh"}}>
			{/*<div id={"top-menu"}>*/}
			{/*	<Link to={"/"}>トップへ</Link>*/}
			{/*	<div>*/}
			{/*		<span>{missionContent.missionTitle}</span>*/}
			{/*		<button onClick={() => {*/}
			{/*			setIsDetailVisible (!isDetailVisible);*/}
			{/*		}}>i*/}
			{/*		</button>*/}
			{/*	</div>*/}
			{/*	<div>ユーザアイコン</div>*/}
			{/*</div>*/}
			<div id={"header"}>
				<div id={"header-left"}>
					<Link to={"/"} id={"home-icon-container"}><img src={HomeIcon} id={"home-icon"}/></Link>
					<div id={"title"}>{missionContent.chapterName}</div>
				</div>

				<div id={"header-center"}>
					{
						missionContents.missionContents.filter ((mission) => {
							return mission.chapterName === missionContent.chapterName;
						})[0].contents.map ((item, index) => {
							// アイコン選択
							const currentMission = item.missionID === missionContent.missionID;
							let icon;
							if (item.score.isClear ()) {
								icon = ClearSmallIcon;
							} else if (currentMission) {
								icon = NotClearPurpleIcon;
							} else {
								icon = NotClearWhiteIcon;
							}

							const content = <div>
								<div>{index + 1}</div>
								<div>
									<img src={icon} className={"icon"}/>
								</div>
							</div>;

							if (currentMission) {
								return <div className={"header-mission-list-item"}
											id={"header-mission-list-item-selected"}
											key={item.missionID}>
									{content}
								</div>;
							} else {
								return <Link to={`/missions/${item.chapterNameURL}/${item.missionID}`}
											 className={"header-mission-list-item"}
											 key={item.missionID}>
									{content}
								</Link>;
							}
						})
					}
				</div>

				{
					missionContent.score.isClear () && nextMission ?
						<Link to={`/missions/${nextMission.chapterNameURL}/${nextMission.missionID}`}
							  id={"header-right"}>
							<div>次のミッションへ</div>
							<div><img src={NextIcon}/></div>
						</Link> :
						<div id={"header-right"} style={{visibility: "hidden"}}/>
				}

				{/*<Link to={`/missions/${nextMission.chapterNameURL}/${nextMission.missionID}`}*/}
				{/*	  id={"header-right"} style={{visibility: missionContent.score.isClear () ? "visible" : "hidden"}}>*/}
				{/*	<div>次のミッションへ</div>*/}
				{/*	<div><img src={NextIcon}/></div>*/}
				{/*</Link>*/}
			</div>

			<div id={"mission-detail-bar"}>
				<div id={"mission-title"}>{missionContent.missionTitle}</div>
				<div id={"mission-goal"}>
					<div><img src={FlagIcon} className={"icon"}/></div>
					<div>{missionContent.goal}</div>
					<div><img src={InfoIcon} className={"icon"}/></div>
				</div>
				<div id={"spacer"}></div>
			</div>

			<PlaygroundModals.MissionDetailModal isVisible={isDetailVisible} setIsVisible={setIsDetailVisible}
												 missionContent={missionContent}/>
			<PlaygroundModals.MissionClearModal isVisible={isClearVisible} close={() => {
				setIsClearVisible (false)
			}} missionContent={missionContent} nextMission={nextMission}/>
			<PlaygroundModals.MissionFailedModal isVisible={isFailedVisible} close={() => {
				setIsFailedVisible (false)
			}} missionContent={missionContent} failReason={missionFailReason}/>


			<div id={"main-view"}>
				<div id={"center-panel"}>
					<div id={"upper-panel"}>
						<div id={"program-view"}>
							<div className={"view-label"}>
								<div className={"view-title"}>
									<div><img src={ProgramIcon} className={"view-icon"}/></div>
									<div>プログラム</div>
								</div>
								<div className={"view-title"}>
									<div>
										<button onClick={() => {
											// [デバッグ用]XML入力
											if (editorRef.current) {
												const xml = window.prompt ("XMLを入力");
												if (xml) {
													editorRef.current.xmlToWorkspace (xml);
												}
											}
										}}>XML入力
										</button>
									</div>
									<div>
										<button onClick={() => {
											// [デバッグ用]XML出力
											if (editorRef.current) {
												console.log (editorRef.current.getXml ());
											}
										}}>XML出力
										</button>
									</div>
									<div id={"speed-slider"}>
										<input type={"range"} name={"speed"} min={"0.2"} max={"4"}
											   value={programSpeed} step={"0.1"}
											   onChange={(event) => {
												   if (editorRef.current) {
													   setProgramSpeed (parseFloat (event.target.value));
													   editorRef.current.setProgramSpeed (programSpeed);
												   }
											   }}/>
										<span>x{programSpeed.toFixed (1)}</span>
									</div>
									<div className={"icon-button"} onClick={() => {
										// プログラム実行ボタン
										if (editorRef.current && !editorRef.current.isExecuting && consoleRef.current) {
											mission.clearConsole ();
											editorRef.current.executeUserProgram (variableCanvas, mission, programSpeed);
										}
									}}>
										<img src={PlayIcon} className={"view-icon"}/>
									</div>
								</div>
							</div>
							<div className={"view-content"}>
								<EditorView ref={editorRef} missionContent={missionContent} closeDetailModal={() => {
									setIsDetailVisible (false);
								}} showClearModal={() => {
									setIsClearVisible (true);
								}} showFailedModal={(failReason: string) => {
									setMissionFailReason (failReason);
									setIsFailedVisible (true);
								}}/>
							</div>
						</div>

						<div id={"visualizer-view"}>
							<div className={"view-label"}>
								<div className={"view-title"}>
									<div><img src={VisualizerIcon} className={"view-icon"}/></div>
									<div>ビジュアライザ</div>
								</div>
								<div/>
							</div>
							<div className={"view-content"}>
								<canvas id={"variable-canvas"} style={{display: isGlobalDataExists ? "block" : "none"}}/>
								<div className={"light-color-text"} style={{display: isGlobalDataExists ? "none" : "flex"}}>
									<div>グローバルデータはありません</div>
								</div>
							</div>
						</div>
					</div>

					<div id={"lower-panel"}>
						<div id={"thread-view"}>
							<div className={"view-label"}>
								<div className={"view-title"}>
									<div><img src={ThreadIcon} className={"view-icon"}/></div>
									<div>スレッドビュー</div>
								</div>
								<div/>
							</div>
							<div className={"view-content"} id={"threads-container"}>
								{
									threadInfos.map ((threadInfo, index) => {
										return <ThreadView ref={item => threadRefs.push (item)} key={threadInfo.name}
														   threadNames={threadInfo.name} threadCount={threadCount}
														   threadIndex={index} blocks={threadInfo.blocksXml}
														   onDidMount={(workspace) => {
															   if (editorRef.current && editorRef.current.userProgram) {
																   editorRef.current.userProgram.setWorkspaceToThread (index, workspace);
															   }
														   }}
										/>
									})
								}
								<div className={"light-color-text"} style={{display: isThreadsExists ? "none" : "flex"}}>
									<div>スレッドはありません</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div id={"right-panel"}>
					<div id={"console-view"}>
						<div className={"view-label"}>
							<div className={"view-title"}>
								<div><img src={ConsoleIcon} className={"view-icon"}/></div>
								<div>コンソール</div>
							</div>
							<div className={"view-title"}>
								<div className={"icon-button"} onClick={() => {
									// コンソール削除
									mission.clearConsole ();
								}}>
									<img src={BinIcon} className={"view-icon"}/>
								</div>
							</div>
						</div>
						<div className={"view-content"}>
							<ConsoleView ref={consoleRef}/>
						</div>
					</div>
				</div>

				{/*<div id={"center-panel"}>*/}
				{/*	<div id={"variables-panel"}>*/}
				{/*<div>*/}
				{/*	<button onClick={() => {*/}
				{/*		if (editorRef.current) {*/}
				{/*			editorRef.current.parseBlocks (variableCanvas, mission);*/}
				{/*		}*/}
				{/*	}}>*/}
				{/*		ブロックをパース*/}
				{/*	</button>*/}
				{/*	<button onClick={() => {*/}
				{/*		if (editorRef.current && !editorRef.current.isExecuting && consoleRef.current) {*/}
				{/*			mission.clearConsole ();*/}
				{/*			editorRef.current.executeUserProgram (variableCanvas, mission, parseFloat (programSpeed));*/}
				{/*		}*/}
				{/*	}}>*/}
				{/*		ブロックを実行*/}
				{/*	</button>*/}
				{/*	<button onClick={() => {*/}
				{/*		if (editorRef.current) {*/}
				{/*			editorRef.current.stopUserProgram ();*/}
				{/*		}*/}
				{/*	}}>*/}
				{/*		実行を停止*/}
				{/*	</button>*/}
				{/*	<button onClick={() => {*/}
				{/*		if (editorRef.current) {*/}
				{/*			console.log (editorRef.current.getXml ());*/}
				{/*		}*/}
				{/*	}}>*/}
				{/*		XML出力*/}
				{/*	</button>*/}
				{/*	<button onClick={() => {*/}
				{/*		if (editorRef.current) {*/}
				{/*			const xml = window.prompt ("XMLを入力");*/}
				{/*			if (xml) {*/}
				{/*				editorRef.current.xmlToWorkspace (xml);*/}
				{/*			}*/}
				{/*		}*/}
				{/*	}}>*/}
				{/*		XML入力*/}
				{/*	</button>*/}
				{/*	<input type={"range"} name={"speed"} min={"0.2"} max={"4"} value={programSpeed} step={"0.1"}*/}
				{/*		   onChange={(event) => {*/}
				{/*			   if (editorRef.current) {*/}
				{/*				   setProgramSpeed (event.target.value);*/}
				{/*				   editorRef.current.setProgramSpeed (parseFloat (programSpeed));*/}
				{/*			   }*/}
				{/*		   }}/>*/}
				{/*	<span>x{programSpeed}</span>*/}
				{/*</div>*/}
				{/*<div>*/}
				{/*	<button onClick={() => {*/}
				{/*		if (consoleRef.current) {*/}
				{/*			consoleRef.current.writeConsole ({text: "ABC", type: ConsoleOutputType.Log});*/}
				{/*		}*/}
				{/*	}}>コンソール追加*/}
				{/*	</button>*/}
				{/*	<button onClick={() => {*/}
				{/*		mission.clearConsole ();*/}
				{/*	}}>コンソール削除*/}
				{/*	</button>*/}
				{/*</div>*/}
				{/*	</div>*/}
				{/*	<div id={"threads-panel"}>*/}

				{/*	</div>*/}
				{/*</div>*/}

				{/*<div id={"right-panel"}>*/}

				{/*</div>*/}
			</div>
		</div>
	)
}

class EditorView extends React.Component<{ missionContent: MissionContent, closeDetailModal: () => void, showClearModal: () => void, showFailedModal: (failReason: string) => void }> {
	workspace: Blockly.WorkspaceSvg | null = null;
	initialWorkspace = "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"entry_point\" id=\"5e{JeNdzKRK}Nyg(x2Ul\" x=\"58\" y=\"59\"></block></xml>";
	userProgram: UserProgram | null = null;
	isExecuting = false;

	componentDidMount () {
		// ブロック定義とブロックリストを読み込み
		BlockSettings.initBlocks ();
		const xmlParser = new DOMParser ();
		const xmlDom = xmlParser.parseFromString (BlockSettings.blockListToXml (this.props.missionContent.blockList), "text/xml");

		// ワークスペースを生成
		const document: HTMLElement | undefined = xmlDom.getElementById ("toolbox") || undefined; // 要素取得して型合わせ
		Blockly.setLocale (Ja);
		// 編集可能かのオプション
		let options: object;
		let blockCountLimit = Infinity;
		if (this.props.missionContent.blockCountLimit >= 0) {
			blockCountLimit = this.props.missionContent.blockCountLimit;
		}
		if (this.props.missionContent.editable) {
			options = {
				toolbox: document,
				maxBlocks: blockCountLimit,
				move: {
					scrollbars: true,
					drag: true,
					wheel: true
				}
			}
		} else {
			options = {
				toolbox: document,
				maxBlocks: blockCountLimit,
				readOnly: true,
				move: {
					scrollbars: true,
					drag: true,
					wheel: true
				}
			}
		}
		this.workspace = Blockly.inject ("blocklyDiv", options);

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

		// ワークスペースにプログラム読み込み
		if (this.props.missionContent.program === "") {
			// デフォルトプログラム
			if (this.props.missionContent.defaultProgram === "") {
				this.xmlToWorkspace (this.initialWorkspace);
			} else {
				this.xmlToWorkspace (this.props.missionContent.defaultProgram);
			}
		} else {
			// 保存されたプログラム
			this.xmlToWorkspace (this.props.missionContent.program);
		}
	}

	componentWillUnmount () {
		// プログラムを保存
		this.props.missionContent.program = this.getXml ();
	}

	getXml () {
		// ワークスペース上のブロックをXML化
		if (this.workspace) {
			const dom = Blockly.Xml.workspaceToDom (this.workspace);
			return Blockly.Xml.domToText (dom);
		} else {
			return "";
		}
	}

	xmlToWorkspace (xml: string) {
		// XMLからワークスペースのブロック化
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
			this.userProgram = new BlockDefinitions.UserProgram (xml, mission, this.workspace);
		}
	}

	async executeUserProgram (variableCanvas: VariableCanvas.VariableCanvas, mission: Mission, initialProgramSpeed: number) {
		// 作成したブロックをプログラム化し実行
		this.isExecuting = true;
		this.parseBlocks (variableCanvas, mission);
		if (this.userProgram) {
			// グローバル配列Canvasを初期化
			mission.resetGlobalArray ();
			variableCanvas.drawTable (mission.currentTwoDimensionalArrays, mission.currentOneDimensionalArrays, mission.currentVariables);

			// プログラム速度の初期値
			this.userProgram.setProgramSpeed (initialProgramSpeed);

			// タイム計測し実行
			await this.userProgram.executeUserProgram ();
			const time = this.userProgram.getCurrentMilliSecond ();

			// ミッションクリア条件判断
			this.props.closeDetailModal ();
			const missionResult = mission.judge ();
			if (missionResult.cleared) {
				// スコア記録
				mission.missionContent.score.setClear (time, this.workspace ? this.workspace.getAllBlocks (false).length : -1);

				this.props.showClearModal (); // ミッション成功
			} else {
				this.props.showFailedModal (missionResult.failReason); // ミッション失敗
			}
		}
		this.isExecuting = false;
	}

	stopUserProgram () {
		// プログラム実行を停止
		if (this.userProgram) {
			this.userProgram.stopUserProgram ();
			this.isExecuting = false;
		}
	}

	setProgramSpeed (speed: number) {
		if (this.userProgram) {
			this.userProgram.setProgramSpeed (speed);
		}
	}

	onResize () {
		// Blocklyリサイズ処理
		if (this.workspace) {
			Blockly.svgResize (this.workspace);
		}
	}

	render () {
		return <div id="blocklyDiv" style={{width: "100%", height: "100%"}}/>;
	}
}

class ThreadView extends React.Component<{ threadNames: string, threadIndex: number, threadCount: number, blocks: string, onDidMount: (workspace: Blockly.Workspace) => void }, { workspace: WorkspaceSvg }> {
	workspace: WorkspaceSvg | null = null;
	threadColors = ["rgb(234, 57, 25)", "rgb(36, 234, 25)", "rgb(25, 36, 234)", "rgb(237, 185, 24)"];

	componentDidMount () {
		this.workspace = Blockly.inject (`thread${this.props.threadNames}`, {
			readOnly: true,
			move: {
				scrollbars: true,
				drag: true,
				wheel: true
			}
		});
		const xml = `<xml xmlns="https://developers.google.com/blockly/xml">${this.props.blocks}</xml>`;
		const dom = Blockly.Xml.textToDom (xml);
		Blockly.Xml.domToWorkspace (dom, this.workspace);
		this.props.onDidMount (this.workspace);
	}

	componentDidUpdate () {
		this.onResize ();
	}

	render () {
		const divWidth = `${100 / this.props.threadCount}%`;
		return (
			<div style={{width: divWidth}}>
				<div id={`thread${this.props.threadNames}`}
					 style={{width: "100%", height: "calc(100% - 24px)"}}/>
				<div className={"thread-name-container"}>
					<div className={"thread-name-icon"}
						 style={{backgroundColor: this.threadColors[this.props.threadIndex]}}/>
					<div>{this.props.threadNames}</div>
				</div>
			</div>
		);
	}

	onResize () {
		if (this.workspace) {
			Blockly.svgResize (this.workspace);
		}
	}
}

export enum ConsoleOutputType { Log, Error}

class ConsoleView extends React.Component<{}, { outputs: { text: string, type: ConsoleOutputType }[] }> {
	state: { outputs: { text: string, type: ConsoleOutputType }[] };

	constructor (props: {}) {
		super (props);
		this.state = {outputs: []};
	}

	writeConsole (output: { text: string, type: ConsoleOutputType }) {
		// コンソール書き込み
		this.setState (state => ({
			outputs: [...state.outputs, output]
		}));
	}

	clearConsole () {
		// コンソール消去
		this.setState ({...this.state, outputs: []});
	}

	render () {
		const outputs = this.state.outputs.map ((item, i) => {
			switch (item.type) {
				case ConsoleOutputType.Log:
					return <li key={i} className={"console-log"}>{item.text}</li>;
				case ConsoleOutputType.Error:
					return <li key={i} className={"console-error"}>{item.text}</li>;
				default:
					return <span/>;
			}
		});

		return (
			<div id={"console-container"}>
				<ul id={"console"}>{outputs}</ul>
			</div>
		);
	}
}

export default Playground;
