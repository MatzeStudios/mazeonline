
import {io} from 'socket.io-client'

const socket = io(process.env.REACT_APP_ENDPOINT, {
    withCredentials: true,
    extraHeaders: {
        'mazeonline_header': 'true'
    }
})

export default socket