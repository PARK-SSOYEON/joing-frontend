import React, {useState} from 'react';
import styled, {css, keyframes} from "styled-components";
import KakaoIcon from "../../assets/icons/icon_kakao.png";
import EmailIcon from "../../assets/icons/icon_email.png";
import PlayIcon from "../../assets/icons/icon_playbutton.png";
import {ProfileInfo} from "../../pages/Mypage.tsx";
import {Role} from "../../constants/roles.ts";
import EmailEditModal from '../../components/modal/Modal.tsx';
import ChannelEditModal from '../../components/modal/Modal.tsx';
import emailDomains from "../../data/emailDomains.ts";
import NoticeIcon from "../../assets/icons/icon_notice.png";
import {profileEvaluation} from "../../services/userService.ts";
import ChannelIdGuideModal from "../modal/ChannelIdGuideModal.tsx";

interface TabProfileDetailProps {
    role: Role | null;
    profileInfo: ProfileInfo;
    onEmailUpdate: (newEmail: string) => void;
    onChannelUpdate: (channelId: string, channelUrl: string) => void;
}

const TabProfileDetail: React.FC<TabProfileDetailProps> = ({role, profileInfo, onEmailUpdate, onChannelUpdate}) => {
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
    const [emailPrefix, setEmailPrefix] = useState('');
    const [emailDomain, setEmailDomain] = useState(emailDomains[0]);
    const [customDomain, setCustomDomain] = useState('');
    const [fullEmail, setFullEmail] = useState(profileInfo.email);
    const [isVerifyEnabled, setIsVerifyEnabled] = useState(true);
    const [channelID, setChannelID] = useState('');
    const [channelLink, setChannelLink] = useState('');
    const [isEditable, setIsEditable] = useState(true);
    const [isEvaluationLoading, setIsEvaluationLoading] = useState(false);
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isEvaluationDisabled = !channelID || channelID === profileInfo.channelId || !isEditable || isEvaluationLoading;
    const openGuideModal = () => setIsGuideModalOpen(true);
    const closeGuideModal = () => setIsGuideModalOpen(false);
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const openEmailEditModal = () => {
        const [prefix, domain] = profileInfo.email.split('@');
        setEmailPrefix(prefix || '');
        setEmailDomain(domain || emailDomains[0]);
        setCustomDomain(domain && !emailDomains.includes(domain) ? domain : '');
        setIsEmailModalOpen(true);
    }

    const closeEmailEditModal = () => {
        setIsEmailModalOpen(false);
    }

    const openChannelEditModal = () => {
        setChannelID(profileInfo.channelId);
        setChannelLink(profileInfo.channelUrl);
        setIsChannelModalOpen(true)
    }

    const closeChannelEditModal = () => {
        setIsChannelModalOpen(false);
    }

    const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDomain = e.target.value;
        if (selectedDomain !== '직접 입력') {
            setCustomDomain('');
        }
        setEmailDomain(selectedDomain);
        updateFullEmail(emailPrefix, selectedDomain === '직접 입력' ? customDomain : selectedDomain);
    };

    const handleEmailPrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const prefix = e.target.value;
        setEmailPrefix(prefix);
        updateFullEmail(prefix, emailDomain === '직접 입력' ? customDomain : emailDomain);
    };

    const handleCustomDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const domain = e.target.value;
        setCustomDomain(domain);
        updateFullEmail(emailPrefix, domain);
    };

    const updateFullEmail = (prefix: string, domain: string) => {
        const combinedEmail = `${prefix}@${domain}`;
        setFullEmail(combinedEmail);

        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (pattern.test(combinedEmail)) {
            setIsVerifyEnabled(true);
        } else {
            setIsVerifyEnabled(false);
        }
    };

    const handleEmailConfirm = () => {
        onEmailUpdate(fullEmail);
        closeEmailEditModal();
    };

    const handleChannelIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChannelID(e.target.value);
    }

    const handleChannelLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChannelLink(e.target.value);
    };

    const handleChannelConfirm = () => {
        onChannelUpdate(channelID, channelLink);
        closeChannelEditModal();
    }

    const handleEvaluation = async () => {
        if (!channelID) return;
        setIsEvaluationLoading(true);

        try {
            const response = await profileEvaluation(channelID);

            if (response.evaluation_status) {
                alert('채널 평가에 성공했습니다. 수정이 불가능합니다.');
                setIsEditable(false);
            } else {
                alert(`채널 평가에 통과하지 못했습니다. 이유는 다음과 같습니다: ${response.reason || '다시 시도해주세요.'}`);
            }
        } catch (_error) {
            alert(`에러가 발생했습니다. 다시 시도해주세요.'}`);
        }
        setIsEvaluationLoading(false);
    };

    return (
        <ProfileDetail>
            <AccountBox>
                <AccountImg>
                    <img src={KakaoIcon} alt="kakao icon"/>
                </AccountImg>
                <InfoContainer>
                    <Title1>Kakao 계정으로 로그인 중이에요</Title1>
                </InfoContainer>
            </AccountBox>
            <AccountBox>
                <AccountImg>
                    <img src={EmailIcon} alt="email icon"/>
                </AccountImg>
                <InfoContainer>
                    <Title1>Contact Email</Title1>
                    <Title2>{profileInfo.email}</Title2>
                </InfoContainer>
                <EditButton type="button" onClick={openEmailEditModal}>Edit</EditButton>
                <EmailEditModal isOpen={isEmailModalOpen} onClose={closeEmailEditModal}>
                    <InputForm>
                        <Label>Email</Label>
                        <EmailContainer>
                            <InputField
                                placeholder="Enter your new Email"
                                value={emailPrefix}
                                onChange={handleEmailPrefixChange}
                            />
                            <EmailSeparator>@</EmailSeparator>
                            {emailDomain === '직접 입력' ? (
                                <InputField
                                    type="text"
                                    value={customDomain}
                                    onChange={handleCustomDomainChange}
                                    placeholder="입력하세요."
                                />
                            ) : (
                                <ComboBox
                                    value={emailDomain}
                                    onChange={handleDomainChange}
                                >
                                    {emailDomains.map((domain) => (
                                        <option key={domain} value={domain}>
                                            {domain}
                                        </option>
                                    ))}
                                </ComboBox>
                            )}
                        </EmailContainer>
                        <Notice>
                            <img src={NoticeIcon} alt="Notice Icon"/>
                            상대와 연락할 때 사용할 이메일을 입력해주세요
                        </Notice>
                    </InputForm>
                    <ButtonContainer>
                        <ExitButton onClick={closeEmailEditModal}>cancel</ExitButton>
                        <SendButton onClick={handleEmailConfirm} disabled={!isVerifyEnabled}>확인</SendButton>
                    </ButtonContainer>
                </EmailEditModal>
            </AccountBox>
            {role === Role.CREATOR && (
                <>
                    <CreatorAccountBoxHeader>
                        <Title>{profileInfo.nickname}'s Channel</Title>
                        <Detail>Connect your YouTube link</Detail>
                    </CreatorAccountBoxHeader>
                    <AccountBox>
                        <AccountImg>
                            <img src={PlayIcon} alt="Play icon"/>
                        </AccountImg>
                        <InfoContainer>
                            <Title1>Youtube</Title1>
                            <Title2>{profileInfo.channelId || "No channel ID available"}</Title2>
                        </InfoContainer>
                        <a href={profileInfo.channelUrl || "#"} target="_blank" rel="noopener noreferrer">
                            <VisitButton>Visit</VisitButton>
                        </a>
                        <EditButton type="button" onClick={openChannelEditModal}>Edit</EditButton>
                        <ChannelEditModal isOpen={isChannelModalOpen} onClose={closeChannelEditModal}>
                            <InputForm>
                                <Label>Chennel ID / Link</Label>
                                <EvaluationForm>
                                    <InputField
                                        placeholder="Enter your Channel ID"
                                        value={channelID}
                                        onChange={handleChannelIDChange}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                    <TipIcon
                                        src={NoticeIcon}
                                        alt="Notice Icon"
                                        isFocused={isFocused}
                                        onClick={openGuideModal}
                                    />
                                    <EvaluationButton
                                        type="button"
                                        disabled={isEvaluationDisabled}
                                        onClick={handleEvaluation}
                                    >
                                        평가
                                    </EvaluationButton>
                                </EvaluationForm>
                                <InputField
                                    placeholder="Enter your Channel URL"
                                    value={channelLink}
                                    onChange={handleChannelLinkChange}
                                />
                                <Notice>
                                    <img src={NoticeIcon} alt="Notice Icon"/>
                                    유튜브 채널 아이디 및 링크를 입력해주세요
                                </Notice>
                            </InputForm>
                            <ButtonContainer>
                                <ExitButton onClick={closeChannelEditModal}>cancel</ExitButton>
                                <SendButton
                                    onClick={handleChannelConfirm}
                                    disabled={channelID !== profileInfo.channelId && isEditable}>확인</SendButton>
                            </ButtonContainer>
                        </ChannelEditModal>
                        <ChannelIdGuideModal isOpen={isGuideModalOpen} onClose={closeGuideModal}/>
                    </AccountBox>
                </>
            )}
            <WithdrawButton>회원탈퇴</WithdrawButton>
        </ProfileDetail>
    )
};

