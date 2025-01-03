import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import Layout from "../components/layout/Layout.tsx";
import '../styles/fonts.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CancelModal from '../components/modal/Modal.tsx';
import {CategorySelector} from "../components/elements/CategorySelector.tsx";

import ArrowDown from '../assets/icons/icon_arrowdown.png';
import WarningIcon from '../assets/icons/icon_warning.png';
import Loading from '../assets/Loading.gif';
import NoticeIcon from "../assets/icons/icon_notice.png";
import {evaluationItem, patchDraftPlan, reSummaryItem, saveDraftPlan} from "../services/draftService.ts";
import MediaTypeSelector from "../components/elements/MediaTypeSelector.tsx";

const DraftPlan: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [miscFields, setMiscFields] = useState<{ name: string; value: string }[]>([{name: '', value: ''}]);
    const [id, setId] = useState<number>(0);
    const [readOnly, setReadOnly] = useState(false);
    const [isSummaryClicked, setIsSummaryClicked] = useState(false);
    const [isSummarizing, setIsSummaraizing] = useState(false);
    const [isFeedback, setIsFeedback] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const isOkayEnabled = title && content && selectedType && selectedCategory
    const quillRef = useRef<ReactQuill | null>(null);
    const navigate = useNavigate();

    const [summaryData, setSummaryData] = useState({
        title: '',
        content: '',
        keywords: [] as string[],
    });

    const [feedbackData, setFeedbackData] = useState('');

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const handleExit = () => navigate('/');

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }

    const handleContentChange = (content: string) => {
        setContent(content);
    }

    const handleMiscChange = (index: number, field: 'name' | 'value', value: string) => {
        const updatedFields = [...miscFields];
        updatedFields[index][field] = value;
        setMiscFields(updatedFields);
    };

    const addMiscField = () => {
        setMiscFields([...miscFields, {name: '', value: ''}]);
    };

    const removeMiscField = (index: number) => {
        setMiscFields(miscFields.filter((_, i) => i !== index));
    };

    const handleReWriteClick = () => {
        setReadOnly(false);
        setIsEditMode(true);

        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isOkayEnabled) {
            setIsSummaraizing(true);

            try {
                let itemId = null;
                let isSuccessful = false;

                if (!isEditMode) {
                    const response = await saveDraftPlan(
                        title,
                        content,
                        selectedType,
                        selectedCategory,
                        miscFields
                    );
                    if (response.status === 200) {
                        itemId = response.data.id;
                        setId(itemId);
                        isSuccessful = true;
                    }
                } else {
                    const response = await patchDraftPlan(
                        id,
                        title,
                        content,
                        selectedType,
                        selectedCategory,
                        miscFields
                    );
                    if (response.status === 200) {
                        itemId = id;
                        isSuccessful = true;
                    }
                }

                if (isSuccessful && itemId) {
                    const evaluationResponse = await evaluationItem(itemId);

                    if (evaluationResponse.data.type == "FEEDBACK") {
                        setIsFeedback(true);
                        const comment = evaluationResponse.data.data.comment;
                        setFeedbackData(comment);
                    } else {
                        setIsFeedback(false);
                        const {title, content, keywords} = evaluationResponse.data.data;

                        setSummaryData({
                            title,
                            content,
                            keywords,
                        });
                    }

                    setReadOnly(true);
                    setIsSummaryClicked(true);
                }
            } catch (error) {
                console.error("Failed to handle draft plan:", error);
            } finally {
                setIsSummaraizing(false);
            }
        }
    };

    const handleReSummary = async (draftId: number) => {
        setIsSummaraizing(true);

        try {
            const response = await reSummaryItem(draftId);
            const {title, content, keywords} = response.data;

            setSummaryData({
                title,
                content,
                keywords,
            });
        } catch (error) {
            console.error("Failed to fetch resummary:", error);
        }
        setIsSummaraizing(false);
    }

    useEffect(() => {
        if (isSummaryClicked) {
            window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
        }
    }, [isSummaryClicked]);

    const modules = {
        toolbar: [
            [{header: [1, 2, false]}],
            ['bold', 'italic', 'underline'],
            [{list: 'ordered'}, {list: 'bullet'}],
        ],
    };

    return (
        <Layout>
            <DraftForm onSubmit={handleSubmit}>
                <Title>기획안 작성</Title>
                <SubTitle>당신의 아이디어를 바탕으로 기획안을 작성해주세요</SubTitle>
                <Container>
                    <LeftBox>
                        <TitleForm>
                            <Label>Title</Label>
                            <TitleInputField
                                placeholder="제목을 입력해주세요"
                                value={title}
                                readOnly={readOnly}
                                onChange={handleTitleChange}
                            />
                        </TitleForm>
                        <ContentForm>
                            <Label>Content</Label>
                            <ReactQuillWrapper
                                ref={quillRef}
                                modules={modules}
                                value={content}
                                placeholder="내용을 입력해주세요"
                                theme="snow"
                                readOnly={readOnly}
                                onChange={handleContentChange}
                            />
                        </ContentForm>
                    </LeftBox>
                    <RightBox>
                        <CategoryForm>
                            <Label>카테고리</Label>
                            <CategorySelector
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                readOnly={readOnly}
                            />
                        </CategoryForm>
                        <TypeForm>
                            <Label>Media Type</Label>
                            <MediaTypeSelector selectedType={selectedType} setSelectedType={setSelectedType}
                                               readOnly={readOnly}/>
                        </TypeForm>
                        <MiscForm>
                            <Label>기타사항</Label>
                            <Notice>
                                <img src={NoticeIcon} alt="Notice Icon"/>
                                ex) 키: 180 이상 / 참고링크: youtube.com 등
                            </Notice>
                            {miscFields.map((field, index) => (
                                <div key={index} style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
                                    <InputField
                                        type="text"
                                        placeholder="항목"
                                        value={field.name}
                                        onChange={(e) => handleMiscChange(index, 'name', e.target.value)}
                                        disabled={readOnly}
                                    />
                                    <InputField
                                        type="text"
                                        placeholder="내용"
                                        value={field.value}
                                        onChange={(e) => handleMiscChange(index, 'value', e.target.value)}
                                        disabled={readOnly}
                                    />
                                    <RemoveButton
                                        type="button"
                                        onClick={() => removeMiscField(index)}
                                        disabled={readOnly}
                                    >
                                        -
                                    </RemoveButton>
                                </div>
                            ))}
                            <AddButton
                                type="button"
                                onClick={addMiscField}
                                disabled={readOnly}
                            >
                                + 필드 추가
                            </AddButton>
                        </MiscForm>
                    </RightBox>
                </Container>
                <Buttons>
                    <CancelButton
                        type="button"
                        onClick={openModal}
                    >
                        취소
                    </CancelButton>
                    <CancelModal isOpen={isModalOpen} onClose={closeModal}>
                        <WarningHeader>
                            <img src={WarningIcon} alt="warning Icon"/>
                            <h2>경고</h2>
                        </WarningHeader>
                        <p>취소하시면 작성하신 기획안이 저장되지 않습니다. 계속 작성하시겠습니까?</p>
                        <ButtonContainer>
                            <ExitButton onClick={handleExit}>나가기</ExitButton>
                            <ContinueButton onClick={closeModal}>이어서 작성하기</ContinueButton>
                        </ButtonContainer>
                    </CancelModal>
                    <SummarizeButton
                        type="submit"
                        disabled={!isOkayEnabled}
                    >
                        요약하기
                    </SummarizeButton>
                </Buttons>
            </DraftForm>
            {isSummarizing && (
                <Modal>
                    <img src={Loading} alt="loading img"/>
                    <p>Joing이 요약하는 중이예요...</p>
                </Modal>
            )}
            {isSummaryClicked && (
                <>
                    <SummaryPage>
                        <img src={ArrowDown} alt="arrow down"/>
                        <Summary>
                            <SumTitle>{isFeedback ? 'Feedback' : summaryData.title}</SumTitle>
                            <SumSubTitle>{isFeedback ? '' : 'Summary'}</SumSubTitle>
                            <SumContent>{isFeedback ? feedbackData : summaryData.content}</SumContent>
                            {!isFeedback && (
                                summaryData.keywords.length > 0 && (
                                    <>
                                        <SumSubTitle>Keywords</SumSubTitle>
                                        <SumKeywords>
                                            {summaryData.keywords.map((keyword, index) => (
                                                <Keyword key={index}>{keyword}</Keyword>
                                            ))}
                                        </SumKeywords>
                                    </>
                                )
                            )}
                        </Summary>
                        {!isFeedback ? (
                            <Buttons>
                                <ReSumButton
                                    type="button"
                                    onClick={() => handleReSummary(id)}
                                >
                                    요약 재생성
                                </ReSumButton>
                                <MatchingButton
                                    onClick={() => navigate(`/recommendation/creator?itemId=${id}`)}
                                >
                                    크리에이터 매칭하기
                                </MatchingButton>
                            </Buttons>
                        ) : (
                            <Buttons>
                                <CancelButton
                                    type="button"
                                    onClick={openModal}
                                >
                                    취소
                                </CancelButton>
                                <ReWriteButton
                                    onClick={handleReWriteClick}
                                >
                                    기획안 수정하기
                                </ReWriteButton>
                            </Buttons>
                        )}
                    </SummaryPage>
                </>
            )}
        </Layout>
    )
}

