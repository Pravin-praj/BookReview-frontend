import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function ResetPassword() {

    const API_URL = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [formData, setFormData] = useState({
        otp: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {

            toast.error("Passwords do not match.");

            return;

        }

        setLoading(true);

        try {

            const response = await axios.post(
                `${API_URL}/auth/reset-password`,
                {
                    email,
                    otp: formData.otp,
                    newPassword: formData.newPassword
                }
            );

            toast.success(response.data);

            setTimeout(() => {

                navigate("/login");

            }, 1500);

        } catch (error) {

            const message =
                error.response?.data ||
                "Unable to reset password.";

            toast.error(message);

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-slate-100 flex justify-center items-center p-5">

            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-slate-800">
                        Reset Password
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Verify OTP and create your new password.
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>

                        <label className="block text-sm font-semibold mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            readOnly
                            className="w-full border rounded-xl px-4 py-3 bg-slate-100 cursor-not-allowed"
                        />

                    </div>

                    <div>

                        <label className="block text-sm font-semibold mb-2">
                            OTP
                        </label>

                        <input
                            type="text"
                            name="otp"
                            maxLength={6}
                            placeholder="Enter OTP"
                            value={formData.otp}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                    </div>

                    <div>

                        <label className="block text-sm font-semibold mb-2">
                            New Password
                        </label>

                        <input
                            type={showPassword ? "text" : "password"}
                            name="newPassword"
                            placeholder="Enter new password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                    </div>

                    <div>

                        <label className="block text-sm font-semibold mb-2">
                            Confirm Password
                        </label>

                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                    </div>

                    <div className="text-right">

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-sm text-indigo-600 hover:underline"
                        >
                            {showPassword ? "Hide Passwords" : "Show Passwords"}
                        </button>

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
                    >
                        {loading ? "Updating Password..." : "Reset Password"}
                    </button>

                </form>

                <div className="text-center mt-6">

                    <button
                        onClick={() => navigate("/login")}
                        className="text-indigo-600 hover:underline font-medium"
                    >
                        Back to Login
                    </button>

                </div>

            </div>

        </div>

    );

}

export default ResetPassword;