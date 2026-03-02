import { useEffect, useState, useMemo } from "react";
import { cdServices } from "../../services/collection.api";
import type { Cd, PreparedCd } from "../collection.types";
import { getEmailFromToken } from "../../services/jwt";
import { Link } from "react-router";
import { sortBy } from "../collection.types";
import { displayType } from "../collection.types";

const CdList = () => {
    const [searchType, setSearchType] = useState<string>("tytul");
    const [searchingItem, setSearchingItem] = useState<string>("");
    const userEmail = getEmailFromToken();
    const [allCds, setAllCds] = useState<Cd[]>([]);
    const [list, setList] = useState<Cd[]>([]);
    const [listCurrentType, setCurrentList] = useState<Cd[]>([]);
    {/*const [editingCd, setEditingCd] = useState<Cd | null>(null); */}

    const preparedList = useMemo<PreparedCd[]>(() =>
        allCds.map(cd => {
            const author = cd.author.toLowerCase();
            const title = cd.title.toLowerCase();

            return {
                original: cd,

                author,
                authorWords: author.split(" "),

                title,
                titleWords: title.split(" ")
            };
        }),
        [allCds]
    );

    async function LoadCD(email: string) {
    const response = await cdServices.getAll(email);
    setAllCds(response.data);
    setList(response.data);
    setCurrentList(response.data);
    }

    useEffect(() => {
        const load = async () => {
            if (!userEmail) return;
            LoadCD(userEmail);
        };
        load();
    }, [userEmail]);

    // Deleting album
    const deleteCd = async (albumNumber:number) => {
      await cdServices.delete(albumNumber);
      if(userEmail){
        LoadCD(userEmail);
      }
    };

    //Sorting
    const SortCd = (sortType:string) => {
        const sortedList = [...listCurrentType];
        const collator = new Intl.Collator("pl", { sensitivity: "base" });
        const len = 4;

        switch(sortType){
        case "AuthorASC":
            // Sorting by name(alphabetically)
              
            sortedList.sort( (a,b) =>
                collator.compare(
                    a.author.slice(0, len),
                    b.author.slice(0, len)
                )
            ); 
            setList(sortedList);
            break;
        case "AuthorDESC":
            sortedList.sort( (a,b) =>
                collator.compare(
                    b.author.slice(0, len),
                    a.author.slice(0, len)
                )
            );
            setList(sortedList);
            break;
        case "TitleASC":
            sortedList.sort( (a,b) =>
                collator.compare(
                    a.title.slice(0, len),
                    b.title.slice(0, len)
                )
            );
            setList(sortedList);
            break;
        case "TitleDESC":
            sortedList.sort( (a,b) =>
                collator.compare(
                    b.title.slice(0, len),
                    a.title.slice(0, len)
                )
            );
            setList(sortedList);
            break;
        case "YearASC":
            sortedList.sort( (a,b) =>
                collator.compare(
                    a.year.slice(0, len),
                    b.year.slice(0, len)
                )
            );
            setList(sortedList);
            break;
        case "YearDESC":
            sortedList.sort( (a,b) =>
                collator.compare(
                    b.year.slice(0, len),
                    a.year.slice(0, len)
                )
            ); 
            setList(sortedList);
            break;
        default:
            setList(sortedList);
            break;
        }

    }

    //Displaying secified types of albums
    const Display = (displayType:string) => {
        const sortedList = [...allCds];
        switch(displayType){
            case "Cd":
                const listCd = sortedList.filter(cd => cd.vinyl_or_cd === "cd");
                setCurrentList(listCd);
                setList(listCd)
                break;
            case "Vinyl":
                const listVinyl = sortedList.filter(cd => cd.vinyl_or_cd === "vinyl");
                setCurrentList(listVinyl);
                setList(listVinyl)
                break;
            default:
                setCurrentList(sortedList);
                setList(sortedList)
                break;
        }
    } 
    //Searching
    const searchByField = (field: string, fieldWords: string[], query: string) =>
    field.startsWith(query) || fieldWords.some(w => w.startsWith(query));

    const SearchCD = () => {
        const query = searchingItem.toLowerCase();

        switch (searchType) {
            case "tytul":
                setList(
                    preparedList
                        .filter(item =>
                            searchByField(item.title, item.titleWords, query)
                        )
                        .map(item => item.original)
                );
                break;

            case "autor":
                setList(
                    preparedList
                        .filter(item =>
                            searchByField(item.author, item.authorWords, query)
                        )
                        .map(item => item.original)
                );
                break;

            case "gatunek":
                setList(
                    allCds.filter(cd =>
                        cd.genre_required.toLowerCase().includes(query) ||
                        cd.genre_optional?.toLowerCase().includes(query)
                    )
                );
                break;

            case "year":
                setList(allCds.filter(cd => cd.year.includes(query)));
                break;

            default:
                setList(allCds);
        }
    };

       return (
            <div className="row g-3 mt-1">
                <div className="d-flex flex-column flex-md-row gap-2 align-items-stretch justify-content-center align-items-center">
                    <div className="col-12 col-md-3">
                    {/*Choosing what to display*/}
                    <select className="form-select uniform-h fs-6 fs-md-5" onChange={(e) => Display(e.target.value)}>
                        <option disabled selected>Jaki rodzaj płyt chcesz wyświetlić?</option>
                        {displayType.map((cdType) => (
                            <option key={cdType.label} value={cdType.label}>
                            {cdType.value}
                            </option>
                        ))}
                    </select>
                    </div>
                    {/* Sorting discs */}
                    <div className="col-12 col-md-3">
                    <select className="form-select uniform-h fs-6 fs-md-5" onChange={(e) => SortCd(e.target.value)}>
                        <option disabled selected>Sortuj albumy według</option>
                        {sortBy.map((sort) => (
                            <option key={sort.label} value={sort.label}>
                            {sort.value}
                            </option>
                        ))}
                    </select>
                    </div>
                    {/*Searching*/}
                    <div className="col-12 col-md-6">
                        <div className="input-group">
                            <div className="form-floating h-100 " >
                                <input type="text" placeholder=""  id="albumTitle" className="form-control col-6 fs-6 uniform-h" value={searchingItem} onChange={(e) => setSearchingItem(e.target.value)} />
                                <label htmlFor="form1">Szukaj po</label>
                            </div>
                            <select className="form-select uniform-h fs-6 col-4" onChange={(e) => setSearchType(e.target.value)}>
                                <option selected value="tytul">Tytule</option>
                                <option value="autor">Autorze</option>
                                <option value="gatunek">Gatunku</option>
                                <option value="year">Roku</option>
                            </select>
                            <button type="button" className="btn btn-dark uniform-h fs-6 col-2"  data-mdb-ripple-init onClick={SearchCD}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
            {/* Start of editing single CD */}
            {list.length === 0 ? (
                <b><p className="text-light text-center">Nie posiadasz jeszcze żadnych płyt</p></b>
            ) : (
                
                list.map(cd => (
                <div key={cd.id_album} className=" col-12 col-sm-6 col-md-4 col-lg-3 my-2">
                    <div className="card h-100 card-background-color text-white">
                    <div className="row g-0">
                        
                        {cd.image_link && (
                            <div className="card-img-top">
                            <img
                                src={cd.image_link}
                                className="img-fluid rounded-start"
                                alt={cd.title}
                                style={{ height: "220px", objectFit: "cover", width: "100%" }}
                            />
                            </div>
                        )}

                        <div className="card-body">
                            <div className="d-flex justify-content-end">
                                <small className="text-white-50"> {cd.vinyl_or_cd === "vinyl" ? "Płyta winylowa" : cd.vinyl_or_cd} </small>
                            </div>
                            <h6 className="card-title">{cd.title}</h6> 
                            <p className="card-text">{cd.author}</p>
                            <p className="card-text">
                            <small className="text-white-50">{cd.year} |  Gatunek: {cd.genre_required}{cd.genre_optional ? `, ${cd.genre_optional}` : ''}</small>
                            </p>
                            <div className="d-flex d-inline">
                                <Link
                                    to="/modify"
                                    state={{ fromCollection: true, editingCD: cd.id_album }}
                                    className="card-link link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                >Edytuj</Link>
                                <a href="#" className="card-link link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"    onClick={async (e) => {
                                    e.preventDefault(); // blokuje przeładowanie strony
                                    await deleteCd(cd.id_album);
                                }}>Usuń</a>
                            </div>
                        </div>


                    </div>
                    </div>
                </div>
                )) 
            )
            
            }
            {/* End of editing single CD */}
            </div>
    );

}

export default CdList;