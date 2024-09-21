import React, { useState, useContext } from "react";
import HeroCar from "./../../images/hero/main-car.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import styles from './Login.module.css';
import { useNavigate } from "react-router-dom";
import AuthContext from "./../../Store/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("the data is ", data);
      if (response.ok) {
        // Use context's login function
        login(data.token, data.role);

        // Navigate based on the role
        switch (data.role) {
          case "admin":
            navigate("/admin");
            break;
          case "engineer":
            navigate("/engineerservice");
            break;
          case "accountant":
            navigate("/accountspage");
            break;
          default:
            navigate("/");
        }
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred, please try again.");
    }
  };

  return (
    <div className={styles.loginMain}>
      <div className={styles.loginLeft}>
        <img src={HeroCar} alt="Hero Car" />
      </div>
      <div className={styles.loginRight}>
        <div className={styles.loginRightContainer}>
          <div className={styles.loginLogo}></div>
          <div className={styles.loginCenter}>
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className={styles.passInputDiv}>
                <input
                  className="input-style"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>
              <div className={styles.loginCenterButtons}>
                <button className="login-button" type="submit">Log In</button>
              </div>
            </form>
          </div>
          {/* <p className={styles.loginBottomP}>
            Don't have an account? <a href="#">Sign Up</a>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
