import React from "react";
import { Link} from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const Registration = () => {
 
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required("username is required"),
    password: Yup.string().min(4).max(20).required("password is required"),
  });

  const handleSubmit = (data) => {
    axios.post("http://localhost:3001/auth", data).then(()=>{
        console.log(data)
    })

  }

  return (
    <div className="flex justify-center w-[100%] mx-auto items-center py-[8rem]">
      <div className="bg-gray-100 p-4 rounded w-[40%] shadow-md">
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          <Form className="w-full mx-auto max-w-md">
            <h2 className="text-2xl text-center font-bold mb-2">Register</h2>
            <div className="mb-4 w-full">
              <label htmlFor="username" className="block text-gray-700">
                Username
              </label>
              <ErrorMessage
                className="text-red-500"
                name="username"
                component="span"
              />
              <Field
                placeholder="username..."
                autoComplete="off"
                type="text"
                id="username"
                name="username"
                className="border-2 border-gray-300 p-2 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <ErrorMessage
                className="text-red-500"
                name="password"
                component="span"
              />
              <Field
                placeholder="password..."
                autoComplete="off"
                type="password"
                id="password"
                name="password"
                className="border-2 border-gray-300 p-2 rounded-md w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              SIGN UP
            </button>
            <div>
              Already have an account?
              <Link className="underline hover:text-blue-400" to="/login">
                login
              </Link>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Registration;
