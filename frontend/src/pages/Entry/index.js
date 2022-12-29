import React from "react"

// styles
import './index.css'

function Entry() {
    return (
        <div className="page">
            <div className="container-title">
                <h1 className="text-title">mazeonline</h1>
            </div>

            <div className="container-input-nickname">
                <p className="text-input-title">Digite seu nickname</p>
                <input className="input-nickname"></input>
                <button className="button-nickname" type="button" onClick="{}" ></button>  {/*remover aspas do onClick*/}
            </div>
            <div className="container-players-online">
                <p className="text-num-players"> {500} </p> {/*numero vai receber logica*/}
                <p className="text-players-online"> players online </p>
            </div>
        </div>
    )
}

export default Entry