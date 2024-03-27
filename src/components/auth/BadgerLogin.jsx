import React from 'react';
import { Button, Form } from "react-bootstrap";
import { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerLogin() {
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    // TODO Create the login component.
    const usernameRef = useRef()
    const passwordRef = useRef();
    const navigate = useNavigate();

    function handleLoginSubmit(e) {
        e?.preventDefault();
        if(!usernameRef.current.value || !passwordRef.current.value){
            alert("You must provide both a username and password!");
        }

        fetch("https://cs571.org/api/s24/hw6/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: usernameRef.current.value.toLocaleLowerCase(),
                password: passwordRef.current.value
            })
        })
        .then(res => {
            if (res.status === 200) {
                alert("Login was successful!")
                // the user should be automatically navigated back to the home page using react-router's useNavigate hook.
                navigate("/");
                setLoginStatus(true)
                sessionStorage.setItem("loginStatus", true);
                sessionStorage.setItem("Username", usernameRef.current.value.toLocaleLowerCase())

            } else if(res.status === 401){
                alert("Invalid username/password!")
            }
        })
    }


    return <>
        <h1>Login</h1>
        <Form onSubmit={handleLoginSubmit}>
            <Form.Label htmlFor="usernameLoginInput">Username</Form.Label>
            <Form.Control id="usernameLoginInput" ref={usernameRef}></Form.Control>
            <Form.Label htmlFor="passwordLoginInput">Password</Form.Label>
            <Form.Control id="passwordLoginInput" type="password" placeholder="Password" ref={passwordRef}></Form.Control>
            <br />
            <Button type="submit" onClick={handleLoginSubmit}>Login</Button>
        </Form>
    </>
}
