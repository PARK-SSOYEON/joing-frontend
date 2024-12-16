import React from "react";
import styled from "styled-components"

import iconCross from '../../assets/icons/icon_cross.png';
import LoginForm from "../forms/LoginForm.tsx";
interface AuthProps {
    handleClose: () => void;
}

const AuthModal: React.FC<AuthProps> = ({handleClose}) => {
    return (
        <ModalOverlay onClick={handleClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <Cross src={iconCross} alt="Cross Icon" onClick={handleClose}/>
                <LoginForm />
            </ModalContainer>
        </ModalOverlay>
    );
}

export default AuthModal;

const ModalOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
`;

const ModalContainer = styled.div`
    width: 350px;
    height: 530px;
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Cross = styled.img`
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
    width: 24px;
    height: 24px;
`;


