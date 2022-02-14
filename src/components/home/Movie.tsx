import React from 'react';
import { IMovie } from './SearchResults';


interface Props {
    movie: IMovie;
}

const getImgURL = (maybeURL:string) => {
  return maybeURL === "N/A" ? "https://via.placeholder.com/350x400" : maybeURL;
}

export default function Movie({movie}: Props) {

    return (
        <div className="uk-card uk-card-body">
        <div className="img-wrapper">
            <img src={getImgURL(movie.Poster)} />
        </div>
        <h3 className="uk-card-titl uk-width-medium">{movie.Title} - <span className="year">{movie.Year}</span></h3>
            <button className="uk-button uk-button-default">Test Text</button>
        </div>
    );

}