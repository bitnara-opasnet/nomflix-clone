import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getTvShows, IGetTvShowsResult } from "../api";
import { makeImagePath } from "../utils";

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
    display: flex;
    height: 100vh;
    justify-content: center;
    flex-direction: column;
    padding: 6.8rem 6rem;
    background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)), url(${(props) => props.bgphoto});
    background-size: cover;
    background-position: center center;
`;

const Title = styled.h2`
    margin-bottom: 2rem;
    font-size: 4rem;
    font-weight: 700;
`;

const OverView = styled.p`
    margin-bottom: 2rem;
    width: 52.8rem;
    font-size: 1.8rem;
    font-weight: 500;
    line-height: 2.5rem;
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
    padding: 0px 3vw;

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

const BigTvShow = styled(motion.div)<{ scrolly: number}>`
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


function Tv() {
    // tvshow API 호출
    const {data, isLoading} = useQuery<IGetTvShowsResult>(
        ["tvShows", "popular"], 
        getTvShows
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
    const bigTvShowMatch = useRouteMatch<{ tvShowId: string }>("/tv/:tvShowId");
    const onBoxClicked = (tvShowId: number) => { history.push(`/tv/${tvShowId}`) };
    const onOverlayClick = () => history.push("/tv");
    // 현재 화면 크기
    const { scrollY } = useScroll();
    // detail movie 정보 찾기
    const clickedTvShow = bigTvShowMatch?.params.tvShowId && data?.results.find((tvshow) => tvshow.id === +bigTvShowMatch.params.tvShowId);
    return (
        <Wrapper>
            {isLoading ? (<Loader>Loading..</Loader>) : (
                <>
                    {/* 배너 */}
                    <Banner 
                        bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
                        onClick={incraseIndex}
                    >
                        <Title>{data?.results[0].name}</Title>
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
                                {data?.results.slice(1).slice(offset*index, offset*index+offset).map((tvshow) => (
                                    <Box key={tvshow.id}
                                        bgphoto={tvshow.backdrop_path ? makeImagePath(tvshow.backdrop_path, "w500") : makeImagePath(tvshow.poster_path, "w500")}
                                        variants={boxVariants}
                                        whileHover="hover"
                                        initial="normal"
                                        layoutId = {tvshow.id + ""}
                                        onClick={() => onBoxClicked(tvshow.id)}
                                    >
                                        <Info
                                            variants={infoVariants}
                                        >
                                            <h4>{tvshow.name}</h4>
                                        </Info>
                                    </Box>
                                ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>

                    {/* 슬라이더 클릭하면 큰 화면 표시 */}
                    <AnimatePresence>
                        {bigTvShowMatch ? (
                            <>
                                <Overlay 
                                    onClick = {onOverlayClick}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                                <BigTvShow
                                    layoutId={bigTvShowMatch.params.tvShowId}
                                    scrolly={scrollY.get()}
                                >
                                    {clickedTvShow && (
                                        <>
                                            <BigCover
                                                bgphoto={clickedTvShow.backdrop_path ? makeImagePath(clickedTvShow.backdrop_path, "w500") : makeImagePath(clickedTvShow.poster_path, "w500")}
                                            />
                                            <BigTitle>{clickedTvShow.name}</BigTitle>
                                            <BigOverview>{clickedTvShow.overview}</BigOverview>
                                        </>
                                    )}
                                </BigTvShow>
                            </>
                        ) : null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}

export default Tv;