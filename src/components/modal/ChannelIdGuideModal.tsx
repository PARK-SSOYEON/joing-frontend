import React from "react";
import Modal from "./Modal";
import styled from "styled-components";
import iconCross from "../../assets/icons/icon_cross.png";
import ChannelIdGuide_1 from "../../assets/channelId-1.jpg";
import ChannelIdGuide_2 from "../../assets/channelId-2.jpg";

interface ChannelGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChannelGuideModal: React.FC<ChannelGuideModalProps> = ({isOpen, onClose}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Header>
                <Title>ChannelID Guide</Title>
                <Cross src={iconCross} alt="Cross Icon" onClick={onClose}/>
            </Header>
            <Content>
                <Paragraph>
                    1. youtube에 접속해 본인 계정으로 로그인합니다 <br/>
                    2. 우측 상단 프로필 이미지를 누른 후 '설정' 탭에 들어갑니다<br/>
                    <img src={ChannelIdGuide_1} alt="guide-1"/><br/>
                    3. 좌측 하단 '고급 설정' 탭에서 채널 ID를 복사합니다<br/>
                    <img src={ChannelIdGuide_2} alt="guide-2"/><br/>
                </Paragraph>
            </Content>
        </Modal>
    );
};

export default ChannelGuideModal;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const Title = styled.h2`
    margin: 0;
    font-size: 1.25rem;
`;

const Cross = styled.img`
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
    width: 24px;
    height: 24px;
`;

const Content = styled.div`
    font-size: 1rem;
    line-height: 1.5;
`;

const Paragraph = styled.p`
    line-height: 2;

    img {
        width: 100%;
        height: auto;
        max-width: 100%;
    }
`;
