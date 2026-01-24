"use client"

import {isAuthorized} from "@/lib/isAuthorized";
import {useEffect, useState} from "react";

export const useUser = () => {
    const [email, setEmail] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await isAuthorized();
            if (user && user.email) {
                setEmail(user.email);
            } else {
                setEmail(null);
            }
            setLoading(false);
        }
    }, []);

    return {email, loading};
}
