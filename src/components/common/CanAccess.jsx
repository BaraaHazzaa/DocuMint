import { useAuth } from '../../context/AuthContext';

/**
 * A component that renders its children only if the current user's role
 * is included in the allowed roles.
 *
 * @param {object} props
 * @param {string[]} props.allowedRoles - An array of roles that are allowed to see the content.
 * @param {React.ReactNode} props.children - The content to render if the user has permission.
 */
const CanAccess = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default CanAccess;
