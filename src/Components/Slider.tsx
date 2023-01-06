import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { IProgram, getDetail } from "../api";
import { makeImagePath, useWindowDimensions } from "../utils";

const SliderWrapper = styled.div`
    position: relative;
    top: -230px;
    margin-bottom: 15vw;
    :hover {
        button {
            opacity: 1;
        }
    };
    @media screen and (max-width: 500px) {
        margin-bottom: 13vw;
    };
`;

const RowTitle = styled.div`
    margin-bottom: 1.5rem;
    width: 52.8rem;
    font-size: 1.8rem;
    font-weight: 500;
    line-height: 2.5rem;
    padding-left: 3vw;
    @media screen and (max-width: 500px) {
        margin-bottom: 7px;
    };
`

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
    &:first-child { transform-origin: center left; };
    &:last-child { transform-origin: center right;};
`;


const BoxTitle = styled(motion.div)`
    padding: 10px;
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4 {
        text-align: center;
        font-weight: 500;
        font-size: 1vw;
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

const InfoWrappe = styled(motion.div)`
    position: fixed;
    width: 40vw;
    height: 80vh;
    top: 100px;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-color: ${props => props.theme.black.lighter};
    border-radius: 15px;
    overflow-x: hidden;
    z-index: 101;
`;


const InfoCover = styled.div<{bgphoto: string}>`
    width: 100%;
    height: 400px;
    background-image: linear-gradient(to top, black, transparent), url(${(props) => props.bgphoto});
    background-size: cover;
    background-position: center center;
`;

const InfoTitle = styled.h3`
    color: ${(props) => props.theme.white.lighter};
    padding: 20px;
    font-size: 46px;
    position: relative;
    top: -80px;
`;

const InfoTagline = styled.h5`
    color: ${(props) => props.theme.white.lighter};
    padding: 20px;
    position: relative;
    margin-bottom: 3px;
    font-size: 30px;
    top: -100px;
`;

const InfoGenres = styled.div`
    font-size: 1em;
    top: -100px;
    position: relative;
    padding: 20px;

    ul {
        li {
        border-radius: 3px;
        padding: 1px;
        color: ${(props) => props.theme.white.lighter};
        background-color: ${(props) => props.theme.black.lighter};
        float: left;
        margin-right: 4px;
        margin-bottom: 3px;
        }
    }

    @media screen and (max-width: 500px) {
        font-size: 0.5em;
    }
`;


const InfoSeasons = styled.div`
    font-size: 1em;
    top: -100px;
    position: relative;
    padding: 20px;

    ul {
        li {
        border-radius: 3px;
        padding: 1px;
        color: ${(props) => props.theme.white.lighter};
        background-color: ${(props) => props.theme.black.lighter};
        float: left;
        margin-right: 4px;
        margin-bottom: 3px;
        &:hover {
            filter: brightness(1.5);
        }
        }
    }

    @media screen and (max-width: 500px) {
        font-size: 0.5em;
    }
`;

const InfoTime = styled.div`
    position: relative;
    font-size: 0.8em;
    top: -110px;
    padding: 20px;

    span {
        color: ${(props) => props.theme.white.lighter};
    }

    @media screen and (max-width: 500px) {
        font-size: 0.4em;
    }
`;

const InfoVote = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    position: relative;
    top: -150px;
    padding: 20px;

    span:nth-of-type(1) {
        font-size: 2.3vw;
        color: #ffd400;
        font-weight: 400;
    }
    span:last-of-type {
        font-size: 1.3vw;
        font-weight: 400;
    }

    @media screen and (max-width: 500px) {
        margin: -10px 0 -5px 0;
    }
`;


const InfoOverview = styled.p`
    padding: 20px;
    position: relative;
    top: -200px;
    color: ${(props) => props.theme.white.lighter};
`;


const NextBtn = styled(motion.button)`
    background-color: rgba(0, 0, 0, 0.3);
    height: 10vw;
    width: 3vw;
    position: absolute;
    right: 0;
    opacity: 0;
    cursor: pointer;
    :hover {
        filter: brightness(1.5);
    }
`;

const PrevBtn = styled(NextBtn)`
    left: 0;
`;


const rowVariants = {
    center: {
        scale: 1,
        x: 0,
        transition: { duration: 1 },
    },
    entry: ({ next, width }: { next: boolean; width: number }) => {
        return {
            x: next ? width : -width,
            transition: { duration: 1 },
        };
    },
    exit: ({ next, width }: { next: boolean; width: number }) => {
        return {
            x: next ? -width : width,
            transition: {
                duration: 1,
            },
        };
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
        y: -30,
        transition: {
            delay: 0.5,
            duaration: 0.3,
            type: "tween",
        },
    },
};

const infoVariants = {
    hover: {
        opacity: 1,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        transition: {
            delay: 0.5,
            duaration: 0.3,
            type: "tween",
        },
    }
};


export interface ISliderProps {
    data: IProgram[];
    title: string;
    category: string;
    rowIndex: number;
    current: string;
};

const offset = 6; 

const DetaultDetail = {
    tagline: "",
    genres: [{id: 0, name: ""}],
    homepage: "",
    vote_average: 0,
    vote_count: 0,
    runtime: 0,
    release_date: "",
    episode_run_time: 0,
    seasons: [{id: 0, name: "", air_date: "", episode_count: 0}],
    first_air_date: ""
};


export function Slider({data, title, category, rowIndex, current}: ISliderProps) {
    // index 확인 후 페이지 설정
    const width = useWindowDimensions();
    const [detail, setDetail] = useState(DetaultDetail);
    const [index, setIndex] = useState([0, 0, 0, 0]);
    const [leaving, setLeaving] = useState(false);
    const [next, setNext] = useState<Boolean>(true);
    const custom = { next, width };
    const changeIndex = ( next: boolean, rowIndex: number ) => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            setNext(next);
            const totalMovies = data.length -1;
            const MaxIndex = Math.floor(totalMovies / offset);
            next ? (
                setIndex((prev) => {
                    const result = [...prev];
                    result[rowIndex] === MaxIndex ? (result[rowIndex] = 0) : (result[rowIndex] += 1)
                    return result
                }) 
            ) : (
                setIndex((prev) => {
                    const result = [...prev];
                    result[rowIndex] === MaxIndex ? (result[rowIndex] = 0) : (result[rowIndex] -= 1)
                    return result
                })
            )
        };
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);
    // slider에서 box 클릭 시 동작
    // url 변경
    const history = useHistory();
    const bigProgramMatch = useRouteMatch<{ programId: string }>(`/${category}/${current}/:programId`);
    const onBoxClicked = (programId:number) => { 
        history.push(`/${category}/${current}/${programId}`);
    };
    const onOverlayClick = () => category === "movie" ? history.push("/") : history.push("/tv");
    // detail program 정보 찾기
    const clickedProgram = (bigProgramMatch?.params.programId) && data.find((program) => String(program.id) === String(bigProgramMatch?.params.programId));
    useEffect(() => {
        if (bigProgramMatch?.isExact === true) {
            const detailUrl = getDetail({category: category, programId: +bigProgramMatch?.params.programId});
            fetch(detailUrl)
            .then(response => response.json())
            .then(responseData => { setDetail(responseData); });
        };
    }, [clickedProgram]);
    
    function bigProgramInfo() {
        if (clickedProgram && category === "movie") {
            return (
                <>
                <InfoCover
                    bgphoto={clickedProgram.backdrop_path ? makeImagePath(clickedProgram.backdrop_path, "w500") : makeImagePath(clickedProgram.poster_path, "w500")}
                />
                <InfoTitle>{clickedProgram.title || clickedProgram.name}</InfoTitle>
                {detail ? (
                    <>
                        <InfoTagline>{detail.tagline}</InfoTagline>
                        <InfoGenres>
                            <ul>
                            <li>장르: </li>
                            {detail.genres.map((genere) => (
                                <li key={genere.id}>{genere.name}</li>
                            ))}
                            </ul>
                        </InfoGenres>
                        <InfoTime>
                            개봉일: <span>{detail.release_date}</span>
                            <br />
                            상영시간: <span>{detail.runtime} 분</span>
                        </InfoTime>
                        <InfoVote>
                            <span style={{ marginTop: "3px", marginRight: "10px" }}>
                                {detail.vote_average?.toFixed(1)}
                            </span>
                            <span style={{ marginTop: "3px" }}>
                                ({detail.vote_count?.toLocaleString("ko-KR")}명이 투표함)
                            </span>
                        </InfoVote>
                    </>
                    ) : null}
                <InfoOverview>{clickedProgram.overview}</InfoOverview>
                </>                
            )
        } else if (clickedProgram && category === "tv") {
            return (
                <>
                <InfoCover
                    bgphoto={clickedProgram.backdrop_path ? makeImagePath(clickedProgram.backdrop_path, "w500") : makeImagePath(clickedProgram.poster_path, "w500")}
                />
                <InfoTitle>{clickedProgram.title || clickedProgram.name}</InfoTitle>
                <InfoSeasons>
                    <ul>
                    {detail.seasons.map((season) => (
                        <li key={season.id}>{season.name}({season.episode_count})</li>
                    ))}
                    </ul>
                </InfoSeasons>
                {detail ? (
                    <>
                        <InfoTagline>{detail.tagline}</InfoTagline>
                        <InfoGenres>
                            <ul>
                                <li>장르: </li>
                            {detail.genres.map((genere) => (
                                <li key={genere.id}>{genere.name}</li>
                            ))}
                            </ul>
                        </InfoGenres>
                        <InfoTime>
                            첫방송 날짜: <span>{detail.first_air_date}</span>
                            <br />
                            방송상영시간: <span>{detail.episode_run_time} 분</span>
                        </InfoTime>
                        <InfoVote>
                            <span style={{ marginTop: "3px", marginRight: "10px" }}>
                                {detail.vote_average?.toFixed(1)}
                            </span>
                            <span style={{ marginTop: "3px" }}>
                                ({detail.vote_count?.toLocaleString("ko-KR")}명이 투표함)
                            </span>
                        </InfoVote>
                    </>
                    ) : null}
                <InfoOverview>{clickedProgram.overview}</InfoOverview>
                </> 
            )
        }
    };

    return (
        <>
            <SliderWrapper>
                <RowTitle>{title}</RowTitle>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving} custom={custom}>
                    <Row
                        custom={custom}
                        key={index[rowIndex]}
                        variants={rowVariants}
                        initial="entry"
                        animate="center"
                        exit="exit"
                        transition={{ type: "tween", duration: 1 }}
                        >
                        {rowIndex === 0 ? (
                            <>
                            {data.slice(1).slice(offset*index[rowIndex], offset*index[rowIndex]+offset).map((program) => (
                                <Box key={program.id}
                                    bgphoto={program.backdrop_path ? makeImagePath(program.backdrop_path, "w500") : makeImagePath(program.poster_path, "w500")}
                                    variants={boxVariants}
                                    whileHover="hover"
                                    initial="normal"
                                    onClick={() => onBoxClicked(program.id)}
                                    layoutId = {current + program.id}
                                >
                                    <BoxTitle variants={infoVariants}>
                                        <h4>{program.title || program.name}</h4>
                                    </BoxTitle>
                                </Box>
                            ))}                            
                            </>
                            ) : (
                            <>
                            {data.slice(offset*index[rowIndex], offset*index[rowIndex]+offset).map((program) => (
                                <Box key={program.id}
                                    bgphoto={program.backdrop_path ? makeImagePath(program.backdrop_path, "w500") : makeImagePath(program.poster_path, "w500")}
                                    variants={boxVariants}
                                    whileHover="hover"
                                    initial="normal"
                                    onClick={() => onBoxClicked(program.id)}
                                    layoutId = {current + program.id}
                                >
                                    <BoxTitle variants={infoVariants}>
                                        <h4>{program.title || program.name}</h4>
                                    </BoxTitle>
                                </Box>
                            ))}
                            </>
                        )}                       
                    </Row>
                    <NextBtn key="next" onClick={() => changeIndex(true, rowIndex)}>
                        <svg
                            style={{ fill: "white", width: "1.5vw" }}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 384 512"
                        >
                            <path d="M342.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                        </svg>
                    </NextBtn>
                    <PrevBtn  key="perv" onClick={() => changeIndex(false, rowIndex)}>
                        <svg
                            style={{ fill: "white", width: "1.5vw" }}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 384 512"
                        >
                            <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
                        </svg>    
                    </PrevBtn>
                </AnimatePresence>
            </SliderWrapper>

            <AnimatePresence>
                {bigProgramMatch ? (
                    <>
                        <Overlay 
                            onClick={onOverlayClick}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        <InfoWrappe layoutId = {current + bigProgramMatch.params.programId}>
                            {bigProgramInfo()}
                        </InfoWrappe>
                    </>
                ) : null}
            </AnimatePresence>
        </>
    );
};


