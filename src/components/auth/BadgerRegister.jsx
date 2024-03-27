import React from 'react';
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

export default function BadgerRegister() {

    // TODO Create the register component.
    // in controlled way => useState
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");

    function handleRegisterSubmit(e) {
        e?.preventDefault();  // prevents default form submit action
        // Case 1: User does not enter a user name or a password
        // ! either one is true means empty input
        if(!username || !password || !repassword){
            alert("You must provide both a username and password!")
            return;
        }
        // Case 2: Password does not match
        if(password !== repassword){
            alert("Your passwords do not match!");
            return;
        }

        fetch("https://cs571.org/api/s24/hw6/register", {
            method:"POST",
            credentials: "include",
            headers:{
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username.toLocaleLowerCase(),
                password: password
            })
        })
        .then(res =>{
            if(res.status === 200){
                alert("Congrats! Registration was successful.")
            }else if(res.status === 409){
                alert("That username has already been taken!")
            }
        })
    }



    return <>
        <h1>Register</h1>
        <Form onSubmit={handleRegisterSubmit}>
            <Form.Label htmlFor="usernameRegisterInput">Username</Form.Label>
            <Form.Control id="usernameRegisterInput" onChange={(e) => setUsername(e.target.value)} ></Form.Control>
            <Form.Label htmlFor="passwordRegisterInput">Password</Form.Label>
            <Form.Control id="passwordRegisterInput" type="password" onChange={(e) => setPassword(e.target.value)}></Form.Control>
            <Form.Label htmlFor="repasswordRegisterInput">Repeat Password</Form.Label>
            <Form.Control id="repasswordRegisterInput" type="password"  onChange={(e) => setRepassword(e.target.value)}></Form.Control>
            <br/>
            <Button type="submit" onClick={handleRegisterSubmit}>Register</Button>
        </Form>
    </>

}
