

import { Outlet } from 'react-router-dom';
import Main from '../components/Main';
function AdminDefaultLayout() {
    return (
        <>
            <Main>
                <Outlet />
            </Main>
        </>
    );
}

export default AdminDefaultLayout;
