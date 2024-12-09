import React from "react";
import kakaoLogin from '../../assets/kakao_login_medium_narrow.png';
import JoingLogo from '../../assets/Logo_joing2.png';
import styled from "styled-components";

const kakaologin = import.meta.env.VITE_KAKAO_LOGIN_URL;

const LoginForm: React.FC = () => {
    const handleLogin = () => {
        window.location.href = kakaologin;
    };

    return (
        <>
            <Logo src={JoingLogo} alt="Project Logo" />
            <LogoTitle>Joing</LogoTitle>
            <KakaoLoginButton onClick={handleLogin}>
                <img src={kakaoLogin} alt="Kakao Login" />
            </KakaoLoginButton>
        </>
    );
}

export default LoginForm;

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

const KakaoLoginButton = styled.button`
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    
    img {
        width: 200px;
        height: auto;
    }
`;
