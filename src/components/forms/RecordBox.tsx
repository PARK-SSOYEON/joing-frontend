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
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 0.5rem;
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
    font-size: 14px;
    border: none;
    border-radius: 12px;
    background-color: #e0e0e0;
    cursor: pointer;

    &:hover {
        background-color: #c8c8c8;
        border: none;
    }

    &:focus {
        outline: none;
    }
`;
