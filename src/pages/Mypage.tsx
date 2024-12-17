import styled from "styled-components";
import Layout from "../components/layout/Layout.tsx";
import Tabs from "../components/tab/Tabs.tsx";
import TabPanel from "../components/tab/TabPanel.tsx";
import TabProfileDetail from "../components/tab/TabProfileDetail.tsx";
import TabRecordDetail from "../components/tab/TabRecordDetail.tsx";
import React, {useEffect, useState} from "react";
import {
    getCreatorInfo,
    getProductManagerInfo,
    patchCreatorInfo,
    patchProductManagerInfo
} from "../services/userService.ts";
import {useUser} from "../contexts/UserContext.tsx";
import {Role} from "../constants/roles.ts";
import {CategorySelector, MultiCategorySelector} from "../components/elements/CategorySelector.tsx";
import ProfileEditModal from '../components/modal/Modal.tsx';
import MediaTypeSelector from "../components/elements/MediaTypeSelector.tsx";
import NoticeIcon from "../assets/icons/icon_notice.png";

export interface ProfileInfo {
    nickname: string;
    email: string;
    profileImage: string;
    channelId: string;
    channelUrl: string;
    mediaType: string;
    category: string;
    favoriteCategories: string[];
}

const defaultProfileInfo: ProfileInfo = {
    nickname: "",
    email: "",
    profileImage: "",
    channelId: "",
    channelUrl: "",
    mediaType: "",
    category: "",
    favoriteCategories: [],
};

