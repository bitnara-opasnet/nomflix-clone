import styled from "styled-components";
import { IProgram } from "../api";
import { makeImagePath } from "../utils";


const HomeBanner = styled.div<{bgphoto:string}>`
    display: flex;
    height: 100vh;
    justify-content: center;
    flex-direction: column;
    padding: 0 3vw;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bgphoto});
    background-size: cover;
    background-position: center;
`;

const Title = styled.h2`
    margin-bottom: 2rem;
    font-size: 4.5vw;
    font-weight: 700;
`;

const OverView = styled.p`
    margin-bottom: 20px;
    width: 40rem;
    font-size: 1.4vw;
    font-weight: 500;
    line-height: 2rem;
`;


function Banner({program}: {program: IProgram}) {
    return (
        <HomeBanner bgphoto={makeImagePath(program?.backdrop_path || "")}>
            <Title>{program.title}</Title>
            <OverView>{program.overview}</OverView>
        </HomeBanner>
    );
};

export default Banner;