import React, { useEffect, useState, useContext, useRef } from "react"
import { Row, Col, Pagination, Form, Button } from "react-bootstrap";
import BadgerMessage from "./BadgerMessage";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerChatroom(props) {

    const [messages, setMessages] = useState([]);
    const [activePage, setActivePage] = useState(1)
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    // message is already the data with specific page...
    const loadMessages = () => {
        fetch(`https://cs571.org/api/s24/hw6/messages?chatroom=${props.name}&page=${activePage}`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages)
        })
    };


    // Why can't we just say []?
    // The BadgerChatroom doesn't unload/reload when switching
    // chatrooms, only its props change! Try it yourself.

    // if [], then the messages are not change only the title changes
    // but what in the props??
    useEffect(loadMessages, [props, activePage]);

    const titleRef = useRef()
    const contentRef = useRef()

    function canCreatePost() {
        if (!loginStatus) {
            //If the user is not yet authenticated, display a message that says "You must be logged in to post!" 
            return <p>You must be logged in to post!</p>
        } else {
            // Otherwise, the user should be able to make a post through a form with a post title, post content, and a create post button.
            return <Form onSubmit={handlePostSubmit} >
                <Form.Label htmlFor="titleInput">Post Title</Form.Label>
                <Form.Control id="titleInput" ref={titleRef}></Form.Control>
                <Form.Label htmlFor="contentInput">Post Content</Form.Label>
                <Form.Control id="contentInput" ref={contentRef}></Form.Control>
                <br />
                <Button type="submit" onSubmit={handlePostSubmit}>Create Post</Button>
            </Form>
        }
    }

    function handlePostSubmit(e){
        e?.preventDefault();
        // If the user does not enter a title or content, display an alert saying "You must provide both a title and content!"
        if(!titleRef.current.value || !contentRef.current.value){
            alert("You must provide both a title and content!")
        }

        fetch(`https://cs571.org/api/s24/hw6/messages?chatroom=${props.name}`, {
            method: "POST",
            //Don't forget the fetch option to include credentials!
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: titleRef.current.value,
                content: contentRef.current.value
            })
        })
        .then(res => {
            if (res.status === 200) {
                //After performing the API call you should alert the user that they have "Successfully posted!" 
                alert("Successfully posted!")
                //you should reload the latest messages.
                loadMessages();
            } 
        })
    }

    function handleDelete(id){
        fetch(`https://cs571.org/api/s24/hw6/messages?id=${id}`, {
            method: "DELETE",
            //Don't forget the fetch option to include credentials!
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
            }
        })
        .then(res => {
            if (res.status === 200) {
                //After performing the API call you should alert the user that they have "Successfully posted!" 
                alert("Successfully deleted the post!")
                //you should reload the latest messages.
                loadMessages();
            } 
        })
    
    }


    return <>
        <h1>{props.name} Chatroom</h1>
        {
            /* TODO: Allow an authenticated user to create a post. */
            canCreatePost()
        }
        <hr />
        {
            messages.length > 0 ?
                <>
                    {
                        <Row>
                            {messages.map((mess) => (
                                <Col xs={12} sm={12} md={6} lg={4} xl={3} key={mess.id}>
                                    <BadgerMessage {...mess} handleDelete={handleDelete} />
                                </Col>
                            ))}
                        </Row>
                    }
                </>
                :
                <>
                    <p>There are no messages on this page yet!</p>
                </>
        }
        <Pagination>
            <Pagination.Item active={activePage == 1} onClick={() => setActivePage(1)}>1</Pagination.Item>
            <Pagination.Item active={activePage == 2} onClick={() => setActivePage(2)}>2</Pagination.Item>
            <Pagination.Item active={activePage == 3} onClick={() => setActivePage(3)}>3</Pagination.Item>
            <Pagination.Item active={activePage == 4} onClick={() => setActivePage(4)}>4</Pagination.Item>
        </Pagination>
    </>
}
