import logo from "../../assets/logo.png"
import { getEmailFromToken } from "../../services/jwt";
import { useEffect, useState } from "react";
import { userServices } from "../../services/auth.api";
import { Link } from "react-router";
import * as bootstrap from 'bootstrap';
import { useAuth } from "../../context/AuthContext";

const Header = () => {

    //Retrieving user data and greeting him
    const [username, setUsername] = useState("");
    const { logout } = useAuth(); 

    useEffect( () => {

    //Creating new tooltip instance of Bootstrap for given DOM element.
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));

    const fetchData = async () => {
        const email = getEmailFromToken();
        console.log(email);
        if(email){
        const formData = new FormData();
        formData.append("email", email);
        const response = await userServices.userDetails(formData);
        console.log(response.data);
        setUsername(response.data.name);
        }else{
            console.log("Nie znaleziono użytkownika")
        }
    }

    fetchData();
    
    }, []);

    //View of user interface
    return(
        <div className="header-collection row g-0 ">
                <div className="col d-flex d-inline align-items-center d-none d-md-flex">
                    <img src={logo} alt="logo"  style={{ width: "60px", height: "60px", maxWidth: "100%" }} />
                    <h6 className="text-logo pt-3 fw-bold text-light text-uppercase">Płytoteka</h6>
                </div>
                <div className="col d-flex justify-content-center align-items-center">
                    <Link to="/create" className=" text-decoration-none fw-semibold link-to-create-cd" data-mdb-ripple-init >Dodaj nowy album</Link>
                </div>
                <div className="col d-flex d-inline justify-content-end align-items-center">
                    <h4 className="pe-2 text-light pt-2 fs-6 fs-md-4">Witaj <i>{username}</i>!</h4>
                    <button onClick={logout} className="btn btn-link p-0 border-0 bg-transparent" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Wyloguj się">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="icon-to-logout bi bi-box-arrow-right pe-2" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                        <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                        </svg>
                    </button>
                </div>
        </div>
    );

}

export default Header;