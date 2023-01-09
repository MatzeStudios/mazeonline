
import {io} from "socket.io-client"

const ENDPOINT = "http://192.168.0.100:9000"

const socket = io(ENDPOINT, {
    withCredentials: true,
    extraHeaders: {
        "my-custom-header": "abcd"
    }
})

export default socket