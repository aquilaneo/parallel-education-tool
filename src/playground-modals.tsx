/*
	Copyright (c) 2022 aquilaneo
	This software is released under the MIT License.
	LICENSE file is in the root directory of this repository.
*/

import React from "react";
import {Link} from "react-router-dom";
import {MissionContent} from "./mission";

import "./playground-modals.scss";

import FlagIcon from "./img/Flag.svg";
import ExplanationIcon from "./img/Explanation.svg";
import CloseIcon from "./img/Close.svg";
import ScoreIcon from "./img/Score.svg";
import NextIcon from "./img/Next.svg";
import BackIcon from "./img/Back.svg";

// ステージ説明モーダル
export const MissionDetailModal: React.FC<{ isVisible: boolean, setIsVisible: (value: boolean) => void, missionContent: MissionContent }> = (props) => {
	return (
		<div className={"modal-background"} style={{display: props.isVisible ? "block" : "none"}}>
			<div className={"modal-panel"} id={"mission-detail"} style={{display: props.isVisible ? "block" : "none"}}>
				<div className={"modal-header"}>
					<div className={"modal-header-chapter-name"}>{props.missionContent.chapterName}</div>
					<div className={"modal-header-title"}>{props.missionContent.missionTitle}</div>
				</div>
				<div className={"modal-content"}>
					<div className={"modal-item"}>
						<div className={"modal-subtitle"}>
							<div><img src={FlagIcon} className={"modal-icon"}/></div>
							<div>クリア条件</div>
						</div>
						<div className={"center"}>{props.missionContent.goal}</div>
					</div>

					<div className={"modal-item"}>
						<div className={"modal-subtitle"}>
							<div><img src={ExplanationIcon} className={"modal-icon"}/></div>
							<div>ステージ説明</div>
						</div>
						<div>{props.missionContent.missionExplanation}</div>
					</div>

					<div className={"modal-item modal-buttons"}>
						<div className={"modal-button"} onClick={() => {
							props.setIsVisible (false);
						}}>
							<div><img src={CloseIcon} className={"modal-icon"}/></div>
							<div className={"modal-button-text"}>閉じる</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// ステージクリアモーダル
export const MissionClearModal: React.FC<{ isVisible: boolean, close: () => void, missionContent: MissionContent, nextMission: { chapterNameURL: string, missionID: string } | null }> = (props) => {
	const chapter = props.nextMission ? props.nextMission.chapterNameURL : "";
	const missionID = props.nextMission ? props.nextMission.missionID : "";
	return (
		<div className={"modal-background"} style={{display: props.isVisible ? "block" : "none"}}>
			<div className={"modal-panel"} id={"mission-clear"} style={{display: props.isVisible ? "block" : "none"}}>
				<div className={"modal-header"}>
					<div className={"modal-header-chapter-name"}>{props.missionContent.chapterName}</div>
					<div className={"modal-header-title"}>{props.missionContent.missionTitle}</div>
				</div>
				<div className={"modal-content"}>
					<div className={"modal-item modal-clear-text"}>MISSION CLEAR!</div>
					<div className={"modal-item"}>
						<div className={"modal-subtitle"}>
							<div><img src={FlagIcon} className={"modal-icon"}/></div>
							<div>クリア条件</div>
						</div>
						<div className={"center"}>{props.missionContent.goal}</div>
					</div>

					<div className={"modal-item"}>
						<div className={"modal-subtitle"}>
							<div><img src={ScoreIcon} className={"modal-icon"}/></div>
							<div>スコア</div>
						</div>
						<div className={"score-row"}>
							<div>実行時間:</div>
							<div>{props.missionContent.score.getTimeSecond ()} 秒</div>
						</div>
						<div className={"score-row"}>
							<div>ブロック数:</div>
							<div>{props.missionContent.score.getBlockCount ()} 個</div>
						</div>
					</div>

					<div className={"modal-item modal-buttons"}>
						<div className={"modal-button"}>
							<div><img src={BackIcon} className={"modal-icon"}/></div>
							<div className={"modal-button-text"} onClick={() => {
								props.close ();
							}}>戻る
							</div>
						</div>
						<Link style={{display: props.nextMission ? "block" : "none"}} className={"modal-button-link"}
							  to={`/missions/${chapter}/${missionID}`}>
							<div className={"modal-button"}>
								<div><img src={NextIcon} className={"modal-icon"}/></div>
								<div className={"modal-button-text"} id={"next-mission-button"}>次のステージへ</div>
							</div>
						</Link>
						<div style={{display: props.nextMission ? "block" : "none"}} className={"modal-button-spacer"}/>
					</div>
				</div>
			</div>
		</div>
	);
};

// ステージ失敗モーダル
export const MissionFailedModal: React.FC<{ isVisible: boolean, close: () => void, missionContent: MissionContent, failReason: string }> = (props) => {
	return (
		<div className={"modal-background"} style={{display: props.isVisible ? "block" : "none"}}>
			<div className={"modal-panel"} id={"mission-failed"} style={{display: props.isVisible ? "block" : "none"}}>
				<div className={"modal-header"}>
					<div className={"modal-header-chapter-name"}>{props.missionContent.chapterName}</div>
					<div className={"modal-header-title"}>{props.missionContent.missionTitle}</div>
				</div>
				<div className={"modal-content"}>
					<div className={"modal-item modal-failed-text"}>MISSION FAILED...</div>
					<div className={"modal-item"}>
						<div className={"modal-subtitle"}>
							<div><img src={FlagIcon} className={"modal-icon"}/></div>
							<div>クリア条件</div>
						</div>
						<div className={"center"}>{props.missionContent.goal}</div>
					</div>

					<div className={"modal-item"}>
						<div className={"modal-subtitle"}>
							<div><img src={ExplanationIcon} className={"modal-icon"}/></div>
							<div>失敗理由</div>
						</div>
						<div className={"center"}>{props.failReason}</div>
					</div>

					<div className={"modal-item modal-buttons"}>
						<div className={"modal-button"}>
							<div><img src={BackIcon} className={"modal-icon"}/></div>
							<div className={"modal-button-text"} onClick={() => {
								props.close ();
							}}>ステージに戻る
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
