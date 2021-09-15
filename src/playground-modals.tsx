import React from "react";
import {Link} from "react-router-dom";
import {MissionContent} from "./mission";

import "./playground-modals.scss";

// ミッション説明モーダル
export const MissionDetailModal: React.FC<{ isVisible: boolean, setIsVisible: (value: boolean) => void, missionContent: MissionContent }> = (props) => {
	return (
		<div className={"modal-panel"} id={"mission-detail"} style={{display: props.isVisible ? "block" : "none"}}>
			<h1 className={"center"}>{props.missionContent.missionTitle}</h1>
			<h2 className={"center"}>クリア条件</h2>
			<div className={"center"}>{props.missionContent.goal}</div>

			<h2 className={"center"}>ミッション説明</h2>
			<div>{props.missionContent.missionExplanation}</div>

			<div className={"center"}>
				<button style={{margin: "0.5rem 0 1rem 0"}} onClick={() => {
					props.setIsVisible (false);
				}}>閉じる
				</button>
			</div>
		</div>
	);
};

// ミッションクリアモーダル
export const MissionClearModal: React.FC<{ isVisible: boolean, missionContent: MissionContent }> = (props) => {
	return (
		<div className={"modal-panel"} id={"mission-clear"} style={{display: props.isVisible ? "block" : "none"}}>
			<h1 className={"center"}>Mission Clear!</h1>
			<h2 className={"center"}>{props.missionContent.missionTitle}</h2>
			<h2 className={"center"}>クリア条件</h2>
			<div className={"center"}>{props.missionContent.goal}</div>

			<div style={{width: "10rem", margin: "0 auto 1rem auto"}}>
				<h2 className={"center"}>スコア</h2>
				<div className={"score-row"}>
					<div>実行時間:</div>
					<div>00 秒</div>
				</div>
				<div className={"score-row"}>
					<div>ブロック数:</div>
					<div>00 個</div>
				</div>
			</div>

			<div style={{margin: "0 0 1rem 0"}} className={"center"}>
				<div><Link to={"/missions/mission1-5"}>次のミッションへ</Link></div>
				<div><Link to={"/"}>トップページへ</Link></div>
			</div>
		</div>
	);
};

// ミッション失敗モーダル
export const MissionFailedModal: React.FC<{ isVisible: boolean, setIsVisible: (value: boolean) => void, missionContent: MissionContent }> = (props) => {
	return (
		<div className={"modal-panel"} id={"mission-failed"} style={{display: props.isVisible ? "block" : "none"}}>
			<h1 className={"center"}>Mission Failed...</h1>
			<h2 className={"center"}>{props.missionContent.missionTitle}</h2>
			<h2 className={"center"}>クリア条件</h2>
			<div className={"center"}>{props.missionContent.goal}</div>

			<h2 className={"center"}>ヒント</h2>
			<div>サンプルテキスト</div>

			<div style={{margin: "0 0 1rem 0"}} className={"center"}>
				<div>
					<button onClick={() => {
						props.setIsVisible (false);
					}}>続ける
					</button>
				</div>
				<div><Link to={"/"}>トップページへ</Link></div>
			</div>
		</div>
	);
};
