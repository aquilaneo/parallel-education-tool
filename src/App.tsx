import React from "react";
import {BrowserRouter, Route, Link} from "react-router-dom";
import {missionContents, missionScores} from "./missionContents";

import Playground from "./playground";

function Top () {
	const missionLinks = missionContents.map ((missionContent, index) => {
		return (
			<li key={missionContent.missionID}>
				<Link to={`./missions/${missionContent.missionID}`}>
					{missionContent.missionTitle}
				</Link>
				<span style={{display: missionScores[index].isClear() ? "inline" : "none"}}> [Clear!]</span>
			</li>
		);
	});

	return (
		<div>
			<h1>Top</h1>
			<ul>{missionLinks}</ul>
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
	const missionRoutes = missionContents.map ((missionContent) => {
		return {
			url: `/missions/${missionContent.missionID}`,
			component: <Playground missionID={missionContent.missionID}/>
		};
	});
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
