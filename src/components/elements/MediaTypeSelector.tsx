import React from "react";
import styled from "styled-components";

interface MediaTypeProps {
    selectedType: string | null;
    setSelectedType: (type: string) => void;
    readOnly: boolean;
}

const MediaTypeSelector: React.FC<MediaTypeProps> = ({ selectedType, setSelectedType, readOnly }) => {
    const handleTypeClick = (type: string) => {
        if (!readOnly) {
            setSelectedType(type);
        }
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    };

    return (
        <Types>
            <Type
                onClick={(e) => {
                    handleTypeClick("SHORT_FORM");
                    handleButtonClick(e);
                }}
                isSelected={selectedType === "SHORT_FORM"}
                disabled={readOnly}
            >
                Short-Form
            </Type>
            <Type
                onClick={(e) => {
                    handleTypeClick("LONG_FORM");
                    handleButtonClick(e);
                }}
                isSelected={selectedType === "LONG_FORM"}
                disabled={readOnly}
            >
                Long-Form
            </Type>
        </Types>
    )
}

export default MediaTypeSelector;

const Types = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 8px;
`;

const Type = styled.button<{ isSelected: boolean }>`
    padding: 6px 10px;
    border: 1px solid ${({isSelected}) => (isSelected ? '#555' : '#ccc')};
    border-radius: 20px;
    background-color: ${({isSelected}) => (isSelected ? '#b6b6b6' : '#f9f9f9')};
    cursor: pointer;
    transition: background-color 0.1s, border-color 0.3s;
    font-size: 0.8rem;

    &:hover {
        background-color: #bdbdbd;
        border-color: #888;
    }

    &:focus {
        border-color: #555;
        outline: none;
    }

`;
