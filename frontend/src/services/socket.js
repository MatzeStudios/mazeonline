
import {io} from 'socket.io-client'

const ENDPOINT = 'localhost:9000'

const socket = io(ENDPOINT, {
    withCredentials: true,
    extraHeaders: {
        'my-custom-header': 'abcd'
    }
})

export default socket