import React, {useEffect} from "react";
import Blockly from "blockly";

interface ThreadInfo {
	index: number;
}

interface ThreadProps {
	info: ThreadInfo
	count: number,
}

const Thread = (props: ThreadProps) => {
	useEffect (() => {
		Blockly.inject (`thread${props.info.index}`);
	}, [props.info.index]);

	const divWidth = `${100 / props.count}%`;
	return (
		<div style={{width: divWidth}}>
			<div> スレッド{props.info.index}</div>
			<div id={`thread${props.info.index}`}
				 style={{width: "100%", height: "calc(100% - 24px)"}}/>
		</div>
	)
};

export default Thread
