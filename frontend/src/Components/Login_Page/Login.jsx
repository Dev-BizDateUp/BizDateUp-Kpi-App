import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import logo from "../../assets/Login/logo.png";
import { GoogleLogin } from '@react-oauth/google';
import { google_login } from "../../Api/Endpoints/endpoints";

const Login = () => {
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
        const response = await axios.post("https://your-api-url.com/login", values);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full xl:w-xl form-shadow">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" />
        </div>

        {/* Form */}
        <h1 className="blue-color mb-5 text-3xl font-semibold text-left">Login</h1>
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
                console.log("Logged in succesfully with token ",result);

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
      </div>
    </div>
  );
};

export default Login;
