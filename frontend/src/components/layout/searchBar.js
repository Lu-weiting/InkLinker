/* eslint-disable no-unused-vars */
import styled from 'styled-components';
import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedTitle } from "../../redux/SearchControl";


const Container = styled.div`
    display: flex;
`;
const Bar = styled.div`
    display: flex;
    align-items: center;
    border-radius: 1.25rem;
    border: none;
    background-color: #F5F5F5;
    padding: 0.5rem 0.75rem;
    font-size: 1.25rem;
    color: black;
    font-family: 'Vollkorn', serif;
    width: 100%;
    max-width: 15rem;

    &:focus {
        outline: none;
    }
`;
const Input = styled.input`
    border: none;
    background-color:  #F2F2F2;
    align-items: center;
    width: 90%;

    &:focus {
        outline: none;
    }

`;


export default function SearchBar() {
    const [keyword, setKeyword] = useState("");
    const dispatch = useDispatch();

    const debounceTimeout = 300; // 300 毫秒

    const isMounted = useRef(false);

    useEffect(() => {
        if (isMounted.current) {
            // 使用 setTimeout 計時器來實現 debounce
            const timerId = setTimeout(() => {
                dispatch(setSelectedTitle(keyword));
            }, debounceTimeout);

            // 在每次 useEffect 被重新調用時，清除之前的計時器
            return () => {
                clearTimeout(timerId);
            };
        } else {
            // Update the ref to indicate the component has been mounted
        }
    }, [keyword]);

    const handleChange = (e) => {
        const keyword = e.target.value;
        setKeyword(keyword);
        isMounted.current = true;
    };


    return (
        <Container>
            <Bar>
                <Input
                    type="text"
                    placeholder="Search"
                    onChange={(e) => handleChange(e)}
                />
                <i className="fa fa-search "></i>
            </Bar>
        </Container>

    );
}