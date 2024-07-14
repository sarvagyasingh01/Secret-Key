import axios from "axios"
import { toast } from "react-toastify"


export const registerUser = async () => {
    try {
        const response = await axios.post(`${BACKEND_URL}/api/users/register`, userData, {withCredentials: true})
        if(response.statusText === "OK"){
            toast.success("User Registered Successfully")
        }
        return response.data
    } catch (error) {
        const message = (
            error.response && error.response.data & error.response.data.message
        ) || error.message || error.toString();
        toast.error(message)
    }
}