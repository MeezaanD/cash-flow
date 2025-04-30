import { useState } from "react";
import { auth, googleProvider } from "../services/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginWithEmail = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            localStorage.setItem("token", token);
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Login failed. Please check your credentials.");
        }
    };

    const loginWithGoogle = async () => {
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const token = await userCredential.user.getIdToken();
            localStorage.setItem("token", token);
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Google login failed.");
        }
    };

    return (
        <div className="flex flex-col gap-4 max-w-sm mx-auto mt-20 p-6 border rounded shadow">
            <h1 className="text-2xl font-bold text-center">Login</h1>
            <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="border p-2 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                onClick={loginWithEmail}
            >
                Login
            </button>
            <button
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                onClick={loginWithGoogle}
            >
                Login with Google
            </button>

            <p className="text-center">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-500 hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
};

export default Login;
