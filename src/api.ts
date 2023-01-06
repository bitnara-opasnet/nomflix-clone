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
    upcoming_movie: IGetMoviesResult;
    top_rated_movie: IGetMoviesResult;
};

export interface IGetTvShows {
    on_the_air_tv: IGetTvShowsResult;
    popular_tv: IGetTvShowsResult;
    top_rated_tv: IGetTvShowsResult;
};

export interface IProgramDetail {
    name: string;
    title: string;
    tagline: string,
    genres: [{id: number, name: string}],
    homepage: string,
    vote_average: number,
    vote_count: number,
    runtime: number,
    release_date: string,
    episode_run_time: number,
    seasons: [{id: number, name: string, air_date: string, episode_count: number}],
    first_air_date: string,
    backdrop_path: string;
    poster_path: string;
    overview: string;
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
    const upcomingMoives = await axios.get(
        `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko-KR&region=kr`
    );
    results.upcoming_movie = upcomingMoives.data;
    const topRatedMoives = await axios.get(
        `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko-KR&region=kr`
    );
    results.top_rated_movie = topRatedMoives.data;
    return results
};


export async function getTvShows() {
    const results = {} as IGetTvShows;
    const popularTvShows = await axios.get(
        `${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko-KR&region=kr`
    );
    results.popular_tv = popularTvShows.data;
    const onTheAirTvShows = await axios.get(
        `${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=ko-KR&region=kr`
    );
    results.on_the_air_tv = onTheAirTvShows.data;
    const topRatedTvShows = await axios.get(
        `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko-KR&region=kr`
    );
    results.top_rated_tv = topRatedTvShows.data;
    return results
};


export function getMovieDetail(programId: number, category: string) {
    return fetch(`${BASE_PATH}/${category}/${programId}?api_key=${API_KEY}&language=ko-KO&region=KR`).then(
        (response) => response.json()
    );
};