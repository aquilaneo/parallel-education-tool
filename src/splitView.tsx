import React, {DetailedReactHTMLElement, ReactNode} from "react";

export class SplitView extends React.Component<{ children: ReactNode[], id?: string }> {
	state: { panelsWidthPercent: string[] } = {panelsWidthPercent: []};
	draggingIndex = -1;
	oldMousePosition = -1;
	myRef: React.RefObject<HTMLDivElement>;
	splitViewWidth = 0;

	constructor (props: { children: ReactNode[] }) {
		super (props);

		this.myRef = React.createRef ();

		this.startDragging = this.startDragging.bind (this);
		this.continueDragging = this.continueDragging.bind (this);
		this.stopDragging = this.stopDragging.bind (this);
		this.onResize = this.onResize.bind (this);
		window.onresize = this.onResize;
	}

	componentDidMount () {
		this.onResize ();

		// initialWidthのpropsをスタイルのwidthに反映
		const panelsWidthPercent = new Array (this.props.children.length).fill ("0%") as string[];
		for (let i = 0; i < this.props.children.length; i++) {
			const element = this.props.children[i] as DetailedReactHTMLElement<any, HTMLElement>;
			panelsWidthPercent[i] = element.props.initialWidth;
		}
		this.setState ({...this.state, panelsWidthPercent: panelsWidthPercent});
	}

	// パネル幅を変更
	resizePanels (index: number, delta: number) {
		// 左右パネル幅をpx単位に
		let leftWidthPercent = Number (this.state.panelsWidthPercent[index].replace ("%", ""));
		let rightWidthPercent = Number (this.state.panelsWidthPercent[index + 1].replace ("%", ""));
		let leftWidthPx = this.splitViewWidth * (leftWidthPercent / 100);
		let rightWidthPx = this.splitViewWidth * (rightWidthPercent / 100);

		// delta分加減算
		leftWidthPx += delta;
		rightWidthPx -= delta;

		// 左右パネル幅を%単位に戻す
		leftWidthPercent = (leftWidthPx / this.splitViewWidth) * 100;
		rightWidthPercent = (rightWidthPx / this.splitViewWidth) * 100;

		// minWidthとmaxWidthを取得
		const leftElement = this.props.children[index] as DetailedReactHTMLElement<any, HTMLElement>;
		const rightElement = this.props.children[index + 1] as DetailedReactHTMLElement<any, HTMLElement>;
		const leftPanelMinWidth = leftElement.props.minWidth ? Number (leftElement.props.minWidth.replace ("%", "")) : 0;
		const leftPanelMaxWidth = leftElement.props.maxWidth ? Number (leftElement.props.maxWidth.replace ("%", "")) : 100;
		const rightPanelMinWidth = rightElement.props.minWidth ? Number (rightElement.props.minWidth.replace ("%", "")) : 0;
		const rightPanelMaxWidth = rightElement.props.maxWidth ? Number (rightElement.props.maxWidth.replace ("%", "")) : 100;

		// 反映させる
		if (leftWidthPercent >= leftPanelMinWidth && rightWidthPercent >= rightPanelMinWidth &&
			leftWidthPercent <= leftPanelMaxWidth && rightWidthPercent <= rightPanelMaxWidth) {
			const panelsWidthPercent = [...this.state.panelsWidthPercent];
			panelsWidthPercent[index] = `${leftWidthPercent}%`;
			panelsWidthPercent[index + 1] = `${rightWidthPercent}%`;
			this.setState ({...this.state, panelsWidthPercent: panelsWidthPercent});

			// リサイズコールバックを呼ぶ
			if (leftElement.props.onresize) {
				leftElement.props.onresize ();
			}
			if (rightElement.props.onresize) {
				rightElement.props.onresize ();
			}
		}
	}

	// ドラッグ開始
	startDragging (startMousePosition: number, index: number) {
		this.draggingIndex = index;
		this.oldMousePosition = startMousePosition;
	}

	// ドラッグ継続
	continueDragging (e: React.MouseEvent<HTMLDivElement>) {
		if (this.draggingIndex >= 0) {
			const delta = e.pageX - this.oldMousePosition;
			this.resizePanels (this.draggingIndex, delta);
			this.oldMousePosition = e.pageX;
		}
	}

	// ドラッグ終了
	stopDragging () {
		this.draggingIndex = -1;
		this.oldMousePosition = -1;
	}

	// ウィンドウリサイズ処理
	onResize () {
		if (this.myRef.current) {
			this.splitViewWidth = this.myRef.current.clientWidth;
		}
	}

	render () {
		const style = {
			display: "flex",
			height: "100%"
		};

		// SplitSeparatorを挿入
		const elements = [];
		for (let i = 0; i < this.props.children.length - 1; i++) {
			const element = this.props.children[i] as DetailedReactHTMLElement<any, HTMLElement>;
			elements.push (React.cloneElement (element, {
				widthPercent: this.state.panelsWidthPercent[i],
				key: `Panel${i}`,
			}));
			elements.push (<SplitSeparator key={`Separator${i}`} index={i} parent={this}/>);
		}
		const element = this.props.children[this.props.children.length - 1] as DetailedReactHTMLElement<any, HTMLElement>
		elements.push (React.cloneElement (element, {
			widthPercent: this.state.panelsWidthPercent[this.props.children.length - 1],
			key: `Panel${this.props.children.length - 1}`,
		}));

		return (
			<div style={style} ref={this.myRef} id={this.props.id}
				 onMouseMove={this.continueDragging} onMouseUp={this.stopDragging} onMouseLeave={this.stopDragging}>
				{elements}
			</div>
		);
	}
}

export class SplitPanel extends React.Component<{
	initialWidth: string, minWidth?: string, maxWidth?: string, widthPercent?: number, id?: string, onresize?: () => void
}> {
	render () {
		const width = this.props.widthPercent ? this.props.widthPercent : this.props.initialWidth;
		const style = {
			width: `${width}`,
			height: "100%",
		}

		return (
			<div style={style} id={this.props.id}>{this.props.children}</div>
		);
	}
}

export class SplitSeparator extends React.Component<{ index: number, parent: SplitView }> {
	constructor (props: { index: number, parent: SplitView }) {
		super (props);

		this.onMouseDown = this.onMouseDown.bind (this);
	}

	onMouseDown (e: React.MouseEvent<HTMLDivElement>) {
		this.props.parent.startDragging (e.pageX, this.props.index);
	}

	render () {
		const style = {
			width: "2px",
			height: "100%",
			backgroundColor: "lightgray",
			cursor: "col-resize"
		};

		return (
			<div style={style} onMouseDown={this.onMouseDown}></div>
		);
	}
}
