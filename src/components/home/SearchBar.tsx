import React from 'react';

interface Props {
    searchTerm:string;
    onChange: (v:string) => void;
}

export default function SearchBar({searchTerm, onChange} : Props) {


  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value);
  return (
    <div className="uk-form-stacked">
      <label className="uk-form-label" htmlFor="search-movie-input">Please enter the movie title to see results</label>
      <input 
        type="text" 
        id="search-movie-input"
        className="uk-input uk-form-width-large" 
        onChange={_onChange} 
        value={searchTerm} 
        placeholder={"Movie Title"}
        />
    </div>
  )
}