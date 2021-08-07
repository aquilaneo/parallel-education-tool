import React from "react";
import Blockly, {WorkspaceSvg} from "blockly";

class ThreadView extends React.Component<{ threadIndex: number, threadCount: number, blocks: string }, { workspace: WorkspaceSvg }> {
	workspace: WorkspaceSvg | null = null;

	componentDidMount () {
		this.workspace = Blockly.inject (`thread${this.props.threadIndex}`);

		const blocksDom = Blockly.Xml.textToDom (this.props.blocks);
		Blockly.Xml.domToWorkspace (blocksDom, this.workspace);
	}

	render () {
		const divWidth = `${100 / this.props.threadCount}%`;
		return (
			<div style={{width: divWidth}}>
				<div> スレッド{this.props.threadIndex}</div>
				<div id={`thread${this.props.threadIndex}`}
					 style={{width: "100%", height: "calc(100% - 24px)"}}/>
			</div>
		);
	}
}


export default ThreadView
