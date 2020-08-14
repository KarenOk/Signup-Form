import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import logo from "../images/logo.jpg";
import loader from "../images/loader.gif";

const Signup = ({ setAlert }) => {
	const [loading, setLoading] = useState(false);

	const checkUser = value => {
		return new Promise(async (resolve, reject) => {
			fetch("https://api.raisely.com/v3/check-user", {
				method: "POST",
				body: JSON.stringify({
					campaignUuid: "46aa3270-d2ee-11ea-a9f0-e9a68ccff42a",
					data: {
						email: value
					}
				}),
				headers: { "Content-Type": "application/json" }
			})
				.then(res => res.json())
				.then(res => {
					if (res.data.status === "OK") resolve(true);
					else resolve(false);
				})
				.catch(() => resolve(false));
		});
	};

	const formik = useFormik({
		initialValues: {
			first_name: "",
			last_name: "",
			email: "",
			password: "",
			confirm_password: ""
		},
		validationSchema: Yup.object({
			first_name: Yup.string().required("This field is required."),
			last_name: Yup.string().required("This field is required."),
			email: Yup.string()
				.required("This field is required.")
				.email("Please provide a valid email address.")
				.test("existingEmail", "This email has already been used", function (value) {
					if (value) return checkUser(value);
					else return true;
				}),
			password: Yup.string().required("This field is required."),
			confirm_password: Yup.string()
				.required("This field is required.")
				.oneOf([Yup.ref("password"), null], "Password and Confirm Password must match.")
		}),
		onSubmit: values => {
			setLoading(true);
			fetch("https://api.raisely.com/v3/signup", {
				method: "POST",
				body: JSON.stringify({
					campaignUuid: "46aa3270-d2ee-11ea-a9f0-e9a68ccff42a",
					data: {
						firstName: values.first_name,
						lastName: values.last_name,
						email: values.email,
						password: values.password
					}
				}),
				headers: { "Content-Type": "application/json" }
			})
				.then(res => res.json())
				.then(res => {
					if (res.errors)
						setAlert({ type: "error", message: "Signup unsuccessful. " + res.errors[0].message });
					else {
						setAlert({ type: "success", message: "Signup successful. " + res.message });
						formik.resetForm();
					}
					setLoading(false);
				})
				.catch(err => {
					setAlert({ type: "error", message: "An error occurred. Signup unsuccessful." });
					setLoading(false);
				});
		}
	});

	return (
		<div className="signup">
			<img src={logo} alt="Raisely" className="logo" />
			<h1> Create an Account </h1>
			<form onSubmit={formik.handleSubmit} noValidate>
				<div className="form-group">
					<label className={formik.touched.first_name && formik.errors.first_name ? "validated error" : ""}>
						First Name
						<input type="text" name="first_name" {...formik.getFieldProps("first_name")} />
					</label>
					{formik.touched.first_name && formik.errors.first_name && (
						<span className="error" role="alert">
							{formik.errors.first_name}
						</span>
					)}
				</div>
				<div className="form-group">
					<label className={formik.touched.last_name && formik.errors.last_name ? "validated error" : ""}>
						Last Name
						<input type="text" name="last_name" {...formik.getFieldProps("last_name")} />
					</label>
					{formik.touched.last_name && formik.errors.last_name && (
						<span className="error" role="alert">
							{formik.errors.last_name}
						</span>
					)}
				</div>
				<div className="form-group">
					<label className={formik.touched.email && formik.errors.email ? "validated error" : ""}>
						Email Address
						<input type="email" name="email" {...formik.getFieldProps("email")} />
					</label>
					{formik.touched.email && formik.errors.email && (
						<span className="error" role="alert">
							{formik.errors.email}
						</span>
					)}
				</div>
				<div className="form-group">
					<label className={formik.touched.password && formik.errors.password ? "validated error" : ""}>
						Password
						<input type="password" name="password" {...formik.getFieldProps("password")} />
					</label>
					{formik.touched.password && formik.errors.password && (
						<span className="error" role="alert">
							{formik.errors.password}
						</span>
					)}
				</div>
				<div className="form-group">
					<label
						className={
							formik.touched.confirm_password && formik.errors.confirm_password ? "validated error" : ""
						}
					>
						Confirm Password
						<input type="password" name="confirm_password" {...formik.getFieldProps("confirm_password")} />
					</label>
					{formik.touched.confirm_password && formik.errors.confirm_password && (
						<span className="error" role="alert">
							{formik.errors.confirm_password}
						</span>
					)}
				</div>
				<button type="submit" disabled={loading}>
					{loading ? <img src={loader} className="loader" alt="Loading" /> : "SIGN UP"}
				</button>
			</form>
		</div>
	);
};

export default Signup;
