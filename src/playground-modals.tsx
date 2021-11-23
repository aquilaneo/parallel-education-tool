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
export const MissionClearModal: React.FC<{ isVisible: boolean, close: () => void, missionContent: MissionContent, nextMission: { chapter: string, missionID: string } | null }> = (props) => {
	const chapter = props.nextMission ? props.nextMission.chapter : "";
	const missionID = props.nextMission ? props.nextMission.missionID : "";
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
					<div>{props.missionContent.score.getTimeSecond ()} 秒</div>
				</div>
				<div className={"score-row"}>
					<div>ブロック数:</div>
					<div>{props.missionContent.score.getBlockCount ()} 個</div>
				</div>
			</div>

			<div style={{margin: "0 0 1rem 0"}} className={"center"}>
				<div style={{display: props.nextMission ? "block" : "none"}}><Link to={`/missions/${chapter}/${missionID}`}>
					次のミッションへ
				</Link></div>
				<button onClick={() => {
					props.close ();
				}}>ミッションに戻る
				</button>
				<div><Link to={"/"}>トップページへ</Link></div>
			</div>
		</div>
	);
};

// ミッション失敗モーダル
export const MissionFailedModal: React.FC<{ isVisible: boolean, close: () => void, missionContent: MissionContent, failReason: string }> = (props) => {
	return (
		<div className={"modal-panel"} id={"mission-failed"} style={{display: props.isVisible ? "block" : "none"}}>
			<h1 className={"center"}>Mission Failed...</h1>
			<h2 className={"center"}>{props.missionContent.missionTitle}</h2>
			<h2 className={"center"}>クリア条件</h2>
			<div className={"center"}>{props.missionContent.goal}</div>

			<h2 className={"center"}>失敗理由</h2>
			<div className={"center"}>{props.failReason}</div>

			<h2 className={"center"}>ヒント</h2>
			<div>サンプルテキスト</div>

			<div style={{margin: "0 0 1rem 0"}} className={"center"}>
				<div>
					<button onClick={() => {
						props.close ();
					}}>ミッションに戻る
					</button>
				</div>
				<div><Link to={"/"}>トップページへ</Link></div>
			</div>
		</div>
	);
};
