import { useQuery } from "react-query";
import styled from "styled-components";
import { getTvShows, IGetTvShows, IProgram } from "../api";
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



function Tv() {
    // tvshow API 호출
    const {data, isLoading} = useQuery<IGetTvShows>(
        ["tvShows"], 
        getTvShows
    );

    return (
        <Wrapper>
            {isLoading ? (<Loader>Loading..</Loader>) : (
                <>
                    {/* 배너 */}
                    <Banner program={data?.popular_tv.results[0] as IProgram} />

                    {/* 슬라이더 */}
                    <Slider 
                        category="tv"
                        title="인기 시리즈"
                        data={data?.popular_tv.results as IProgram[]}
                        rowIndex={0}
                        current = "popular"
                    />

                </>
            )}
        </Wrapper>
    );
}

export default Tv;