import React from 'react';
import './Home.css';
import SearchBar from '../../components/home/SearchBar';
import SearchResults from '../../components/home/SearchResults';


function HomeScreen() {
  const [searchTerm, onChange] = React.useState('');

  return (
    <div className="App">
      <h1>The Movie App!</h1>
      <SearchBar searchTerm={searchTerm} onChange={onChange} />
      <SearchResults searchTerm={searchTerm} />
    </div>
  );
}

export default HomeScreen;
