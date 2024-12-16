import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
// @ts-ignore
import Fullpage, {FullPageSections, FullpageSection, FullpageNavigation} from '@ap.cx/react-fullpage';
import {useUser} from '../contexts/UserContext.tsx'

import Toggle from "../components/toggle/Toggle.tsx";
import Layout from "../components/layout/Layout.tsx";

import iconArrow from '../assets/icons/icon_arrow.png';
import iconMatching from '../assets/icons/icon_matching.png';
import iconContent from '../assets/icons/icon_content.png';
import iconStoryboard from '../assets/icons/icon_storyboard.png';
import iconCleanbot from '../assets/icons/icon_bot.png';
import Onbarding_Creator from '../assets/onboarding_creator.png';
import Onbarding_Productmanager from '../assets/onboarding_productmanager.png';


import '../styles/fonts.css';
import {extractAndSaveToken} from "../services/authService.ts";
import {Role} from "../constants/roles.ts";
import {useAuth} from "../contexts/AuthContext.tsx";
import AuthModal from "../components/modal/AuthModal.tsx";

export type ToggleValue = Role;

const Onboarding: React.FC = () => {
    const navigate = useNavigate();
    const {role, setRole} = useUser();
    const {setAccessToken} = useAuth();
    const [toggleValue, setIsToggled] = useState<ToggleValue>(Role.CREATOR);
    const [isOpenModal, setOpenModal] = useState<boolean>(false);

    const handleClose = useCallback(() => {
        setOpenModal(false);
    }, []);

    useEffect(() => {
        const initializeRole = async () => {
            await extractAndSaveToken();
            const storedRole = localStorage.getItem("role");
            if (storedRole === Role.CREATOR || storedRole === Role.PRODUCT_MANAGER) {
                setRole(storedRole as Role);
            }
            const token = localStorage.getItem("accessToken");
            setAccessToken(token);
        };

        initializeRole();
    }, [setRole]);

    useEffect(() => {
        if (role === Role.CREATOR || role === null) {
            setIsToggled(Role.CREATOR);
        } else if (role === Role.PRODUCT_MANAGER) {
            setIsToggled(Role.PRODUCT_MANAGER);
        }
    }, [role]);

    const handleToggleChange = (newValue: ToggleValue) => {
        setIsToggled(newValue);
    };

    return (
        <Layout>
            <Fullpage>
                <FullpageNavigation/>
                <FullPageSections>
                    <CenteredSection>
                        <Container1>
                            <LeftBox>
                                <Toggle value={toggleValue} onToggle={handleToggleChange}/>
                                <Slogan>
                                    {toggleValue === Role.CREATOR ? "크리에이터를 위한 Joing" : "기획자를 위한 Joing"}
                                </Slogan>
                                {toggleValue === Role.CREATOR ? (
                                    <Detail>
                                        나와 잘 맞는 기획을 찾고 싶은 <strong>"예비"</strong> 크리에이터<br/>
                                        콘텐츠 아이디어가 필요한 <strong>"신입"</strong> 크리에이터<br/>
                                        트렌드 기반의 새로운 콘텐츠 아이디어가 필요한 <strong>"전문"</strong> 크리에이터
                                    </Detail>
                                ) : (
                                    <Detail>
                                        나와 잘 맞는 크레이에터를 찾고 싶은 <strong>"예비"</strong> 기획자<br/>
                                        나와 잘 맞는 크리에이터와 함께 성장하고 싶은 <strong>"신입"</strong> 기획자<br/>
                                        새로운 도전을 함께할 크리에이터가 필요한 <strong>"전문"</strong> 기획자
                                    </Detail>
                                )}
                                <MainButton
                                    value={toggleValue}
                                    onClick={() => {
                                        if (role === null) {
                                            setOpenModal(true);
                                        } else {
                                            if (toggleValue === Role.PRODUCT_MANAGER) {
                                                navigate("/draftplan");
                                            } else if (toggleValue === Role.CREATOR) {
                                                navigate("/matching/draft");
                                            }
                                        }
                                    }}
                                >
                                    {toggleValue === Role.CREATOR ? (
                                        <>
                                            <span>기획안 추천받기</span>
                                            <img src={iconArrow} alt="arrow icon"/>
                                        </>
                                    ) : (
                                        <>
                                            <span>기획안 등록하고 추천받기</span>
                                            <img src={iconArrow} alt="arrow icon"/>
                                        </>
                                    )}
                                </MainButton>
                            </LeftBox>
                            {isOpenModal && (
                                <AuthModal handleClose={handleClose}/>
                            )}

                            <ImgBox>
                                {toggleValue === Role.CREATOR ? (
                                    <img src={Onbarding_Creator} alt="creator img"/>
                                ) : (
                                    <img src={Onbarding_Productmanager} alt="productmanager img"/>
                                )}
                            </ImgBox>
                        </Container1>
                    </CenteredSection>
                    <CenteredSection>
                        <Container2>
                            <Slogan><span className="highlight">AI가 제공하는 Joing만의 차별화 서비스</span></Slogan>
                            <Services>
                                <ServBox>
                                    <img src={iconMatching} alt="Matching icon"/>
                                    프로필/기획안 기반 매칭
                                </ServBox>
                                <ServBox>
                                    <img src={iconContent} alt="Content icon"/>
                                    기획안 평가/요약
                                </ServBox>
                                <ServBox>
                                    <img src={iconStoryboard} alt="Storyboard icon"/>
                                    기획안 콘티 생성
                                </ServBox>
                                <ServBox>
                                    <img src={iconCleanbot} alt="Bot icon"/>
                                    클린봇을 통한 부적격 점검
                                </ServBox>
                            </Services>
                        </Container2>
                    </CenteredSection>
                    <CenteredSection>
                        <Container3>
                            {toggleValue === Role.CREATOR ? (
                                <>
                                    <Slogan>
                                        <span className="highlight2">크리에이터를 위한 Joing만의 서비스 로드맵!</span>
                                    </Slogan>
                                    <Process>
                                        <Box>
                                            <Num>1</Num>
                                            <Title value={toggleValue}>회원가입 및 로그인</Title>
                                            <span>회원가입 시<br/> ‘크리에이터' 선택</span>
                                        </Box>
                                        <Box>
                                            <Num>2</Num>
                                            <Title value={toggleValue}>프로필 등록</Title>
                                            <span>개인 영상 플랫폼<br/> 등록</span>
                                        </Box>
                                        <Box>
                                            <Num>3</Num>
                                            <Title value={toggleValue}>기획 제안/추천받기</Title>
                                            <span>맞춤 기획안 추천과<br/> 기획자에게 직접 오는<br/> 협업 제안</span>
                                        </Box>
                                        <Box>
                                            <Num>4</Num>
                                            <Title value={toggleValue}>매칭 수락/매칭 제안</Title>
                                            <span>기획자의 제안에<br/> 수락 여부 선택 및 <br/> 추천 기획안에 <br/> 매칭 제안</span>
                                        </Box>
                                        <Box>
                                            <Num>5</Num>
                                            <Title value={toggleValue}>CONTACT</Title>
                                            <span>기획자와 협의 진행 후 컨텐츠 제작 및 업로드</span>
                                        </Box>
                                    </Process>
                                </>
                            ) : (
                                <>
                                    <Slogan>
                                        <span className="highlight2">기획자를 위한 Joing만의 서비스 로드맵!</span>
                                    </Slogan>
                                    <Process>
                                        <Box>
                                            <Num>1</Num>
                                            <Title value={toggleValue}>회원가입 및 로그인</Title>
                                            <span>회원가입 시<br/> ‘기획자' 선택</span>
                                        </Box>
                                        <Box>
                                            <Num>2</Num>
                                            <Title value={toggleValue}>기획안 작성</Title>
                                            <span>자신만의 아이디어를 담은<br/> 기획안을 작성하고<br/> AI에게 평가 받기</span>
                                        </Box>
                                        <Box>
                                            <Num>3</Num>
                                            <Title value={toggleValue}>크리에이터 추천/<br/>제안받기</Title>
                                            <span>작성된 기획서 기반<br/> 크리에이터 추천<br/> 기획안 매칭 수락 시,<br/> 다른 크리에이터의<br/> 선 제안 수신 가능</span>
                                        </Box>
                                        <Box>
                                            <Num>4</Num>
                                            <Title value={toggleValue}>매칭 제안/매칭 수락</Title>
                                            <span>크리에이터의 제안에<br/> 수락 여부 선택 및 <br/> 추천 크리에이터에 <br/> 매칭 제안</span>
                                        </Box>
                                        <Box>
                                            <Num>5</Num>
                                            <Title value={toggleValue}>CONTACT</Title>
                                            <span>매칭을 수락한<br/> 크리에이터와 협의 후<br/> 컨텐츠 제작 및 업로드</span>
                                        </Box>
                                    </Process>
                                </>
                            )}
                        </Container3>
                    </CenteredSection>
                </FullPageSections>
            </Fullpage>
        </Layout>
    )
}

