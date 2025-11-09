import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectPermissions } from '../state/authSlice.js';
import { getFirstAccessiblePath } from '../utils/permissionUtils.js';

/**
 * DefaultRedirect - Redirects to the first accessible path based on user permissions
 * Used as the default route after login
 */
const DefaultRedirect = () => {
    const permissions = useSelector(selectPermissions);
    const firstPath = getFirstAccessiblePath(permissions);

    return <Navigate to={firstPath} replace />;
};

export default DefaultRedirect;
