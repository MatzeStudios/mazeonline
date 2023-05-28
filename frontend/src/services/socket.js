
import {io} from 'socket.io-client'

const socket = io(process.env.ENDPOINT, {
    withCredentials: true,
    extraHeaders: {
        'my-custom-header': 'abcd'
    }
})

export default socket