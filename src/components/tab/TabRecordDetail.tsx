import React from 'react';
import styled from "styled-components";
import SearchIcon from "../../assets/icons/icon_search.png";
import RecordBox from "../forms/RecordBox.tsx";

const TabRecordDetail: React.FC = () => {

    const handleViewDetails = () => {

    };

    return (
        <RecordDetail>
            <SearchBar>
                <img src={SearchIcon} alt="search icon"/>
                <Search placeholder="검색어를 입력하세요..." />
            </SearchBar>
            <RecordBox
                title="Title1"
                summary="Summary 1"
                onViewDetails={handleViewDetails}
            />
            <RecordBox
                title="Title2"
                summary="Summary 2"
                onViewDetails={handleViewDetails}
            />
        </RecordDetail>
    );
};

export default TabRecordDetail;

const RecordDetail = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    gap: 1rem;
`;

const SearchBar = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    background-color: #f6f6f6;
    border-radius: 12px;
    margin-bottom: 0.2rem;

    img {
        width: 24px;
        height: auto;
        padding: 0.7rem;
    }
`;

const Search = styled.input`
    width: 100%;
    padding: 0.8rem;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    background-color: #f6f6f6;
    
    &:focus {
        outline: none;
        border-color: #007bff;
    }
`;
