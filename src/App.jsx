import './App.css'
import LoginPage from "./components/LoginPage.jsx";
import MainScreen from "./components/MainScreen.jsx";
import {useSelector} from "react-redux";

function App() {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <>
            {!isAuthenticated && <LoginPage/>}
            {isAuthenticated && <MainScreen/>}
        </>
    )
}

export default App
