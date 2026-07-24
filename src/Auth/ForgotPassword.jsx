import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPassword() {

    const API_URL = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const [statusMessage, setStatusMessage] = useState({
        type: "",
        text: ""
    });

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        setStatusMessage({
            type: "",
            text: ""
        });

        try {

            const response = await axios.post(
                `${API_URL}/auth/forgot-password`,
                {
                    email
                }
            );

            toast.success(response.data);

            setStatusMessage({
                type: "success",
                text: response.data
            });

            setTimeout(() => {

                navigate("/reset-password", {
                    state: {
                        email
                    }
                });

            }, 1500);

        } catch (error) {

            const message =
                error.response?.data ||
                "Unable to send OTP.";

            toast.error(message);

            setStatusMessage({
                type: "error",
                text: message
            });

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex bg-slate-100 justify-center items-center p-5">

            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-slate-800">
                        Forgot Password
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Enter your registered email to receive an OTP.
                    </p>

                </div>

                {statusMessage.text && (

                    <div
                        className={`mb-5 p-3 rounded-xl text-sm font-medium ${
                            statusMessage.type === "success"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                    >
                        {statusMessage.text}
                    </div>

                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>

                        <label className="block text-sm font-semibold mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@gmail.com"
                            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
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

export default ForgotPassword;