export default Onboarding;

const CenteredSection = styled(FullpageSection)`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Container1 = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 70%;
`;

const LeftBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const Slogan = styled.h2`
    font-family: 'Paperlogy-6Bold', serif;
    font-size: 1.5rem;
    font-weight: bolder;
    color: black;

    .highlight {
        color: #fff;
        font-size: 1.7rem;
    }
    
    .highlight2 {
        font-size: 1.6rem;
    }
`;

const Detail = styled.p`
    margin-bottom: 3rem;
    font-family: 'SUITE-Regular', serif;
    line-height: 1.8;
    font-size: 1rem;
    
    strong {
        font-family: 'SUITE-Bold', serif;
        font-size: 1.1rem;
    }
`;

const MainButton = styled.button`
    width: 15rem;
    color: white;
    font-weight: bolder;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    transition: transform 0.3s ease, background-color 0.3s ease;
    background-color: ${({value}) => (value === Role.CREATOR ? "#FF5D5D" : "#6cbd4f")};

    img {
        width: 2rem;
        height: 2rem;
    }

    &:focus {
        outline: none;
    }

    &:hover {
        border: none;
        background-color: ${({value}) => (value === Role.CREATOR ? "#FF3D3D" : "#307718")};
        transform: scale(1.05);
    }

`;