export default DraftPlan;

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 18px;
    font-family: 'SUITE-Bold', serif;
    z-index: 1000;

    p{
        font-size: 1rem;
        color: white;
    }

    @media (max-width: 768px) {
        p{
            font-size: 0.9rem;
        }
    }

    @media (max-width: 480px) {
        p{
            font-size: 0.8rem;
        }
    }
`;

const Title = styled.h2`
    font-family: 'Paperlogy-6Bold', serif;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0;

    @media (max-width: 768px) {
        font-size: 1.7rem;
    }

    @media (max-width: 480px) {
        font-size: 1.5rem;
    }
`;

const SubTitle = styled.p`
    font-family: 'SUITE-Regular', serif;
    font-size: 14px;
    margin: 5px 0 30px 0;
`;

const DraftForm = styled.form`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
`;

const Container = styled.div`
    display: flex;
    gap: 30px;
    flex-grow: 1;
    height: calc(100vh - 200px);
    overflow: hidden;

    @media (max-width: 768px) {
        flex-direction: column;
        height: auto;
        gap: 20px;
        overflow: auto;
    }
`;

const LeftBox = styled.div`
    flex: 2;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    padding-right: 10px;

    @media (max-width: 768px) {
        flex: none;
        width: 100%;
        padding-right: 0;
        height: auto;
        overflow-y: hidden;
        padding-bottom: 3rem;
    }
