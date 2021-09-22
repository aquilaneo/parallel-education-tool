import React from "react";
import {BrowserRouter, Route, Link} from "react-router-dom";
import {missionContents} from "./missionContents";

import Playground from "./playground";

function Top () {
	const chapters = missionContents.missionContents.map ((chapter) => {
		const missionLinks = chapter.contents.map ((missionContent) => {
			return (
				<li key={missionContent.missionID}>
					<Link to={`./missions/${chapter.chapterName}/${missionContent.missionID}`}>
						{missionContent.missionTitle}
					</Link>
					<span style={{display: missionContent.score.isClear () ? "inline" : "none"}}> [Clear!]</span>
				</li>
			);
		});

		return (
			<div key={chapter.chapterName}>
				<h2>{chapter.chapterName}</h2>
				<ul>{missionLinks}</ul>
			</div>
		)
	});

	return (
		<div>
			<h1>Top</h1>
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
	// 既存ミッションのRoutes
	const missionRoutes = [];
	for (const chapter of missionContents.missionContents) {
		for (const missionContent of chapter.contents) {
			missionRoutes.push ({
				url: `/missions/${chapter.chapterName}/${missionContent.missionID}`,
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
