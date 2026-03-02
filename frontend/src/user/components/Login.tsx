import { useState } from "react";
import { userServices } from "../../services/auth.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
            try{
                const response = await userServices.login({
                    email,
                    password
                });
                if (response.data && response.data.token){
                    localStorage.setItem("token", response.data.token);
                    console.log("Udało się zalogować");
                    login();
                    navigate("/collection"); 
                }else{
                    setMessage("Niepoprawny email lub hasło");
                }
            }catch(error: unknown){
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        setMessage("Niepoprawny email lub hasło");
                    } else {
                        console.log("Błąd z backendu:", error.response?.status);
                    }
                } else {
                    console.log("Nieznany błąd:", error);
                }
            }
    }

    return (
        <div className="w-100">
            <form onSubmit={handleSubmit}>
                {/* EMAIL */}
                <div className="input-group mb-3 ">
                    <span className="input-group-text d-none d-sm-flex" id="basic-addon1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16">
                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
                        </svg>
                    </span>
                    <input type="email" id="email-login" className="form-control p-1 fs-6 fs-md-5" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                {/* Password */}
                <div className="input-group mb-3 ">
                    <span className="input-group-text d-none d-sm-flex" id="basic-addon1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4m0 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"/>
                        </svg>
                    </span>
                    <input type="password" id="password-login" className="form-control p-1 fs-6 fs-md-5" placeholder="Hasło" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div> 
                <h5 className={`text-danger`} >{message}</h5>
                <button type="submit" className="btn btn-dark w-100 mt-3 fs-6 fs-md-5">Zaloguj się</button>
            </form>
        </div>
    )

}

export default Login;