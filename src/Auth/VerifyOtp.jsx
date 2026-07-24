import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function VerifyOtp() {

    const API_URL = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {

        e.preventDefault();

        if (!otp.trim()) {
            toast.error("Please enter OTP");
            return;
        }

        setLoading(true);

        try {

            const response = await axios.post(
                `${API_URL}/auth/verify-otp`,
                {
                    email,
                    otp
                }
            );

            toast.success(response.data);

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            const message =
                error.response?.data ||
                "OTP verification failed.";

            toast.error(message);

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex justify-center items-center bg-slate-100 p-5">

            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-slate-800">
                        Verify Email
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Enter the OTP sent to your email.
                    </p>

                </div>

                <form
                    onSubmit={handleVerify}
                    className="space-y-5"
                >

                    <div>

                        <label className="block mb-2 text-sm font-semibold text-slate-600">
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

                        <label className="block mb-2 text-sm font-semibold text-slate-600">
                            OTP
                        </label>

                        <input
                            type="text"
                            maxLength={6}
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
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

export default VerifyOtp;