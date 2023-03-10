import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { IProgram } from "../api";
import { makeImagePath, useWindowDimensions } from "../utils";
import Info from "./Info";

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

export const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`;

export const InfoWrapper = styled(motion.div)`
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

export function Slider({data, title, category, rowIndex, current}: ISliderProps) {
    // index ?????? ??? ????????? ??????
    const width = useWindowDimensions();
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
    // slider?????? box ?????? ??? ??????
    // url ??????
    const history = useHistory();
    const bigProgramMatch = useRouteMatch<{ programId: string }>(`/${category}/${current}/:programId`);
    const onBoxClicked = (programId:number) => { 
        history.push(`/${category}/${current}/${programId}`);
    };
    const onOverlayClick = () => category === "movie" ? history.push("/") : history.push("/tv");

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
                        <InfoWrapper layoutId={current + bigProgramMatch.params.programId}>
                            <Info 
                                programId={+bigProgramMatch.params.programId}
                                category={category}
                            />
                        </InfoWrapper>
                    </>
                ) : null}
            </AnimatePresence>
        </>
    );
};


