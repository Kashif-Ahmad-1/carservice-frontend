import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './../src/Store/AuthContext';

const PrivateRoute = ({ element: Component, roles, ...rest }) => {
  const { user } = useContext(AuthContext); // Get user and role info from context
  const role = localStorage.getItem("role");
  console.log(role);
  console.log(role=== "admin")
  console.log(roles)
  if (!role) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" />;
  }
//  console.log(roles.(role))
  if (roles && !roles.includes(role)) {
    // If the user role is not allowed for the route, redirect to unauthorized page or homepage
    return <Navigate to="/" />;
  }

  // If authenticated and has proper role, render the component
  return <Component {...rest} />;
};

export default PrivateRoute;
