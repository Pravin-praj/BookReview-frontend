import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthSuccess() {

    const navigate = useNavigate();

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);
        const id=params.get("id");
        const token = params.get("token");
        const role = params.get("role");
        const email = params.get("email");

        if (token) {

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("email", email);
            localStorage.setItem("id", id);

            if (role === "ADMIN") {
                window.location.href = "/admin/dashboard";
            } else {
                window.location.href = "/user/dashboard";
            }

        } else {
            window.location.href = "/login";
        }

    }, []);

    return <h2>Signing in...</h2>;
}

export default OAuthSuccess;