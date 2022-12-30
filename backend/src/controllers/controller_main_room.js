const express = require('express')
const axios = require('axios')
const crypto = require("crypto")

module.exports.indexGame = (socket_io) => {

    socket_io.on('listUsers', (data) => {
        console.log(`usersActive`)
        console.log(usersActive)
        //console.log(`roomActive`)
        console.log(roomActive)
        //console.log(socket_io.adapter.rooms)
    })

    socket_io.on('joinRoom', ({ idRoom, idUser, passwordRoom }) => {
        try {
            let validate = checkJoinChat(idRoom, passwordRoom)
            if (validate) {
                usersActive.find(x => x.idRoom === idRoom).participants.push(idUser)
                usersActive.find(x => x.idRoom === idRoom).participantsSocket.push(socket_io.id)
                socket_io.join(idRoom)
                return true
            } else {
                return false
            }
        } catch (e) {
            return "Ops! Parece que essa sala não existe mais."
        }
    })
}