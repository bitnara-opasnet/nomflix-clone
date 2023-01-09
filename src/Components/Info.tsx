import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovieDetail, IProgramDetail } from "../api";
import { Loader } from "../Routes/Home";
import { makeImagePath } from "../utils";

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

const StarRateWrap = styled.div`
    display: flex;
    align-items: center;
    .star_icon {
        display: inline-flex;
        margin-right: 5px;
    }
      
`


const InfoOverview = styled.p`
    padding: 20px;
    position: relative;
    margin-top: 20px;
    top: -200px;
    color: ${(props) => props.theme.white.lighter};
    line-height: 1.5;
`;



function Info({programId, category}: {programId: number, category: string}) {
    const {data, isLoading} = useQuery<IProgramDetail>(
        ["detail"], 
        () => getMovieDetail(programId, category)
    );
    const [ratesResArr, setRatesResArr] = useState([0, 0, 0, 0, 0]); 
    const AVR_RATE = data? data.vote_average * 10 : 0; 
    const STAR_IDX_ARR = ["first", "second", "third", "fourth", "last"]; 
    const calcStarRates = () => {
        let tempStarRatesArr = [0, 0, 0, 0, 0]; 
        let starVerScore = (AVR_RATE * 70) / 100;
        let idx = 0;
        while (starVerScore > 14) {
            tempStarRatesArr[idx] = 14;
            idx += 1; 
            starVerScore -= 14;
        }
        tempStarRatesArr[idx] = starVerScore;
        return tempStarRatesArr;
    };
    useEffect(() => {
        setRatesResArr(calcStarRates);
    }, [data]);
    function BigProgramInfo() {
        if (data) {
            if (category === "movie") {
                return (
                    <>
                    <InfoCover
                        bgphoto={data.backdrop_path ? makeImagePath(data.backdrop_path, "w500") : makeImagePath(data.poster_path, "w500")}
                    />
                    <InfoTitle>{data.title}</InfoTitle>
                    <InfoTagline>{data.tagline}</InfoTagline>
                    <InfoGenres>
                        <ul>
                        <li>장르: </li>
                        {data.genres.map((genere) => (
                            <li key={genere.id}>{genere.name}</li>
                        ))}
                        </ul>
                    </InfoGenres>
                    <InfoTime>
                        개봉일: <span>{data.release_date}</span>
                        <br />
                        상영시간: <span>{data.runtime} 분</span>
                    </InfoTime>
                    <InfoVote>
                        <StarRateWrap>
                            {STAR_IDX_ARR.map((item, idx) => (
                                    <span className="star_icon" key={`${item}_${idx}`}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="2vw"
                                            height="39"
                                            viewBox="0 0 14 13"
                                            fill="#cacaca"
                                        >
                                            <clipPath id={`${item}StarClip`}>
                                                <rect width={`${ratesResArr[idx]}`} height="39" />
                                            </clipPath>
                                            <path
                                                id={`${item}Star`}
                                                d="M9,2l2.163,4.279L16,6.969,12.5,10.3l.826,4.7L9,12.779,4.674,15,5.5,10.3,2,6.969l4.837-.69Z"
                                                transform="translate(-2 -2)"
                                            />
                                            <use
                                                clipPath={`url(#${item}StarClip)`}
                                                href={`#${item}Star`}
                                                fill="#ffd400"
                                            />
                                        </svg>
                                    </span>
                                )
                            )}
                        </StarRateWrap>
                        <span style={{ marginTop: "3px", marginRight: "10px" }}>
                            {data.vote_average?.toFixed(1)}
                        </span>
                        <span style={{ marginTop: "3px" }}>
                            ({data.vote_count?.toLocaleString("ko-KR")}명이 투표함)
                        </span>
                    </InfoVote>
                    <InfoOverview>{data.overview}</InfoOverview>
                    </>                
                )
            } else if (category === "tv") {
                return (
                    <>
                    <InfoCover
                        bgphoto={data.backdrop_path ? makeImagePath(data.backdrop_path, "w500") : makeImagePath(data.poster_path, "w500")}
                    />
                    <InfoTitle>{data.name}</InfoTitle>
                    {/* <InfoSeasons>
                        <ul>
                        {data.seasons.map((season) => (
                            <li key={season.id}>{season.name}({season.episode_count})</li>
                        ))}
                        </ul>
                    </InfoSeasons> */}
                    <InfoTagline>{data.tagline}</InfoTagline>
                    <InfoGenres>
                        <ul>
                            <li>장르: </li>
                        {data.genres.map((genere) => (
                            <li key={genere.id}>{genere.name}</li>
                        ))}
                        </ul>
                    </InfoGenres>
                    <InfoTime>
                        첫방송 날짜: <span>{data.first_air_date}</span>
                        <br />
                        방송상영시간: <span>{data.episode_run_time} 분</span>
                    </InfoTime>
                    <InfoVote>
                    <StarRateWrap>
                            {STAR_IDX_ARR.map((item, idx) => {
                                return (
                                    <span className="star_icon" key={`${item}_${idx}`}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="2vw"
                                            height="39"
                                            viewBox="0 0 14 13"
                                            fill="#cacaca"
                                        >
                                            <clipPath id={`${item}StarClip`}>
                                                <rect width={`${ratesResArr[idx]}`} height="39" />
                                            </clipPath>
                                            <path
                                                id={`${item}Star`}
                                                d="M9,2l2.163,4.279L16,6.969,12.5,10.3l.826,4.7L9,12.779,4.674,15,5.5,10.3,2,6.969l4.837-.69Z"
                                                transform="translate(-2 -2)"
                                            />
                                            <use
                                                clipPath={`url(#${item}StarClip)`}
                                                href={`#${item}Star`}
                                                fill="#ffd400"
                                            />
                                        </svg>
                                    </span>
                                );
                            })}
                        </StarRateWrap>
                        <span style={{ marginTop: "3px", marginRight: "10px" }}>
                            {data.vote_average?.toFixed(1)}
                        </span>
                        <span style={{ marginTop: "3px" }}>
                            ({data.vote_count?.toLocaleString("ko-KR")}명이 투표함)
                        </span>
                    </InfoVote>
                    <InfoOverview>{data.overview}</InfoOverview>
                    </> 
                )
            };
        };
    };

    return (<>
        {isLoading ? (
            <Loader>Loading..</Loader>
        ) : (    
            <>{BigProgramInfo()}</>
        )}
    </>);
};

export default Info;