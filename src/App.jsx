import './App.css'
import LoginPage from "./components/LoginPage.jsx";
import MainScreen from "./components/MainScreen.jsx";
import {useDispatch, useSelector} from "react-redux";
import {use, useEffect} from "react";
import {
    loadUserFromStorage,
    introspectUser
} from "./state/authSlice.js";

function App() {
    const dispatch = useDispatch();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const accessToken = useSelector(state => state.auth.accessToken);

    useEffect(() => {
        if (!isAuthenticated) {
            dispatch(loadUserFromStorage());
        }
    }, [])

    useEffect(()=>{
        if (accessToken) {
            dispatch(introspectUser(accessToken));
        }

    }, [accessToken])

    return (
        <>
            {!isAuthenticated && <LoginPage/>}
            {isAuthenticated && <MainScreen/>}
        </>
    )
}

export default App