const ImgBox = styled.div`
    width: 400px;
    height: 300px;
    display: flex;
    justify-content: center;
    
    img{
        width: auto;
        height: 100%;
        filter: drop-shadow(6px 6px 6px rgba(0, 0, 0, 0.4));

    }
`;

const Container2 = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #636363;
    width: 100%;
    height: 100vh;
`;

const Services = styled.div`
    width: 70%;
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    margin-top: 3rem;
`;

const ServBox = styled.div`
    width: 230px;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f8f8f8;
    padding: 10px;
    border-radius: 30px;
    gap: 50px;
    font-family: 'SUITE-BOld', serif;
    font-size: 1.2rem;

    img {
        width: 130px;
        height: auto;
        filter: drop-shadow(-6px 6px 1px rgba(0, 0, 0, 0.2)); /* drop-shadow 사용 */
    }
`;

const Container3 = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

const Process = styled.div`
    width: 70%;
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    margin-top: 3rem;
`;

const Box = styled.div`
    width: 20rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f8f8f8;
    padding: 10px;
    border-radius: 32px;

    span {
        text-align: center;
        padding-bottom: 20px;
    }
`;

const Num = styled.h2`
    font-size: 24px;
    font-weight: bolder;
    margin-bottom: 0;
`;

const Title = styled.h2<{ value: ToggleValue }>`
    font-family: 'Paperlogy-4Medium', serif;
    font-size: 18px;
    font-weight: bolder;
    color: ${({value}) => (value === Role.CREATOR ? "#FF5D5D" : "#6cbd4f")};
`;
