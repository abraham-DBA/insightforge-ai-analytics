import {useEffect, useState} from "react";

export const useUser = () => {
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("/api/auth/me");
            const user = res.ok ? await res.json() : null;
            if (user && user.email) {
                setEmail(user.email);
            } else {
                setEmail(null);
            }
            setLoading(false);
        }
        fetchUser();
    }, []);

    return {email, loading};
}