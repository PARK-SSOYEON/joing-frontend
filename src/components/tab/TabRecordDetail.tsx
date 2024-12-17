import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import SearchIcon from "../../assets/icons/icon_search.png";
import {ViewDraftList} from "../../services/draftService.ts";
import {useNavigate} from "react-router-dom";
import RecordBox from "../forms/RecordBox.tsx";

const TabRecordDetail: React.FC = () => {
    const [drafts, setDrafts] = useState<{ id: string; title: string; summary: string }[]>([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [throttledKeyword, setThrottledKeyword] = useState('');
    const navigate = useNavigate();

    const fetchDrafts = async () => {
        try {
            const response = await ViewDraftList();
            setDrafts(response.data || []);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    useEffect(() => {
        fetchDrafts();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setThrottledKeyword(searchKeyword);
        }, 300);

        return () => clearInterval(interval);
    }, [searchKeyword]);

    const handleViewDetails = (id: string) => {
        navigate(`/draftplan/${id}`);
    };

    const filteredItems = drafts.filter(item =>
        item.title.toLowerCase().includes(throttledKeyword.toLowerCase())
    );

    return (
        <RecordDetail>
            <SearchBar>
                <img src={SearchIcon} alt="search icon"/>
                <Search
                    placeholder="검색어를 입력하세요..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
            </SearchBar>
            {filteredItems.map((item) => (
                <RecordBox
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    summary={item.summary}
                    onViewDetails={handleViewDetails}
                />
            ))}
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
    padding-bottom: 2rem;
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
