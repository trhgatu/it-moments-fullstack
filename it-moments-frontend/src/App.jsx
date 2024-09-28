// App.jsx
import { Routes, Route } from 'react-router-dom';
import './output.css';
import Home from './pages/Home';
import About from './pages/About';
import Error from './pages/Error';
import Posts from './pages/Posts';
import PostAll from './pages/Posts/PostAll';
import PostsNew from './pages/Posts/PostsNew';
import { DefaultLayout } from './components/Layouts';
import PostDetail from './pages/Posts/PostDetail';
import InfoUser from './pages/InfoUser';
import Login from './pages/Authentication/Login';
import PrivateRoutes from "./components/PrivateRoutes";
import Register from './pages/Authentication/Register';
import AllRoute from './components/AllRoute';


function App() {
    return (
        <>
            <AllRoute />
        </>
    );
}

export default App;
