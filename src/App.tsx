import React, {useState, useEffect} from 'react';
import Blockly from "blockly";
import * as Ja from "blockly/msg/ja"

import Thread from "./Thread";
import * as Blocks from "./blockDefinition"
import "./App.scss";

function App () {
	const [threads, setThreads] = useState ([
		{index: 0},
		{index: 1},
		{index: 2},
		{index: 3}
	])
	const [threadCount, setThreadCount] = useState (threads.length);

	return (
		<div style={{width: "100vw", height: "100vh"}}>
			<div id={"top-menu"}>
				<div>名前</div>
				<div>第1章 「OOOOOOOO」</div>
				<div>ユーザアイコン</div>
			</div>
			<div id={"main-view"}>
				<div id={"left-panel"}>
					<Editor/>
				</div>

				<div id={"center-panel"}>
					<div id={"variables-panel"}>
						<div>変数</div>
						<button onClick={() => {
							setThreads ([...threads, {index: threadCount}]);
							setThreadCount (threadCount + 1);
						}}>
							スレッドを追加
						</button>
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

const Editor = React.memo (() => {
	Blocks.initBlocks ();
	const xml = Blocks.getInitialXml ();

	const xmlParser = new DOMParser ();
	const xmlDom = xmlParser.parseFromString (xml, "text/xml");

	const document: HTMLElement | undefined = xmlDom.getElementById ("toolbox") || undefined; // 要素取得して型合わせ

	useEffect (() => {
		Blockly.setLocale (Ja);
		Blockly.inject ("blocklyDiv", {
			toolbox: document
		});
	});

	return (
		<div id="blocklyDiv" style={{width: "100%", height: "100%"}}/>
	);
});

export default App;