`;

const RightBox = styled.div`
    flex: 1;
    overflow-y: auto;
    padding-right: 10px;

    @media (max-width: 768px) {
        flex: none;
        width: 100%;
        padding-right: 0;
    }
`;

const Label = styled.label`
    font-family: 'SUITE-Bold', serif;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 4px;
    margin-top: 0;
    color: #333;
`;

const TitleForm = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 25px;
`;

const TitleInputField = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 17px;
    margin-top: 3px;
    transition: border-color 0.3s;
    font-family: 'SUITE-Regular', serif;

    &:focus {
        border-color: #666;
        outline: none;
    }
`;

const ContentForm = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const ReactQuillWrapper = styled(ReactQuill)`
    height: auto;

    .ql-container {
        min-height: 280px;
    }

    .ql-editor {
        min-height: 280px;
    }

    @media (max-width: 768px) {
        .ql-container {
            min-height: 200px;
        }

        .ql-editor {
            min-height: 200px;
        }
    }
`;

const CategoryForm = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
`;

const TypeForm = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
`;

const MiscForm = styled.div`
    display: flex;
    flex-grow: 1;
    flex-direction: column;
`;

const Notice = styled.div`
    display: flex;
    align-items: center;
    font-size: 10px;
    color: #777;
    margin-bottom: 5px;

    img {
        width: 14px;
        height: 14px;
        margin-right: 4px;
    }
`;

const InputField = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    margin-top: 3px;
    transition: border-color 0.3s;
    font-family: 'SUITE-Regular', serif;
    flex-grow: 1;
    min-width: 50px;

    &:focus {
        border-color: #666;
        outline: none;
    }
`;

const RemoveButton = styled.button`
    color: #ff5d5d;
    padding: 10px;
    background-color: #f3f3f3;

    &:hover {
        border-color: #ff5d5d;
    }

    &:focus {
        outline: none;
    }
`;

const AddButton = styled.button`
    flex: 1;
    font-size: 14px;
    background-color: #f3f3f3;

    &:hover {
        border-color: #c6c6c6;
    }

    &:focus {
        outline: none;
    }
`;

const Buttons = styled.div`
    display: flex;
    justify-content: center;
    margin: 50px 0;
    gap: 10px;

    @media (max-width: 768px) {
        gap: 8px;
    }

    @media (max-width: 480px) {
        margin: 20px 0;
    }
`;

