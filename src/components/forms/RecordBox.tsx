import React from 'react';
import styled from 'styled-components';

interface RecordBoxProps {
    id: string;
    title: string;
    summary: string;
    onViewDetails: (id: string) => void;
}

const RecordBox: React.FC<RecordBoxProps> = ({id, title, summary, onViewDetails}) => {
    return (
        <BoxContainer>
            <TextContainer>
                <Title>{title}</Title>
                <Summary>{summary}</Summary>
            </TextContainer>
            <DetailsButton onClick={() => onViewDetails(id)}>View details</DetailsButton>
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
    border: #e4e4e4 solid;
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
