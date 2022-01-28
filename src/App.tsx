import React from "react";
import {BrowserRouter, Route, Link} from "react-router-dom";
import {missionContents} from "./missionContents";

import Playground from "./playground";

import HomeIcon from "./img/Home.svg";
import ClearIcon from "./img/Clear.svg";

import "./App.scss";
import "./common.scss";

function Top () {
	const chapters = missionContents.missionContents.map ((chapter) => {
		const missionLinks = chapter.contents.map ((missionContent) => {
			return (
				<Link to={`./missions/${missionContent.chapterNameURL}/${missionContent.missionID}`}
					  key={missionContent.missionID} className={"mission-panel"}>
					<div className={"mission-title"}>{missionContent.missionTitle}</div>
					<div className={"mission-text"}>{missionContent.missionSummary}</div>
					<div style={{visibility: missionContent.score.isClear () ? "visible" : "hidden",}}
						 className={"mission-clear-icon-container"}>
						<img src={ClearIcon} className={"mission-clear-icon"}/>
					</div>
				</Link>
			);
		});

		return (
			<div className={"chapter-container"} key={chapter.chapterName}>
				<div className={"chapter-title"}>{chapter.chapterName}</div>
				<div style={{display: "flex", flexWrap: "wrap"}}>
					{missionLinks}
				</div>
			</div>
		)
	});

	return (
		<div>
			<div id={"header"}>
				<div id={"header-left"}>
					<Link to={"/"} id={"home-icon-container"}><img src={HomeIcon} id={"home-icon"}/></Link>
					<div id={"title"}>ステージ一覧</div>
				</div>
			</div>
			{chapters}
		</div>
	)
}

function App () {
	// 基本的なRoutes
	const commonRoutes = [
		{
			url: "/",
			component: <Top/>
		}
	];
	// 既存ステージのRoutes
	const missionRoutes = [];
	for (const chapter of missionContents.missionContents) {
		for (const missionContent of chapter.contents) {
			missionRoutes.push ({
				url: `/missions/${missionContent.chapterNameURL}/${missionContent.missionID}`,
				component: <Playground missionID={missionContent.missionID}/>
			});
		}
	}
	const routes = commonRoutes.concat (missionRoutes);

	return (
		<BrowserRouter>
			{routes.map ((route) => {
				return <Route key={route.url} path={route.url} exact render={() => route.component}/>
			})}
		</BrowserRouter>
	)
}

export default App;
