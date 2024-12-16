import React from 'react';
import styled from 'styled-components';
import {useUser} from "../../contexts/UserContext.tsx";
import {Role} from "../../constants/roles.ts";

interface RecordBoxProps {
    title: string;
    summary: string;
    onViewDetails: () => void;
}

const RecordBox: React.FC<RecordBoxProps> = ({title, summary, onViewDetails}) => {
    const {role} = useUser();

    return (
        <BoxContainer>
            {role === Role.PRODUCT_MANAGER && <IconPlaceholder/>}
            <TextContainer>
                <Title>{title}</Title>
                <Summary>{summary}</Summary>
            </TextContainer>
            <DetailsButton onClick={onViewDetails}>View details</DetailsButton>
        </BoxContainer>
    );
};

export default RecordBox;

const BoxContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
`;

const IconPlaceholder = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #d3d3d3;
    margin-right: 1rem;
`;

const TextContainer = styled.div`
    flex-grow: 1;
    padding: 1rem;
`;

const Title = styled.h4`
    font-size: 16px;
    margin: 0;
    font-weight: 600;
`;

const Summary = styled.p`
    font-size: 14px;
    color: #6c6c6c;
    margin: 0;
`;

const DetailsButton = styled.button`
    padding: 0.5rem 1rem;
    margin: 1rem;
    font-size: 14px;
    border: none;
    border-radius: 12px;
    background-color: #f3f3f3;
    cursor: pointer;
    transition: transform 0.3s ease, background-color 0.3s ease;

    &:hover {
        background-color: #c8c8c8;
        border: none;
        transform: scale(1.05);
    }

    &:focus {
        outline: none;
    }
`;
