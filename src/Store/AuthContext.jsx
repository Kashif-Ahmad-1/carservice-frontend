import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the token exists in local storage and fetch user details (role)
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token or make API call to get user details
      const userRole = localStorage.getItem('role'); // For simplicity, assume role is stored
      setUser({ token, role: userRole });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
