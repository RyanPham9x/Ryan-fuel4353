import { createContext, useState, useEffect, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({ children }) => {

    let [user, setUser] = useState(() => (sessionStorage.getItem('authTokens') ? jwtDecode(sessionStorage.getItem('authTokens')) : null))
    let [authTokens, setAuthTokens] = useState(() => (sessionStorage.getItem('authTokens') ? JSON.parse(sessionStorage.getItem('authTokens')) : null))
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate()


    let loginUser = async (e) => {
        e.preventDefault()
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: e.target.username.value, password: e.target.password.value })
        });

        let data = await response.json();

        if (response.ok) {
            sessionStorage.setItem('authTokens', JSON.stringify(data));
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            setTimeout(() => navigate('/'), 900);
            toast.success("Logged in successfully"); // Display success message
        } else {
            const errorMessage = data.detail || "Something went wrong while logging in the user!";
            toast.error(errorMessage); // Display error message
        }
    };

    const logoutUser = useCallback((e) => {
        //e.preventDefault()
        sessionStorage.removeItem('authTokens')
        setAuthTokens(null)
        setUser(null)
        setTimeout(() => navigate('/login'), 450);
        toast.dismiss();
    }, [navigate]);

    const updateToken = useCallback(async () => {
        if (window.location.pathname === '/register' || window.location.pathname === '/login') {
            console.log('No token refresh needed on this page');
            return;
        }
        const MAX_RETRIES = 10;
        let attempt = 0; // Current attempt
        let success = false; // Flag to indicate if token refresh was successful

        while (attempt < MAX_RETRIES && !success) {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refresh: authTokens?.refresh })
            });

            if (response.status === 200) {
                const data = await response.json();
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                sessionStorage.setItem('authTokens', JSON.stringify(data));
                success = true; // Update success flag
            } else {
                attempt += 1;
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
            }
        }

        if (!success) {
            // Handle the case where the token couldn't be refreshed
            console.log("Unable to refresh token after multiple attempts.");
            logoutUser();
        }

        if (loading) {
            setLoading(false);
        }
    }, [authTokens, setAuthTokens, setUser, logoutUser, loading]);


    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }

    useEffect(() => {
        let refreshTimeout;
        if (authTokens?.access) {
            const decoded = jwtDecode(authTokens.access);
            const now = Date.now().valueOf() / 1000; // Current time in seconds since epoch
            const timeUntilExpiry = (decoded.exp - now) - 30; // Refresh 30 seconds before expiry
            if (timeUntilExpiry > 0) {
                refreshTimeout = setTimeout(updateToken, timeUntilExpiry * 1000);
            } else {
                // If the token is already expired, refresh immediately
                updateToken();
            }
        }

        return () => clearTimeout(refreshTimeout);
    }, [authTokens, updateToken]);

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}