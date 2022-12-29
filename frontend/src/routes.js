import React from "react"
import { BrowserRouter, Routes as Router, Route } from 'react-router-dom'

//pages
import Entry from "./pages/Entry"


function Routes() {
    return (
        <BrowserRouter>
            <Router>
                <Route path="/" element={<Entry />} />
            </Router>
        </BrowserRouter>
    )
}

export default Routes