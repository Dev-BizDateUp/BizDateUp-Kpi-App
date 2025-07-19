import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import logo from "../../assets/Login/logo.png";
import { GoogleLogin } from '@react-oauth/google';
import { google_login } from "../../Api/Endpoints/endpoints";
import { jwtDecode } from 'jwt-decode';
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext, GetterContext } from "../Context/NewContext";
import { useNavigate } from 'react-router-dom';
const Login = ({ onLogin, isAuthenticated }) => {
  const navigate = useNavigate();
  const change = ()=>{
  navigate("/fake")
  }
  const { userData } = useContext(AuthContext)
  const { employees } = useContext(GetterContext)
  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email Required"),
      password: Yup.string().min(6, "Min 6 characters").required("Password Required")
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post("/login/email", values);
        // console.log("Login success:", response.data);
        // const token = await google_login(response.data.credential);
        // console.log(`google log in with server: token : ${token}`);
        // Redirect or store token here
      } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
      } finally {
        setSubmitting(false);
      }
    }
  });

  function SignOut() {
    localStorage.removeItem('bizToken');
    location.reload();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full xl:w-xl form-shadow flex flex-col">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" />
        </div>

        {/* Form */}
        <h1 className="blue-color mb-5 text-3xl font-semibold text-left">Login</h1>
        {
          userData != null &&
          <>
            <span className="text-center text-xl">Hello, {employees.find(e => e.id == userData.id)?.name}!</span>
            <div className="flex flex-row justify-center items-center">
              <span className="text-center text-md m-1 text-green-500">{userData.id}</span>
              <span className="text-center text-md">{userData.email}</span>
            </div>
          </>

        }
        {
          !userData &&
          <>
            <form className="space-y-4 mb-3" onSubmit={formik.handleSubmit}>
              <div>
                <label className="block text-lg mb-2 blue-color font-bold">Enter Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.email}</div>
                )}
              </div>

              <div>
                <label className="block text-lg mb-2 blue-color font-bold">Enter Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.password}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="btn cursor-pointer"
              >
                {formik.isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          
            <GoogleLogin
              shape="pill"
              onSuccess={async credentialResponse => {
                // console.log(credentialResponse);
                try {
                  const { result, error } = await google_login(credentialResponse.credential);
                  if (result) {
                    console.log("Logged in succesfully with token ", result);
                    onLogin(result.token, jwtDecode(result.token));
                  } else {
                    console.log("Could not log in :", error)
                  }
                } catch (exc) {
                  console.log("Could not login:", exc)
                }

              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </>
        }
  <button className="btn cursor-pointer mt-5 mb-5" onClick={change}>
              Login Without SignIn
            </button>
        {
          isAuthenticated &&
          <>
            <NavLink
              className='my-2 p-1 text-center w-full border-green-500 text-green-600 border-2 rounded-full'
              to={'/'}>
              Go to home page
            </NavLink>
            <button
              className="bg-red-400 text-white py-2 rounded-full hover:cursor-pointer"
              onClick={SignOut}
            >
              Sign out
            </button>
          </>

        }
      </div>
    </div>
  );
};

export default Login;
