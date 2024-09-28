import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import classNames from 'classnames/bind';
import { Outlet } from "react-router-dom";
import styles from "./AdminDefaultLayout.module.scss"
const cx = classNames.bind(styles);

function AdminDefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Navigation />
            <Sidebar/>
            <div className={cx('container')}>

                {children}
                <Outlet />
            </div>
        </div>
    );
}

export default AdminDefaultLayout;