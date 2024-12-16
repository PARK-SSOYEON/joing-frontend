import React from 'react';
import styled from 'styled-components';
import {useNavigate} from "react-router-dom";
import LogoImg from "../../assets/Logo_joing2.png";
import '../../styles/fonts.css';
import iconMail from "../../assets/icons/icon_mail.png";
import iconProfile from "../../assets/icons/icon_profile.png";
import iconLogout from "../../assets/icons/icon_logout.png";
import {logout} from "../../services/authService.ts";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {useUser} from "../../contexts/UserContext.tsx";

interface HeaderProps {
    onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({onLoginClick}) => {
    const navigate = useNavigate();
    const {accessToken} = useAuth();
    const {role} = useUser();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <HeaderContainer>
            <Content>
                <Logo onClick={() => navigate("/")}>
                    <img src={LogoImg} alt="arrow icon"/>
                    Joing
                </Logo>
                {accessToken ? (
                    <ButtonGroup>
                        {role && (
                            <>
                                <Button onClick={() => navigate("/message")}>
                                    <img src={iconMail} alt="message icon"/>
                                </Button>
                                <Button onClick={() => navigate("/mypage")}>
                                    <img src={iconProfile} alt="profile icon"/>
                                </Button>
                            </>
                        )}
                        <Button onClick={handleLogout}>
                            <img src={iconLogout} alt="logout icon"/>
                        </Button>
                    </ButtonGroup>
                ) : (
                    <Button onClick={onLoginClick}>Login</Button>
                )}
            </Content>
        </HeaderContainer>
    );
};

export default Header;

const HeaderContainer = styled.header`
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    z-index: 1000;
    background-color: white;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.05);
`;

const Content = styled.div`
    width: 70%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Logo = styled.div`
    font-family: 'SaenggeoJincheon', serif;
    letter-spacing: -0.03em;
    font-size: 28px;
    font-weight: bold;
    color: black;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    img {
        width: 44px;
        height: auto;
    }
`;

const Button = styled.button`
    font-family: 'SUITE-Regular', serif;
    border: none;
    font-size: 16px;
    cursor: pointer;
    background-color: white;

    &:hover {
        transform: scale(1.05);
    }

    &:focus {
        outline: none;
    }

    img {
        width: 24px;
        height: 24px;
    }
`;

const ButtonGroup = styled.div`

`;
