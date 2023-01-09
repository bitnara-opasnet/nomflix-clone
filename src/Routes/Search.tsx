import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getSearchData, IGetSearchData } from "../api";
import Info from "../Components/Info";
import { InfoWrapper, Overlay } from "../Components/Slider";
import { makeImagePath } from "../utils";
import { Loader, Wrapper } from "./Home";


const Container = styled.div`
    width: 100%;
    padding: 70px 3vw;
`;

const Title = styled.h2`
    font-weight: 500;
    font-size: 24px;
    margin-bottom: 20px;
`;

const Row = styled.div`
    display: grid;
    /* grid-template-columns: repeat(auto-fill, minmax(250px, auto)); */
    grid-template-columns: repeat(7, 1fr);
    gap: 50px;

`;

const Box = styled(motion.div)`
    display: flex;
    align-items: center;
    flex-direction: column;
    /* height: 100%; */
    /* width: 250px; */
    cursor: pointer;
    &:hover {
        h4 {
        color: ${(props) => props.theme.white.lighter};
        font-weight: 400;
        }
    }
`;

const BoxImg = styled.img`
    border-radius: 15px;
    width: 100%;
    height: 100%;
    margin-bottom: 10px;

    box-shadow: 3px 3px 5px rgba(255, 255, 255, 0.1);
    background-color: ${(props) => props.theme.black.veryDark};
    display: flex;
    align-items: center;
    justify-content: center;
    span {
        color: ${(props) => props.theme.white.lighter};
    }
`;

const BoxTitle = styled(motion.div)`
    font-size: 18px;
    font-weight: 300;
    color: ${(props) => props.theme.white.darker};
`;


const boxVariants = {
    normal: { scale: 1 },
    hover: { scale: 1.1},
};


function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");
    const [category, setCategory] = useState("");
    const { data, isLoading } = useQuery<IGetSearchData>(
        ["search", keyword],
        () => getSearchData(keyword + "")
    );
    const history = useHistory();
    const bigProgramMatch = useRouteMatch<{ programId: string }>(`/search?keyword=${keyword}&category=${category}/:programId`);
    const onBoxClicked = (programId:number) => { 
        setCategory(category)
        history.push(`/search?keyword=${keyword}&category=${category}/${programId}`);
    };
    const onOverlayClick = () => history.goBack();
    console.log(bigProgramMatch)
    return (
        <Wrapper>
            {isLoading ? (
                <Loader>로딩중...</Loader>
            ) : (
                <>
                    <Container>
                        <Title>
                            {keyword}에 대한 영화 검색 결과
                        </Title>
                        <Row>
                            {data?.search_movies.results.map((movie) => (
                                <Box
                                    key={movie.id}
                                    variants={boxVariants}
                                    whileHover="hover"
                                    initial="normal"
                                    layoutId = {"movie_" + movie.id}>
                                    {movie.poster_path ? (
                                        <BoxImg src={makeImagePath(movie.poster_path, "w500")} />
                                    ) : (
                                        <BoxImg src={makeImagePath(movie.backdrop_path, "w500")} />
                                    )}
                                    <BoxTitle>{movie.title}</BoxTitle>
                                </Box>
                                
                            ))}
                        </Row>
                    </Container>
                    <Container>
                        <Title>
                            {keyword}에 대한 TV 검색 결과
                        </Title>
                        <Row>
                            {data?.search_tvShow.results.map((tv) => (
                                <Box
                                    key={tv.id}
                                    variants={boxVariants}
                                    whileHover="hover"
                                    initial="normal"
                                    layoutId = {"tv_" + tv.id}
                                >
                                    {tv.poster_path ? (
                                        <BoxImg src={makeImagePath(tv.poster_path, "w500")} />
                                    ) : (
                                        <BoxImg src={makeImagePath(tv.backdrop_path, "w500")} />
                                    )}
                                    <BoxTitle>{tv.name}</BoxTitle>
                                </Box>
                            ))}
                        </Row>
                    </Container>
                    <Container>
                        <Title>
                            {keyword}에 대한 사람 검색 결과
                        </Title>
                        <Row>
                            {data?.search_person.results.map((person) => (
                                <Box
                                    key={person.id}
                                    variants={boxVariants}
                                    whileHover="hover"
                                    initial="normal"
                                    layoutId = {"person_" + person.id}
                                >
                                    {person.profile_path ? (
                                        <BoxImg src={makeImagePath(person.profile_path, "w500")} />
                                    ) : (
                                        <BoxImg as="div"><span>이미지 없음</span></BoxImg>
                                    )}
                                <BoxTitle>{person.name}</BoxTitle>
                                </Box>
                            ))}
                        </Row>
                    </Container>
                    <AnimatePresence>
                        {bigProgramMatch ? (
                            <>
                                <Overlay 
                                    onClick={onOverlayClick}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                                <InfoWrapper layoutId={category + bigProgramMatch.params.programId}>
                                    <Info 
                                        programId={+bigProgramMatch.params.programId}
                                        category={category}
                                    />
                                </InfoWrapper>
                            </>
                        ) : null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
};

export default Search;
