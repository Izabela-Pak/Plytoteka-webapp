import CdList from "../components/CdList";
import "./pages.css"
import Header from "./Header";

const CollectionPage = () => {


    return(
        <div className="container-fluid m-0 p-0 ">
            <Header />
            <div className="row container-fluid m-0 p-0 main-list min-vh-100">
                <div className="col">
                    <CdList />
                </div>
            </div>
        </div>
    )
}

export default CollectionPage;