export default TabProfileDetail;

const ProfileDetail = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    gap: 1rem;
`;

const AccountBox = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: #ffffff;
    border-radius: 12px;
    border: #e4e4e4 solid;
`;

const AccountImg = styled.div`
    background-color: #f1f1f1;
    display: flex;
    padding: 1rem;
    margin: 0.7rem;
    border-radius: 10px;

    img {
        width: 24px;
    }
`;

const InfoContainer = styled.div`
    width: 100%;
`;

const Title1 = styled.label`
    font-family: 'SUITE-Bold', serif;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 8px;
    margin-top: 0;
    color: #333;
`;

const Title2 = styled.div`
    font-family: 'SUITE-Regular', serif;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 8px;
    margin-top: 0;
    color: #333;
`;

const EditButton = styled.button`
    font-family: 'SUITE-Bold', serif;
    font-size: 0.8rem;
    padding: 0.4rem 1rem;
    margin-right: 1rem;
    background-color: #f3f3f3;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.3s ease, background-color 0.3s ease;

    &:hover {
        background-color: #dadada;
        border: none;
        transform: scale(1.1);
    }

    &:focus {
        outline: none;
    }
`;

const VisitButton = styled.button`
    font-family: 'SUITE-Bold', serif;
    font-size: 0.8rem;
    padding: 0.4rem 1rem;
    background-color: #f3f3f3;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.3s ease, background-color 0.3s ease;

    &:hover {
        background-color: #dadada;
        border: none;
        transform: scale(1.1);
    }

    &:focus {
        outline: none;
    }
`;

