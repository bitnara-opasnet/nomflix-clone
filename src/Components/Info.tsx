import styled from "styled-components";

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

function Info() {
    return null;
};

export default Info;