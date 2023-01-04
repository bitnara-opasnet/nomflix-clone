import { useLocation } from "react-router-dom";

function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");
    return null;
};


// https://api.themoviedb.org/3/search/multi?api_key=06b36bed837802bb5cc0c2959cdeee9e&query=Avatar&page=1
// https://developers.themoviedb.org/3/search/multi-search
export default Search;