const CreatorAccountBoxHeader = styled.div`
    width: 100%;
`;

const Title = styled.h2`
    font-family: 'SUITE-Bold';
    font-size: 1.3rem;
    margin-bottom: 0;
`;

const Detail = styled.p`
    font-family: 'SUITE-Regular';
    margin: 0;
`;

const WithdrawButton = styled.button`
    border: none;
    text-decoration: underline;
    background-color: transparent;
    color: #575757;
    margin-top: 2rem;

    &:hover {
        border: none;
    }

    &:focus {
        outline: none;
    }
`;

const InputForm = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
`;

const Label = styled.label`
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 4px;
    margin-top: 0;
    color: #333;
`;

const InputField = styled.input`
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    margin-top: 0.3rem;
    transition: border-color 0.3s;
    flex: 1;

    &:focus {
        border-color: #666;
        outline: none;
    }
`;

const EmailContainer = styled.div`
    display: flex;
    align-items: center;
`;

const EmailSeparator = styled.span`
    padding: 0 8px;
    font-size: 14px;
`;

const ComboBox = styled.select`
    flex: 1;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    margin-top: 3px;
    transition: border-color 0.3s;

    &:focus {
        border-color: #666;
        outline: none;
    }
`;

const Notice = styled.div`
    display: flex;
    align-items: center;
    font-size: 10px;
    color: #777;
    margin-top: 5px;

    img {
        width: 14px;
        height: 14px;
        margin-right: 4px;
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

const SendButton = styled.button`
    background-color: ${({disabled}) => (disabled ? '#b63335' : '#ff595b')};
    padding: 8px 16px;
    border: none;
    border-radius: 10px;
    cursor: ${({disabled}) => (disabled ? 'not-allowed' : 'pointer')};
    color: white;

    &:hover {
        background-color: ${({disabled}) => (disabled ? '#b63335' : '#e33e3f')};
    }

    &:focus {
        outline: none;
    }
`;

const bounce = keyframes`
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-5px);
    }
`;

const TipIcon = styled.img<{ isFocused: boolean }>`
    width: 1.5rem;
    height: auto;
    ${({isFocused}) =>
    isFocused &&
    css`
                animation: ${bounce} 0.6s infinite;
            `}
    transition: animation 0.3s;
`;

const EvaluationForm = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const EvaluationButton = styled.button`
    padding: 6px 12px;
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
`;
