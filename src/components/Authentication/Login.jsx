import React, { useState } from "react";
import HeroCar from "./../../images/hero/main-car.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import styles from './Login.module.css'; // Import CSS Module

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.loginMain}>
      <div className={styles.loginLeft}>
        <img src={HeroCar} alt="Hero Car" />
      </div>
      <div className={styles.loginRight}>
        <div className={styles.loginRightContainer}>
          <div className={styles.loginLogo}>
            {/* <img src={Logo} alt="Logo" /> */}
          </div>
          <div className={styles.loginCenter}>
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            <form>
              <input type="email" placeholder="Email" />
              <div className={styles.passInputDiv}>
                <input className="input-style" type={showPassword ? "text" : "password"} placeholder="Password" />
                {showPassword ? 
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} /> : 
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                }
              </div>
              {/* <div className={styles.loginCenterOptions}>
                <div className={styles.rememberDiv}>
                  <input className="input-style" type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">
                    Remember for 30 days
                  </label>
                </div>
                <a href="#" className={styles.forgotPassLink}>
                  Forgot password?
                </a>
              </div> */}
              <div className={styles.loginCenterButtons}>
                <button className='login-button' type="button">Log In</button>
                {/* <button type="button">
                 
                  Log In with Google
                </button> */}
              </div>
            </form>
          </div>
          <p className={styles.loginBottomP}>
            Don't have an account? <a href="#">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
