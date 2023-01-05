import styled from "styled-components";
import { useQuery } from "react-query";
import { getMovies, IGetMovies, IProgram } from "../api";
import Banner from "../Components/Banner";
import { Slider } from "../Components/Slider";


const Wrapper = styled.div`
    background-color: black;
    padding-bottom: 200px;
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

function Home() {
    // movie API 호출
    const {data, isLoading} = useQuery<IGetMovies>(
        ["movies"], 
        getMovies
    );
    return (
        <Wrapper>
            {isLoading ? (<Loader>Loading..</Loader> 
            ): (
                <>
                    {/* 배너 */}
                    <Banner program={data?.playing_movie.results[0] as IProgram} />
                    {/* 슬라이더 */}
                    <Slider 
                        category="movie"
                        title="현재 상영중인 영화"
                        data={data?.playing_movie.results as IProgram[]}
                        rowIndex={0}
                    />
                    <Slider 
                        category="movie"
                        title="현재 인기있는 영화"
                        data={data?.popular_movie.results as IProgram[]}
                        rowIndex={1}

                    />
                </>
            )}
        </Wrapper>
    );
}

export default Home;
