import React from "react";
import styled from "styled-components";
import iconCreator from "../../assets/icons/icon_creator.png";
import iconPlanner from "../../assets/icons/icon_planner.png";

interface RoleSelectionProps {
    onSelectCreator: () => void;
    onSelectProductManager: () => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectCreator, onSelectProductManager }) => {
    return (
        <>
            <Title>회원가입</Title>
            <RoleSelect>
                <Box onClick={onSelectCreator}>
                    <img src={iconCreator} alt="Creator icon"/>
                    <RoleText>크리에이터</RoleText>
                </Box>
                <Box onClick={onSelectProductManager}>
                    <img src={iconPlanner} alt="Planner icon"/>
                    <RoleText>기획자</RoleText>
                </Box>
            </RoleSelect>
        </>
    );
}

export default RoleSelection;

const Title = styled.h2`
    font-size: 24px;
    font-weight: bold;
    margin: 4rem;
    text-align: center;
`;

const RoleSelect = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
    gap: 2rem;
`;

const Box = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    aspect-ratio: 1 / 1.3;
    height: auto;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: #f9f9f9;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;

    &:hover {
        background-color: #ececec;
        border-color: #ccc;
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    img {
        width: 80%;
        height: auto;
        margin-bottom: 10px;
    }
`;

const RoleText = styled.span`
    font-size: 18px;
    font-weight: 500;
    margin-top: 1rem;
    color: #333;
`;
