import React from "react"
import { BrowserRouter, Routes as Router, Route } from 'react-router-dom'

//pages
import Entry from "./pages/Entry"
import Game from "./pages/Game"


function Routes() {
    return (
        <BrowserRouter>
            <Router>
                <Route path="/" element={<Entry />} />
                <Route path="/game" element={<Game />} />
            </Router>
        </BrowserRouter>
    )
}

export default Routes