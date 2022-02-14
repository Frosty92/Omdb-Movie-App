import { IMovie } from "../SearchResults";

const BASE_URL = "https://www.omdbapi.com/";
const API_KEY = "cdee4309";
export async function fetchMovies(searchTerm:string) : Promise<Array<IMovie>> {

    if (typeof searchTerm != "string") throw new Error("Unexpected input provied");
    /**
     * If length is < 3, this response is returned anyway, so no need to make the request
     */
    if (searchTerm.length < 3) throw new Error("Too many results.") 

    
    const url = `${BASE_URL}?s=${searchTerm}&apikey=${API_KEY}`;
    const response = await fetch(url);

    /**
     * @todo: Implement a type guard function to validate resBody
     */
    const resBody : IResponseBody = await response.json(); 
    if (resBody.Response === "True") return resBody.Search;
    else {
        const err = resBody.Error ?? "Unexpected Error. Please try again later";
        throw new Error(err);
    }
    
}


interface IResponseBody {
    Response: "True" | "False";
    Search: Array<IMovie>;
    totalResults:number;
    Error?:string;
}
