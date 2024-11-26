import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from "../DefaultLayout/DefaultLayout.module.scss"
import classNames from 'classnames/bind';
import { Outlet } from "react-router-dom";
const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <div className={cx('content bg-gray-200')}>
                    {children}
                    <Outlet />
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default DefaultLayout;