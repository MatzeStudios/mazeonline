
import {io} from "socket.io-client"

const ENDPOINT = "http://10.244.234.230:9000"

const socket = io(ENDPOINT, {
    withCredentials: true,
    extraHeaders: {
        "my-custom-header": "abcd"
    }
})

export default socket