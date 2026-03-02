import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userServices } from "../../services/auth.api";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const VerifyUser = () => {
    const [email, setEmail] = useState("");
    const [verificationCode, setCode] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            const response = await userServices.verify({
                email,
                verificationCode
            });
            localStorage.setItem("token", response.data.token);
            login();
            navigate("/collection"); 
        }catch(error: unknown){
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    setMessage("Błędny email lub kod");
                }
            }
            console.log("Błąd weryfikacji", error)
        }

    } 

    const Resend = async () => {
        if(email){
            try{
                const formData = new FormData();
                formData.append("email", email)
                await userServices.resend(formData);
                setMessage("Wysłano nowy kod");
            }catch(error: unknown){
                console.log("Bląd ponownego wysłania kodu", error);
                setMessage("Użytkownik został już zweryfikowany")
            }
        }else{
            setMessage("Email nie może być pusty");
        }
    }


    return(
        <form onSubmit={handleSubmit}>
            {/* EMAIL */}
                <div className="input-group mb-3 ">
                    <input type="email" id="email-verify" className="form-control p-1 fs-6 fs-md-5" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
            {/* Kod */}
                <div className="input-group mb-3 ">
                    <input type="text" pattern="[0-9]*" maxLength={6} inputMode="numeric" id="code-verify" min="0" className="form-control p-1 fs-6 fs-md-5"  placeholder="Kod weryfikacyjny" required value={verificationCode} onChange={(e) => { if (/^\d*$/.test(e.target.value)) {setCode(e.target.value)}} } />
                </div>
                <h5 className={`text-danger`} >{message}</h5>
            <button type="submit" className="btn btn-dark w-100 mt-3 fs-6 fs-md-5">Zweryfikuj</button>
            <button onClick={Resend} className="btn btn-dark w-100 mt-3 fs-6 fs-md-5">Wyślij ponownie kod</button>
        </form>
    )
}

export default VerifyUser;