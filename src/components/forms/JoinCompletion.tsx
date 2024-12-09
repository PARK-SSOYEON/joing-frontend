import React from "react";
import JoingLogo from '../../assets/Logo_joing2.png';
import styled from "styled-components";
import {useNavigate} from "react-router-dom";


const JoinCompletion: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Logo src={JoingLogo} alt="Project Logo" />
            <LogoTitle>Joing</LogoTitle>
            <Title>회원가입이 완료되었습니다</Title>
            <OkayButton onClick={() => navigate("/")}>확인</OkayButton>
        </>
    );
}

export default JoinCompletion;

const Logo = styled.img`
    width: 180px;
    height: auto;
    margin-bottom: 20px;
`;

const LogoTitle = styled.h1`
    font-family: 'SaenggeoJincheon', serif;
    letter-spacing: -0.03em;
    font-size: 40px;
    margin: 0 0 40px 0;
`;

const Title = styled.h2`
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin: 5rem;
`;

const OkayButton = styled.button`
    padding: 6px 15px;
    width: 100px;
    height: 40px;
    background-color: #000000;
    border: none;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #3e3e3e;
        border: none;
    }
`;
