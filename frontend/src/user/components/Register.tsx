import { useState } from "react";
import { userServices } from "../../services/auth.api";
import axios from "axios";

const Register = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [replyPassword, setReplyPassword] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);
    const [messageType, setMessageType] = useState("text-danger");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(password === replyPassword){
            try{
            const response = await userServices.register({
                email,
                name,
                password
            });
            if(response.data){
                setMessageType("text-success");
                setMessage("Udało się zarejestrować");
                setIsRegistered(true);
            }
            }catch(error:unknown){
                console.log("Błąd rejestracji: ", error);
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 500) {
                        setMessageType("text-danger");
                        setMessage("Użytkownik o podanym mailu istnieje");
                    }else {
                        setMessageType("text-danger");
                        setMessage("Błąd rejestracji");
                    }
                }
                else {
                    setMessageType("text-danger");
                    setMessage("Błąd rejestracji");
                }
            }
        }else{
            setMessageType("text-danger");
            setMessage("Hasła nie są takie same");
        }

    }

    return(
        <div className="w-100">
            <form onSubmit={handleSubmit}>
                {/* LOGIN */}
                <div className="input-group mb-3 ">
                    <span className="input-group-text d-none d-sm-flex" id="basic-addon1">
                        <svg xmlns="http://www.w3.org/2000/svg " width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                        </svg>
                    </span>
                    <input type="text" id="login-register" className="form-control p-1 fs-6 fs-md-5" placeholder="Login" required value={name} onChange={(e) => setName(e.target.value)} disabled={isRegistered} />
                </div>
                {/* EMAIL */}
                <div className="input-group mb-3 ">
                    <span className="input-group-text d-none d-sm-flex" id="basic-addon1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16">
                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
                        </svg>
                    </span>
                    <input type="email" id="email-register" className="form-control p-1 fs-6 fs-md-5" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isRegistered} />
                </div>
                {/* Password */}
                <div className="input-group mb-3 ">
                    <span className="input-group-text d-none d-sm-flex" id="basic-addon1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4m0 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"/>
                        </svg>
                    </span>
                    <input type="password" id="password-register" className="form-control p-1 fs-6 fs-md-5" placeholder="Hasło" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isRegistered}/>
                </div> 
                {/* Reply Password */}
                <div className="input-group mb-3 ">
                    <span className="input-group-text d-none d-sm-flex" id="basic-addon1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4m0 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"/>
                        </svg>
                    </span>
                    <input type="password" id="replyPassword-register" className="form-control p-1 fs-6 fs-md-5" placeholder="Powtórz hasło" required value={replyPassword} onChange={(e) => setReplyPassword(e.target.value)} disabled={isRegistered}/>
                </div> 
                <h5 className={`message-register ${messageType}`} >{message}</h5>
                <button type="submit" className="btn btn-dark w-100 mt-3 fs-6 fs-md-5">Zarejestruj się</button>
            </form>
        </div>
    );
}

export default Register;