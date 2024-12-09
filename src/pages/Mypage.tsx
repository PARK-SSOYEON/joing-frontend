import styled from "styled-components";
import Layout from "../components/layout/Layout.tsx";
import Tabs from "../components/tab/Tabs.tsx";
import TabPanel from "../components/tab/TabPanel.tsx";
import TabProfileDetail from "../components/tab/TabProfileDetail.tsx";
import TabRecordDetail from "../components/tab/TabRecordDetail.tsx";
import {useEffect, useState} from "react";
import {getCreatorInfo, getProductManagerInfo} from "../services/userService.ts";
import {useUser} from "../contexts/UserContext.tsx";
import {Role} from "../constants/roles.ts";

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
const Mypage= () => {
    const [profileInfo, setProfileInfo] = useState<ProfileInfo>(defaultProfileInfo);
    const [loading, setLoading] = useState<boolean>(true);
    const {role} = useUser();

    useEffect(() => {
        const fetchProfileInfo = async () => {
            try {
                setLoading(true);
                let data;

                if (role === Role.CREATOR) {
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

        fetchProfileInfo();
    }, [role]);

    if (loading) return <p>Loading...</p>;

    return (
        <Layout>
            <Container>
                <HeaderComponent>
                    <Profile>
                        <ProfileImg src={profileInfo?.profileImage} alt={`${profileInfo?.nickname}'s profile`} />
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
                    <EditButton>Edit</EditButton>
                </HeaderComponent>
                <Tabs>
                    <TabPanel label="Profile">
                        <TabProfileDetail role={role} profileInfo={profileInfo} />
                    </TabPanel>
                    <TabPanel label="Record">
                        <TabRecordDetail />
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
    transition: background-color 0.3s;

    &:hover {
        background-color: #dadada;
        border: none;
    }

    &:focus {
        outline: none;
    }
`;
