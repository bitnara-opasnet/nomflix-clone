import axios from "axios";

const API_KEY = "06b36bed837802bb5cc0c2959cdeee9e";
const BASE_PATH = "https://api.themoviedb.org/3";


export interface IProgram {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title?: string;
    name?: string;
    overview: string;
};


export interface IGetMoviesResult {
    dates?: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IProgram[];
    total_pages: number;
    total_results: number;
};


export interface IGetTvShowsResult {
    page: number;
    results: IProgram[];
    total_pages: number;
    total_results: number;
};

export interface IGetMovies {
    playing_movie: IGetMoviesResult;
    popular_movie: IGetMoviesResult;
};

export interface IGetTvShows {
    playing_tv: IGetTvShowsResult;
    popular_tv: IGetTvShowsResult;
};

export async function getMovies() {
    const results = {} as IGetMovies;
    const playingMoives = await axios.get(
        `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&region=kr`
    );
    results.playing_movie = playingMoives.data;
    const popularMoives = await axios.get(
        `${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=ko-KR&region=kr`
    );
    results.popular_movie = popularMoives.data;
    return results
};

// export function getTvShows() {
//     return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko-KO&region=KR`).then(
//         (response) => response.json()
//     );
// };

export async function getTvShows() {
    const results = {} as IGetTvShows;
    const playingTvShows = await axios.get(
        `${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=ko-KR&region=kr`
    );
    results.playing_tv = playingTvShows.data;
    const popularTvShows = await axios.get(
        `${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko-KR&region=kr`
    );
    results.popular_tv = popularTvShows.data;
    return results
};