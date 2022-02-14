import React, {useState, useEffect} from 'react';
import './Home.css';
import useAsync, { Status } from '../../hooks/use_async';
import {fetchMovies} from './utils/search_results.http';
import Movie from './Movie';
import { useDebouncedCallback } from 'use-debounce';
interface Props {
  searchTerm:string;
}


export interface IMovie {
    Title:string;
    Poster:string;
    Year:string;
    imdbID:string;
}


export default function SearchResults({searchTerm} :Props) {

    const [movies, setMovies] = useState<null | Array<IMovie>>(null);
    const {run, error, status, resetAsyncState} = useAsync();

    const onFetchSuccess = (movies:Array<IMovie>) => setMovies(movies);


    /**
     * Implement a debounced callback so we don't send post request
     * everytime the user enters a key to avoid extraneous http requests
     */
    const debounceFetchMovies = useDebouncedCallback(
      () => {
        run(fetchMovies(searchTerm), onFetchSuccess);
      },
      500,
      { maxWait: 2000 }
    );

    const debounceResetState = useDebouncedCallback(
      () => {
        resetAsyncState();
      },
      500,
    );
     
    useEffect(() => {
 
      if (!searchTerm) {
        debounceResetState();
        return;
      }
      debounceFetchMovies();
    }, [searchTerm, debounceFetchMovies, debounceResetState]);



    const renderMovies = () => {
        if (!Array.isArray(movies) || movies.length === 0) return null;
        return movies.map((movie) => {
            return <Movie key={movie.imdbID} movie={movie} /> 
        })
    }

    return (
        <div>
          {status === Status.Resolved && 
           <div className="uk-flex uk-flex-around uk-flex-wrap">
            {renderMovies()}
            </div> 
          }
          {status === Status.Rejected && <div className="err-container"><p>{error}</p></div>}
          {status === Status.Pending && <h4>Loading...</h4>}
          {status === Status.Idle && null}
        </div>
    )

}