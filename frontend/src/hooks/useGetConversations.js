import { useEffect, useState } from "react"
import toast from "react-hot-toast";

const useGetConversations = () => {
    const [loading , setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);

    useEffect(()=> {
        const getConversation = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/v1/users" , {
                    method : "GET",
                    headers : {
                        "Content-Type" : "application/json"
                    }
                })
                const data = await res.json();
                if(data.statusCode === 500){
                    throw new Error(data.message);
                }
                setConversations(data.data);
                
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }
        getConversation();
    } , []);

    return {loading , conversations};
}

export default useGetConversations