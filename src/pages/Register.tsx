import { useState } from "react";
import { auth } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const register = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            localStorage.setItem("token", token);
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <div className="flex flex-col gap-4 max-w-sm mx-auto mt-20 p-6 border rounded shadow">
            <h1 className="text-2xl font-bold text-center">Register</h1>
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
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                onClick={register}
            >
                Register
            </button>

            <p className="text-center">
                Already have an account?{" "}
                <Link to="/" className="text-blue-500 hover:underline">
                    Login
                </Link>
            </p>
        </div>
    );
};

export default Register;
