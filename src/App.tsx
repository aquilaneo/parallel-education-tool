import React, {useState, useRef} from 'react';
import Blockly from "blockly";
import * as Ja from "blockly/msg/ja"

import Thread from "./Thread";
import * as BlockSettings from "./blockSettings"
import * as BlockDefinitions from "./blockDefinitions"
import "./App.scss";

function App () {
	const [threads, setThreads] = useState ([
		{index: 0},
		{index: 1},
		{index: 2},
		{index: 3}
	]);
	const [threadCount, setThreadCount] = useState (threads.length);
	const editorRef = useRef<Editor> (null);

	const [stopwatch, setStopwatch] = useState (new BlockDefinitions.Stopwatch ());

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
						<div>
							<button onClick={() => {
								setThreads ([...threads, {index: threadCount}]);
								setThreadCount (threadCount + 1);
							}}>
								スレッドを追加
							</button>
							<button onClick={() => {
								if (editorRef.current) {
									editorRef.current.parseBlocks ();
								}
							}}>
								ブロックをパース
							</button>
							<button onClick={() => {
								if (editorRef.current) {
									editorRef.current.executeEntryFunction ();
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
	workspace: Blockly.Workspace | null = null;
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

	parseBlocks () {
		// ワークスペース上のブロックをプログラム化
		if (this.workspace) {
			const xml = Blockly.Xml.workspaceToDom (this.workspace);
			return new BlockDefinitions.UserProgram (xml);
		} else {
			return null;
		}
	}

	async executeEntryFunction () {
		const userProgram = this.parseBlocks ();
		if (userProgram) {
			const thread = new BlockDefinitions.Thread ("スレッド", "スレッド", userProgram);
			thread.execute ();
			await userProgram.executeEntryFunction ();
		}
	}

	render () {
		return <div id="blocklyDiv" style={{width: "100%", height: "100%"}}/>;
	}
}

export default App;
