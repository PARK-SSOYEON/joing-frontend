import Header from "./Header.tsx";
import styled from 'styled-components';
import AuthModal from "../modal/AuthModal.tsx";
import React, {useCallback, useState} from "react";

const Layout = (props: {
    children: React.ReactNode
}) => {
    const [isOpenModal, setOpenModal] = useState<boolean>(false);

    const handleLoginClick = useCallback(() => {
        setOpenModal(!isOpenModal);
    }, [isOpenModal]);

    const handleClose = useCallback(() => {
        setOpenModal(false);
    }, []);

    return (
        <>
            <Header onLoginClick={handleLoginClick}/>
            <Main>
                {props.children}
            </Main>
            {isOpenModal && (
                <AuthModal handleClose={handleClose}/>
            )}
        </>
    )
}

export default Layout;

const Main = styled.main`
    width: 70%;
    height: calc(100vh - 60px);
    margin: 60px auto 0 auto;
`;
