
import VerifyUser from "../components/VerifyUser";
import Login from "../components/Login";
import Register from "../components/Register";

const UserLayout = () => {

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="row w-100 justify-content-center">

                {/* LOGIN */}
                <div className="col-12 col-md-4 d-flex flex-column justify-content-center align-items-center mb-3 ">
                    <div className="bg-warning-subtle rounded-5 border border-danger border-opacity-25 border-2 p-3 w-100"
                        style={{ minHeight: "50vh" }}>
                        <h5 className="fs-5 fs-md-4 text-center">Zaloguj się</h5>
                        <Login />
                    </div>
                </div>

                {/* LUB (tylko na desktopie) */}
                <div className="col-12 col-md-1 d-flex justify-content-center align-items-center mb-3">
                    <h3 className="fs-md-1 ">Lub</h3>
                </div>

                {/* REGISTER */}
                <div className="col-12 col-md-4 d-flex flex-column justify-content-center align-items-center mb-3">
                    <div className="bg-warning-subtle rounded-5 border border-danger border-opacity-25 border-2 p-3 w-100"
                        style={{ minHeight: "50vh" }}>
                        <h5 className="fs-5 fs-md-4 text-center">Zarejestruj się już dziś</h5>
                        <Register />
                    </div>
                </div>

                {/* VERIFY */}
                <div className="col-12 col-md-3 d-flex flex-column justify-content-center align-items-center mb-3">
                    <div className="bg-warning-subtle rounded-5 border border-danger border-opacity-25 border-2 p-3 w-100"
                        style={{ minHeight: "25vh" }}>
                        <h5 className="fs-5 fs-md-4 text-center">Potwierdź konto tutaj</h5>
                        <VerifyUser />
                    </div>
                </div>

            </div>
        </div>
    );

}

export default UserLayout;