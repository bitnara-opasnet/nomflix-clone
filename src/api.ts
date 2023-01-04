const API_KEY = "06b36bed837802bb5cc0c2959cdeee9e";
const BASE_PATH = "https://api.themoviedb.org/3";


interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
};


interface ITvShows {
    id: number;
    backdrop_path: string;
    poster_path: string;
    name: string;
    overview: string;
};

export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
};


export interface IGetTvShowsResult {
    page: number;
    results: ITvShows[];
    total_pages: number;
    total_results: number;
};

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
};

export function getTvShows() {
    return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
};