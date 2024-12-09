import React from 'react';
import styled from 'styled-components';
import {useUser} from '../../contexts/UserContext.tsx'
import {ToggleValue} from "../../pages/Onboarding.tsx";
import {Role} from "../../constants/roles.ts";

interface ToggleProps {
    value: ToggleValue;
    onToggle: (state: ToggleValue) => void;
}

const Toggle: React.FC<ToggleProps> = ({value, onToggle}) => {
    const {role} = useUser();

    const onChangeMode = (type: ToggleValue) => {
        onToggle(type);
    };

    return (
        <Switch value={value} role={role}>
            <span/>
            {(role === Role.CREATOR || role === null) && (
                <CreBtn
                    type="button"
                    value={value}
                    onClick={() => onChangeMode(Role.CREATOR)}
                >
                    크리에이터
                </CreBtn>
            )}
            {(role === Role.PRODUCT_MANAGER || role === null) && (
                <PlanBtn
                    type="button"
                    value={value}
                    onClick={() => onChangeMode(Role.PRODUCT_MANAGER)}
                >
                    기획자
                </PlanBtn>
            )}
        </Switch>
    );
};

export default Toggle;

const Switch = styled.div<{ value: ToggleValue; role: string | null }>`
    position: relative;
    width: ${({role}) => role === null ? "340px" : "174px"};
    height: 44px;
    margin: 50px 0 30px 0;
    background-color: #ffffff;
    border-radius: 25px;
    border: 2px solid;

    ${({value}) =>
            value === Role.CREATOR ? "border-color: #FF5D5D;" : "border-color: #6cbd4f;"}
    span {
        position: absolute;
        width: 170px;
        height: 40px;
        top: 2px;
        border-radius: 25px;
        transition: transform 0.3s ease, background-color 0.3s ease;
        z-index: 1;

        ${({value}) =>
                value === Role.CREATOR ? "background-color: #FF5D5D;" : "background-color: #6cbd4f;"}

        ${({value, role}) =>
                role === null
                        ? value === Role.CREATOR
                                ? "transform: translateX(2px);"
                                : "transform: translateX(168px);"
                        : "transform: translateX(2px);"
        }
    }
`;

const Button = styled.button<{ value: ToggleValue }>`
    position: relative;
    background-color: transparent;
    width: 170px;
    height: 44px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    z-index: 2;

    &:focus {
        outline: none;
    }

    &:hover {
        border: none;
    }
`;

const CreBtn = styled(Button)`
    ${({value}) =>
            value === Role.CREATOR ? "transition:color 0.3s ease; color: #ffffff;" : null}
`;

const PlanBtn = styled(Button)`
    ${({value}) =>
            value === Role.PRODUCT_MANAGER ? "transition:color 0.3s ease; color: #ffffff;" : null}
`;
