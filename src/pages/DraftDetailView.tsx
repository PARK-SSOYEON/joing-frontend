import {useNavigate, useParams} from "react-router-dom";
import styled from "styled-components";
import Layout from "../components/layout/Layout.tsx";
import {useUser} from '../contexts/UserContext.tsx'
import {Role} from "../constants/roles.ts";
import {DeleteDraftPlan, ViewDraftPlan} from "../services/draftService.ts";
import {useEffect, useState} from "react";
import WarningIcon from "../assets/icons/icon_warning.png";
import CancelModal from "../components/modal/Modal.tsx";

interface EtcItem {
    id: number;
    name: string;
    value: string;
}

interface SummaryItem {
    title: string;
    content: string;
    keywords: string[];
}

interface Draft {
    id: number;
    nickname: string;
    email: string;
    profileImage: string;
    title: string;
    content: string;
    mediaType: string;
    category: string;
    etcs: EtcItem[];
    summary: SummaryItem;
}

const DraftDetailView = () => {
    const {id} = useParams<{ id: string }>();
    const [draft, setDraft] = useState<Draft | null>(null);
    const {role} = useUser();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        const fetchDraft = async () => {
            try {
                const response = await ViewDraftPlan(id || "");
                setDraft(response.data);
            } catch (error) {
                console.error("Failed to fetch draft:", error);
            }
        };
        fetchDraft();
    }, [id]);

    const handleDelete = async () => {
        try {
            if (draft) {
                await DeleteDraftPlan(draft.id.toString());
                navigate(-1);
            }
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    };

    if (!draft) {
        return (
            <Layout>
                <None>기획안이 없습니다.</None>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container>
                <LeftBox>
                    <Title>{draft.title}</Title>
                    <Content dangerouslySetInnerHTML={{__html: draft.content}}/>
                </LeftBox>
                <RightBox>
                    <Profile>
                        <ProfileImg src={draft?.profileImage} alt={`${draft?.nickname}'s profile`}/>
                        <ProfileDetail>
                            <Name>{draft.nickname}</Name>
                            <Email>soyeon_0307@naver.com</Email>
                        </ProfileDetail>
                    </Profile>
                    <SummaryView>
                        <Label>Summary</Label>
                        <Summary>{draft.summary?.content ? draft.summary.content : "No summary available"}</Summary>
                    </SummaryView>
                    <KeywordView>
                        <Label>Keywords</Label>
                        {draft.summary?.keywords && draft.summary.keywords.length > 0 ? (
                            <Keywords>
                                {draft.summary.keywords.map((keyword, idx) => (
                                    <Keyword key={idx}>{keyword}</Keyword>
                                ))}
                            </Keywords>
                        ) : (
                            <p>키워드가 없습니다.</p>
                        )}
                    </KeywordView>
                    <TypeView>
                        <Label>Type</Label>
                        <Type>{draft.mediaType}</Type>
                    </TypeView>
                    <CategoryView>
                        <Label>Category</Label>
                        <Category>{draft.category}</Category>
                    </CategoryView>
                    <MiscView>
                        <Label>Additional Information</Label>
                        {draft.etcs.length > 0 ? (
                            <Miscs>
                                {draft.etcs.map((field, idx) => (
                                    <Misc key={idx}>
                                        {field.name}: {field.value}
                                    </Misc>
                                ))}
                            </Miscs>
                        ) : (
                            <p>추가 정보가 없습니다.</p>
                        )}
                    </MiscView>
                </RightBox>
            </Container>
            {role === Role.PRODUCT_MANAGER && (
                <Buttons>
                    <DeleteButton onClick={openModal}>삭제하기</DeleteButton>
                </Buttons>
            )}
            <CancelModal isOpen={isModalOpen} onClose={closeModal}>
                <WarningHeader>
                    <img src={WarningIcon} alt="warning Icon"/>
                    <h2>경고</h2>
                </WarningHeader>
                <p>기획안을 삭제하시겠습니까?</p>
                <ButtonContainer>
                    <GrayButton onClick={closeModal}>취소</GrayButton>
                    <RedButton onClick={handleDelete}>삭제</RedButton>
                </ButtonContainer>
            </CancelModal>
        </Layout>
    );
};

export default DraftDetailView;

const None = styled.div`
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
`;

const Container = styled.section`
    display: flex;
    gap: 50px;
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
    margin: 20px;
`;

const LeftBox = styled.div`
    flex: 2;
    display: flex;
    flex-direction: column;

    height: 100%;
`;

const Title = styled.h2`
    font-family: 'SUITE-Bold';
    font-size: 1.5rem;
    margin: 30px 0;
`;

const Content = styled.article``;

const Label = styled.label`
    font-family: 'SUITE-Bold', serif;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 8px;
    margin-top: 0;
    color: #333;
`;

const RightBox = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const View = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const Profile = styled.div`
    width: 100%;
    height: 150px;
    display: flex;
    align-items: center;
    margin: 8px 0;
    gap: 16px;
`;

const ProfileImg = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: gray;
`;

const ProfileDetail = styled.div``;

const Name = styled.h3`
    font-family: 'GongGothicMedium', serif;
`;

const Email = styled.p`
    font-family: 'SUITE-Bold', serif;
    font-size: 0.9rem;
`;

const SummaryView = styled(View)``;

const Summary = styled.p`
    font-family: 'SUITE-Regular', serif;
    font-size: 1rem;
    margin: 0;
`;

const KeywordView = styled(View)``;

const Keywords = styled.div`
    display: flex;
    gap: 8px;
`;

const Span = styled.span`
    padding: 6px 10px;
    border-radius: 10px;
    background-color: #f3f3f3;
    font-size: 13px;
    font-family: 'SUITE-Regular', serif;
`;

const Keyword = styled(Span)``;

const TypeView = styled(View)``;

const Type = styled(Span)``;

const CategoryView = styled(View)``;

const Category = styled(Span)``;

const MiscView = styled(View)``;

const Miscs = styled.div``;

const Misc = styled.li`
    font-family: 'SUITE-Regular', serif;
    font-size: 1rem;
    margin: 0;
`;

const Buttons = styled.div`
    display: flex;
    justify-content: center;
    margin: 50px 0;
    padding-bottom: 30px;
    gap: 10px;
`;

const DeleteButton = styled.button`
    font-family: 'SUITE-Bold', serif;
    padding: 6px 15px;
    width: 200px;
    height: 40px;
    background-color: #ff5d5d;
    border: none;
    border-radius: 10px;
    color: white;
    transition: background-color 0.3s;
    cursor: pointer;

    &:hover {
        background-color: #FF3D3D;
        border: none;
    }

    &:focus {
        outline: none;
    }
`;

const WarningHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    h2 {
        font-size: 1.5rem;
        margin: 0;
    }

    img {
        width: 40px;
        height: auto;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    gap: 10px;
`;

const GrayButton = styled.button`
    background-color: #d9d9d9;
    color: #333;
    padding: 8px 16px;
    border: none;
    border-radius: 10px;
    cursor: pointer;

    &:hover {
        background-color: #bfbfbf;
    }

    &:focus {
        outline: none;
    }
`;

const RedButton = styled.button`
    background-color: #ff595b;
    padding: 8px 16px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    color: white;

    &:hover {
        background-color: #e33e3f;
    }

    &:focus {
        outline: none;
    }
`;