const CancelButton = styled.button`
    font-family: 'SUITE-Bold', serif;
    padding: 6px 15px;
    width: 150px;
    height: 40px;
    background-color: white;
    border: 1px solid #000000;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #e0e0e0;
        border: 1px solid #000000;
    }

    &:focus {
        outline: none;
    }
`;

const SummarizeButton = styled.button`
    font-family: 'SUITE-Bold', serif;
    padding: 6px 15px;
    width: 150px;
    height: 40px;
    background-color: ${({disabled}) => (disabled ? '#cccccc' : '#000000')};
    border: none;
    border-radius: 10px;
    color: white;
    transition: background-color 0.3s;
    cursor: ${({disabled}) => (disabled ? 'not-allowed' : 'pointer')};

    &:hover {
        background-color: ${({disabled}) => (disabled ? '#cccccc' : '#3e3e3e')};
        border: none;
    }

    &:focus {
        outline: none;
    }
`;

const ReWriteButton = styled.button`
    font-family: 'SUITE-Bold', serif;
    padding: 6px 15px;
    width: 200px;
    height: 40px;
    background-color: black;
    border: none;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #3e3e3e;
        border: none;
    }

    &:focus {
        outline: none;
    }

    @media (max-width: 768px) {
        width: 170px;
        font-size: 0.9rem;
    }

    @media (max-width: 480px) {
        width: 150px;
        font-size: 0.8rem;
    }
`;

const SummaryPage = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    overflow: hidden;

    img {
        width: 64px;
        height: auto;
    }
`;

const Summary = styled.div`
    margin: 100px 0 30px 0;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: calc(100% - 200px);

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const SumTitle = styled.h2`
    align-self: flex-start;
    font-family: 'GongGothicMedium', serif;
    font-size: 1.5rem;
    font-weight: bold;

    @media (max-width: 768px) {
        font-size: 1.3rem;
    }

    @media (max-width: 768px) {
        font-size: 1.1rem;
    }
`;

const SumSubTitle = styled.h3`
    align-self: flex-start;
    font-family: 'SUITE-Bold', serif;
    font-size: 1.1rem;
    color: #2c2c2c;

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

const SumContent = styled.p`
    font-family: 'SUITE-Regular', serif;
    font-size: 1rem;
    line-height: 1.5;
    color: #333;

    @media (max-width: 768px) {
        font-size: 0.9rem;
    }
`;

const SumKeywords = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 8px;
`;

const Keyword = styled.span`
    padding: 6px 10px;
    border-radius: 10px;
    background-color: #f3f3f3;
    font-size: 0.9rem;
    font-family: 'SUITE-Regular', serif;
    white-space: nowrap;

    @media (max-width: 768px) {
        font-size: 0.8rem;
    }
`;

const ReSumButton = styled.button`
    font-family: 'SUITE-Bold', serif;
    padding: 6px 15px;
    width: 200px;
    height: 40px;
    background-color: white;
    border: 1px solid #000000;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #e0e0e0;
        border: 1px solid #000000;
    }

    &:focus {
        outline: none;
    }

    @media (max-width: 768px) {
        width: 170px;
        font-size: 0.9rem;
    }

    @media (max-width: 480px) {
        width: 150px;
        font-size: 0.8rem;
    }
`;

const MatchingButton = styled.button`
    font-family: 'SUITE-Bold', serif;
    padding: 6px 15px;
    width: 200px;
    height: 40px;
    background-color: ${({disabled}) => (disabled ? '#cccccc' : '#000000')};
    border: none;
    border-radius: 10px;
    color: white;
    transition: background-color 0.3s;
    cursor: ${({disabled}) => (disabled ? 'not-allowed' : 'pointer')};

    &:hover {
        background-color: ${({disabled}) => (disabled ? '#cccccc' : '#3e3e3e')};
        border: none;
    }

    &:focus {
        outline: none;
    }

    @media (max-width: 768px) {
        width: 170px;
        font-size: 0.9rem;
    }

    @media (max-width: 480px) {
        width: 150px;
        font-size: 0.8rem;
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

    @media (max-width: 768px) {
        h2 {
            font-size: 1.3rem;
        }

        img {
            width: 35px;
        }    
    }

    @media (max-width: 480px) {
        h2 {
            font-size: 1.1rem;
        }

        img {
            width: 30px;
        } 
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    gap: 10px;
`;

const ExitButton = styled.button`
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

const ContinueButton = styled.button`
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
