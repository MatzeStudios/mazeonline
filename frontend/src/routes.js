import React from "react"
import { BrowserRouter, Routes as Router, Route } from 'react-router-dom'
import {io} from "socket.io-client"

//pages
import Entry from "./pages/Entry"
import Game from "./pages/Game"

const ENDPOINT = "http://10.244.151.77:9000"

const socket = io(ENDPOINT, {
    withCredentials: true,
    extraHeaders: {
        "my-custom-header": "abcd"
    }
});

function Routes() {
    return (
        <BrowserRouter>
            <Router>
                <Route path="/" element={<Entry socket={socket} />} />
                <Route path="/game" element={<Game socket={socket} />} />
            </Router>
        </BrowserRouter>
    )
}

export default Routes