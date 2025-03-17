import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ApiFinder from "../apis/ApiFinder";

const Protected = (props: any) => {
    const navigate = useNavigate()
    const { Component } = props

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await ApiFinder.get('/auth/check');
                if (!response.data.user) {
                    navigate('/', { replace: true });
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                navigate('/', { replace: true });
            }
        };

        checkAuth();
    }, [navigate]);

    return (
        <Component />
    )
}

export default Protected;