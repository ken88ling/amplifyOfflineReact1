import React, { useEffect, useState } from "react";
import { withAuthenticator } from '@aws-amplify/ui-react';
import { DataStore } from "@aws-amplify/datastore";
import { Post, PostStatus } from "./models";
import Amplify from '@aws-amplify/core'
import config from './aws-exports';
Amplify.configure(config);

Amplify.Logger.LOG_LEVEL = 'DEBUG'


function App({ signOut, user }) {

    const [form, updateForm] = useState({ title: '', rating: '' });
    const [posts, setPosts] = useState([]);

    function getPosts() {
        DataStore.query(Post).then(result => {
            setPosts(result);
        });
    }

    useEffect(() => {
        getPosts();
    }, []);

    async function create() {
        const postData = {...form, status: PostStatus.INACTIVE}
        await DataStore.save(
            new Post(postData)
        );
        updateForm({ title: '', rating: '' })
        getPosts()
    }


    return (
        <div className="App">
            <div style={{ display : 'flex',justifyContent: 'space-between'}}>
                <h1>Hello {user.username}</h1>
                <button style={{ height : '25px'}} onClick={signOut}>Sign out</button>
            </div>
            <hr/>
            <input
                value={form.title}
                placeholder="title"
                onChange={e => updateForm({ ...form, 'title': e.target.value })}
            />
            <input
                value={form.rating}
                placeholder="rating"
                onChange={e => updateForm({ ...form, 'rating': parseInt(e.target.value) })}
            />
            <button onClick={create}>Create Post</button>
            <hr/>
            <div>
                {posts.map((item, index)=> {
                    return(
                        <div style={{border: '1px solid red'}}>
                            <div>Item Id : {item.id}</div>
                            <div>Title : {item.title}</div>
                            <div>Rating : {item.rating}</div></div>
                    )
                })}
            </div>
        </div>
    );
}

export default withAuthenticator(App);
