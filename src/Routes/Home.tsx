import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";


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

const Banner = styled.div<{bgphoto:string}>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)), url(${(props) => props.bgphoto});
    background-size: cover;
`;

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
`;

const OverView = styled.p`
    font-size: 30px;
    width: 50%;
`;

const Slider = styled.div`
    position: relative;
    top: -100px;
`;

const Row = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 100%;
`;

const Box = styled(motion.div)<{bgphoto: string}>`
    height: 200px;
    background-color: white;
    background-image: url(${(props) => props.bgphoto});
    background-size: cover;
    background-position: center center;
    cursor: pointer;

    &:first-child {
        transform-origin: center left;
    };
    &:last-child {
        transform-origin: center right;
    };
`;


const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4 {
        text-align: center;
        font-size: 18px;
    }
`;


const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`;

const BigMovie = styled(motion.div)<{ scrolly: number}>`
    position: absolute;
    width: 40vw;
    height: 80vh;
    margin: 0 auto;
    left: 0;
    right: 0;
    top: ${(props) => props.scrolly + 200}px;
    border-radius: 15px;
    overflow: hidden;
    background-color: ${(props) => props.theme.black.lighter};
`;


const BigCover = styled.div<{bgphoto: string}>`
    width: 100%;
    height: 400px;
    background-image: linear-gradient(to top, black, transparent), url(${(props) => props.bgphoto});
    background-size: cover;
    background-position: center center;
`;

const BigTitle = styled.h3`
    color: ${(props) => props.theme.white.lighter};
    padding: 20px;
    font-size: 46px;
    position: relative;
    top: -80px;
`;

const BigOverview = styled.p`
    padding: 20px;
    position: relative;
    top: -80px;
    color: ${(props) => props.theme.white.lighter};
`;


const rowVariants = {
    hidden: {
        x: window.outerWidth + 5,
        transition: { 
            type: "tween", 
            duration: 1 
    }
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth - 5,
    },
};

const boxVariants = {
    normal: {
        scale: 1,
        transition: {
            type: "tween",
        }
    },
    hover: {
        scale: 1.3,
        y: -80,
        transition: {
            delay: 0.5,
            duaration: 0.1,
            type: "tween",
        },
    },
};

const infoVariants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.5,
            duaration: 0.1,
            type: "tween",
        },
    }
};

const offset = 6;

function Home() {
    // movie API 호출
    const {data, isLoading} = useQuery<IGetMoviesResult>(
        ["movies", "nowPlaying"], 
        getMovies
    );

    // index 확인 후 페이지 설정
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const incraseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length -1;
            const MaxIndex = Math.floor(totalMovies / offset);
            setIndex((prev) => prev === MaxIndex ? 0 : prev + 1);
        };
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);

    // slider에서 box 클릭 시 동작
    // url 변경
    const history = useHistory();
    const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
    const onBoxClicked = (movieId:number) => { history.push(`/movies/${movieId}`) };
    const onOverlayClick = () => history.push("/");
    // 현재 화면 크기
    const { scrollY } = useScroll();
    // detail movie 정보 찾기
    const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);
    return (
        <Wrapper>
            {isLoading ? (<Loader>Loading..</Loader> 
            ): (
                <>
                    {/* 배너 */}
                    <Banner 
                        bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
                        onClick={incraseIndex}
                    >
                        <Title>{data?.results[0].title}</Title>
                        <OverView>{data?.results[0].overview}</OverView>
                    </Banner>

                    {/* 슬라이더 */}
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <Row
                                key={index}
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1 }}
                            >
                                {data?.results.slice(1).slice(offset*index, offset*index+offset).map((movie) => (
                                    <Box key={movie.id}
                                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                                        variants={boxVariants}
                                        whileHover="hover"
                                        initial="normal"
                                        onClick={() => onBoxClicked(movie.id)}
                                        layoutId = {movie.id + ""}
                                    >
                                        <Info
                                            variants={infoVariants}
                                        >
                                            <h4>{movie.title}</h4>
                                        </Info>
                                    </Box>
                                ))}
                                {/* {[1, 2, 3, 4, 5, 6].map((i) => (<Box key={i}>{i}</Box>))} */}
                            </Row>
                        </AnimatePresence>
                    </Slider>

                    {/* 슬라이더 클릭하면 큰 화면 표시 */}
                    <AnimatePresence>
                        {bigMovieMatch ? (
                            <>
                                <Overlay 
                                    onClick = {onOverlayClick}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                                <BigMovie
                                    layoutId={bigMovieMatch.params.movieId}
                                    scrolly={scrollY.get()}
                                >
                                    {clickedMovie && (
                                        <>
                                            <BigCover
                                                bgphoto={makeImagePath(clickedMovie.backdrop_path, "w500")}
                                            />
                                            <BigTitle>{clickedMovie.title}</BigTitle>
                                            <BigOverview>{clickedMovie.overview}</BigOverview>
                                        </>
                                    )}
                                </BigMovie>
                            </>
                        ) : null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}

export default Home;
