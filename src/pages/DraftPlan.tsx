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
import MediaTypeSelector from "../components/elements/MediaTypeSelector.tsx";

const DraftPlan: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [miscFields, setMiscFields] = useState<{ name: string; value: string }[]>([{name: '', value: ''}]);
    const [readOnly, setReadOnly] = useState(false);
    const [isSummaryClicked, setIsSummaryClicked] = useState(false);
    const [isSummarizing, setIsSummaraizing] = useState(false);
    //const [isFeedback, setIsFeedback] = useState(false);
    const isFeedback = false; //delete
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isOkayEnabled = title && content && selectedType && selectedCategory
    const quillRef = useRef<ReactQuill | null>(null);
    const navigate = useNavigate();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const handleExit = () => navigate('/');

    const saveDraftPlan = (title: string, content: string, selectedType: string, selectedCategory: string, miscFields: {
        name: string;
        value: string
    }[]) => {
        const draftPlans = JSON.parse(localStorage.getItem("draftPlans") || "[]");

        const newDraft = {
            title,
            content,
            selectedType,
            selectedCategory,
            miscFields,
        };

        draftPlans.push(newDraft);
        localStorage.setItem("draftPlans", JSON.stringify(draftPlans));
    };

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
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isOkayEnabled) {
            setIsSummaraizing(true);
            setTimeout(() => {
                setIsSummaraizing(false);
                setIsSummaryClicked(true);
            }, 2000);
            saveDraftPlan(title, content, selectedType, selectedCategory, miscFields)
        }
        setReadOnly(true);
    };

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
                <SubTitle>Fill in the details below to create your plan.</SubTitle>
                <Container>
                    <LeftBox>
                        <TitleForm>
                            <Label>Title</Label>
                            <TitleInputField
                                placeholder="Enter plan title"
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
                                placeholder="Enter plan contents"
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
                            <MediaTypeSelector selectedType={selectedType} setSelectedType={setSelectedType} readOnly={readOnly}/>
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
                        cancel
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
                            <SumTitle>{isFeedback ? 'Feedback' : title}</SumTitle>
                            <SumSubTitle>{isFeedback ? 'Feedback Content' : 'Summary'}</SumSubTitle>
                            <SumContent>{isFeedback ? 'This is a placeholder for feedback content.' : content}</SumContent>
                            {!isFeedback && (
                                <>
                                    <SumSubTitle>Keywords</SumSubTitle>
                                    <SumKeywords>
                                        <Keyword>{selectedType}</Keyword>
                                        <Keyword>{selectedCategory}</Keyword>
                                    </SumKeywords>
                                </>
                            )}
                        </Summary>
                        {!isFeedback ? (
                            <Buttons>
                                <ReSumButton
                                    type="button"
                                    //onClick={handleSubmit}
                                >
                                    요약 재생성
                                </ReSumButton>
                                <MatchingButton
                                    onClick={() => navigate("/matching/creator")}
                                >
                                    크리에이터 매칭하기
                                </MatchingButton>
                            </Buttons>
                        ) : (
                            <Buttons>
                                <CancelButton
                                    type="button"
                                    onClick={openModal}
                                    style={{width: '200px'}}
                                >
                                    cancel
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
`;

const Title = styled.h2`
    font-family: 'Paperlogy-6Bold', serif;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 0;
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
`;

const LeftBox = styled.div`
    flex: 2;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    padding-right: 10px;
`;

const RightBox = styled.div`
    flex: 1;
    overflow-y: auto;
    padding-right: 10px;
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
`;

const SummaryPage = styled.div`
    display: flex;
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
`;

const SumTitle = styled.h2`
    align-self: flex-start;
    font-family: 'GongGothicMedium', serif;
    font-size: 24px;
    font-weight: bold;
`;

const SumSubTitle = styled.h3`
    align-self: flex-start;
    font-family: 'SUITE-Bold', serif;
    font-size: 18px;
    color: #2c2c2c;
`;

const SumContent = styled.p`
    font-family: 'SUITE-Regular', serif;
    font-size: 16px;
    line-height: 1.5;
    color: #333;
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
    font-size: 13px;
    font-family: 'SUITE-Regular', serif;
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