const Mypage = () => {
    const [profileInfo, setProfileInfo] = useState<ProfileInfo>(defaultProfileInfo);
    const [loading, setLoading] = useState<boolean>(true);
    const {role} = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nickname, setNickname] = useState(profileInfo.nickname);
    const [selectedCategory, setSelectedCategory] = useState<string>(profileInfo.category);
    const [selectedType, setSelectedType] = useState<string>(profileInfo.mediaType);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(profileInfo.favoriteCategories);

    const openModal = () => {
        setNickname(profileInfo.nickname);
        setSelectedCategory(profileInfo.category);
        setSelectedType(profileInfo.mediaType);
        setSelectedCategories(profileInfo.favoriteCategories || []);
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false);
    }

    const fetchProfileInfo = async () => {
        try {
            setLoading(true);
            let data;

            if (role === "CREATOR") {
                data = await getCreatorInfo();
                setProfileInfo({
                    ...defaultProfileInfo,
                    nickname: data.nickname,
                    email: data.email,
                    profileImage: data.profileImage,
                    channelId: data.channelId,
                    channelUrl: data.channelUrl,
                    mediaType: data.mediaType,
                    category: data.category,
                });
            } else {
                data = await getProductManagerInfo();
                setProfileInfo({
                    ...defaultProfileInfo,
                    nickname: data.nickname,
                    email: data.email,
                    profileImage: data.profileImage,
                    favoriteCategories: data.favoriteCategories,
                });
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileInfo();
    }, [role]);

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
    };

    if (loading) return <p>Loading...</p>;

    const handleSubmit = async () => {
        const dataToPatch: Partial<ProfileInfo> = {};

        if (role === Role.CREATOR) {
            if (nickname !== profileInfo.nickname) dataToPatch.nickname = nickname;
            if (selectedType !== profileInfo.mediaType) dataToPatch.mediaType = selectedType;
            if (selectedCategory !== profileInfo.category) dataToPatch.category = selectedCategory;

            if (Object.keys(dataToPatch).length > 0) {
                const response = await patchCreatorInfo(dataToPatch);
                if (response.success) {
                    setProfileInfo((prev) => ({
                        ...prev,
                        ...response.data,
                    }));
                    setIsModalOpen(false);
                } else {
                    alert('Failed');
                }
            } else {
                alert("수정된 내용이 없습니다.");
                setIsModalOpen(false);
            }
        } else if (role === Role.PRODUCT_MANAGER) {
            if (nickname !== profileInfo.nickname) dataToPatch.nickname = nickname;
            if (JSON.stringify(selectedCategories) !== JSON.stringify(profileInfo.favoriteCategories)) {
                dataToPatch.favoriteCategories = selectedCategories;
            }

            if (Object.keys(dataToPatch).length > 0) {
                const response = await patchProductManagerInfo(dataToPatch);
                if (response.success) {
                    setProfileInfo((prev) => ({
                        ...prev,
                        ...response.data,
                    }));
                    setIsModalOpen(false);
                } else {
                    alert('Failed');
                }
            } else {
                alert("수정된 내용이 없습니다.");
                setIsModalOpen(false);
            }
        }
    };

    const updateEmail = async (newEmail: string) => {
        if (newEmail === profileInfo.email) {
            alert("수정된 내용이 없습니다.");
            setIsModalOpen(false);
            return;
        }

        const dataToPatch: Partial<ProfileInfo> = { email: newEmail };

        try {
            const response =
                role === Role.CREATOR
                    ? await patchCreatorInfo(dataToPatch)
                    : await patchProductManagerInfo(dataToPatch);

            if (response.success) {
                setProfileInfo((prev) => ({
                    ...prev,
                    ...response.data,
                }));
                setIsModalOpen(false);
            } else {
                alert('Failed');
            }
        } catch (_error) {
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    const updateChannel = async (newChannelId: string, newChannelUrl: string, newProfileImage: string) => {
        if (newChannelId === profileInfo.channelId && newChannelUrl === profileInfo.channelUrl && newProfileImage === profileInfo.profileImage) {
            alert("수정된 내용이 없습니다.");
            setIsModalOpen(false);
            return;
        }

        const dataToPatch: Partial<ProfileInfo> = {
            channelId: newChannelId,
            channelUrl: newChannelUrl,
            profileImage: newProfileImage
        };

        try {
            const response = await patchCreatorInfo(dataToPatch);

            if (response.success) {
                setProfileInfo((prev) => ({
                    ...prev,
                    ...response.data,
                }));
                setIsModalOpen(false);
            } else {
                alert("Failed");
            }
        } catch (_error) {
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <Layout>
            <Container>
                <HeaderComponent>
                    <Profile>
                        <ProfileImg src={profileInfo?.profileImage} alt={`${profileInfo?.nickname}'s profile`}/>
                        <ProfileDetail>
                            <Name>{profileInfo?.nickname}</Name>
                            {role === Role.CREATOR ? (
                                <>
                                    <ChannelType>Creator</ChannelType>
                                    <Hashtags>
                                        <Hashtag>
                                            #{profileInfo.mediaType}
                                        </Hashtag>
                                        <Hashtag>
                                            #{profileInfo.category}
                                        </Hashtag>
                                    </Hashtags>
                                </>
                            ) : (
                                <>
                                    <RoleType>Product Manager</RoleType>
                                    <Hashtags>
                                        {profileInfo.favoriteCategories.map((category) => (
                                            <Hashtag>
                                                #{category}
                                            </Hashtag>
                                        ))}
                                    </Hashtags>
                                </>
                            )}
                        </ProfileDetail>
                    </Profile>
                    <EditButton type="button" onClick={openModal}>Edit</EditButton>
                    <ProfileEditModal isOpen={isModalOpen} onClose={closeModal}>
                        <InputForm>
                            <Label>Nickname</Label>
                            <InputField
                                placeholder="Enter your new Nickname"
                                value={nickname}
                                onChange={handleNicknameChange}
                            />
                            {role === "CREATOR" &&
                                <Notice>
                                    <img src={NoticeIcon} alt="Notice Icon"/>
                                    채널 이름과 동일하게 설정하시는걸 추천드려요
                                </Notice>
                            }
                        </InputForm>
                        {role === "CREATOR" && (
                            <>
                                <InputForm>
                                    <Label>Media Type</Label>
                                    <MediaTypeSelector selectedType={selectedType} setSelectedType={setSelectedType}
                                                       readOnly={false}/>
                                </InputForm>
                                <InputForm>
                                    <Label>Channel Category</Label>
                                    <CategorySelector
                                        selectedCategory={selectedCategory}
                                        setSelectedCategory={setSelectedCategory}
                                        readOnly={false}
                                    />
                                </InputForm>
                            </>
                        )}
                        {role === "PRODUCT_MANAGER" && (
                            <>
                                <InputForm>
                                    <Label>선호 카테고리</Label>
                                    <MultiCategorySelector
                                        selectedCategories={selectedCategories}
                                        setSelectedCategories={setSelectedCategories}
                                        readOnly={false}
                                    />
                                </InputForm>
                            </>
                        )}
                        <ButtonContainer>
                            <ExitButton onClick={closeModal}>cancel</ExitButton>
                            <SendButton onClick={handleSubmit}>확인</SendButton>
                        </ButtonContainer>
                    </ProfileEditModal>
                </HeaderComponent>
                <Tabs>
                    <TabPanel label="Profile">
                        <TabProfileDetail role={role} profileInfo={profileInfo} onEmailUpdate={updateEmail} onChannelUpdate={updateChannel}/>
                    </TabPanel>
                    <TabPanel label="Record">
                        <TabRecordDetail/>
                    </TabPanel>
                </Tabs>
            </Container>
        </Layout>
    );
};

export default Mypage;

const Container = styled.div`
    width: 85%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
`;

const HeaderComponent = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 2rem;
    width: 100%;
`;

const Profile = styled.div`
    width: 100%;
    height: 150px;
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
    gap: 2rem;
`;

const ProfileImg = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: gray;
`;

const ProfileDetail = styled.div``;

const Name = styled.h2`
    font-family: 'GongGothicMedium', serif;
    margin-bottom: 0;
`;

const ChannelType = styled.p`
    font-family: 'SUITE-Bold', serif;
    font-size: 0.9rem;
    margin-top: 0;
`;

const RoleType = styled.p`
    font-family: "SUITE-Bold", serif;
    font-size: 0.9rem;
    margin-top: 0;
    margin-bottom: 0.5rem;
`;

const Hashtags = styled.div`
    display: flex;
    gap: 1rem;
`;

const Hashtag = styled.p``;

const EditButton = styled.button`
    font-family: 'SUITE-Bold', serif;
    font-size: 0.8rem;
    padding: 0.4rem 1rem;
    background-color: #f3f3f3;
    border-radius: 10px;
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
