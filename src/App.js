import React, { useState, useEffect } from "react";
import "./App.css";
import illustration from "./images/blogging.svg";
import Signup from "./components/Signup";
import { ToastsContainer, ToastsStore } from "react-toasts";

const App = () => {
	const [alert, setAlert] = useState(null);

	useEffect(() => {
		if (alert) {
			if (alert.type === "success") ToastsStore.success(alert.message, 5000);
			if (alert.type === "error") ToastsStore.error(alert.message, 8000);
		}
	}, [alert]);

	return (
		<div className="app">
			<div className="image-cont">
				<img src={illustration} alt="" />
			</div>
			<Signup setAlert={alert => setAlert(alert)} />
			<ToastsContainer store={ToastsStore} />
		</div>
	);
};

export default App;
