import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const CreatePost = () => {
  const navigation = useNavigate();
  const { authState } = useContext(AuthContext);
  const initialValues = {
    title: "",
    postText: "",
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigation("/login");
    }
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    postText: Yup.string().required("PostTest is required"),
  });
  const handleSubmit = (data) => {
    axios
      .post("http://localhost:3001/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        navigation("/");
      });
  };

  return (
    <div className="w-full">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <Form className="bg-slate-200 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title:
            </label>
            <ErrorMessage
              className="text-red-500"
              name="title"
              component="span"
            />
            <Field
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="inputCreatePost"
              name="title"
              type="text"
              placeholder="Title..."
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Post:
            </label>
            <ErrorMessage
              className="text-red-500"
              name="postText"
              component="span"
            />
            <Field
              as="textarea"
              className="shadow appearance-none border rounded w-full  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="inputCreatePost"
              autocomplete="off"
              name="postText"
              type="text"
              placeholder="Post..."
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Create Post
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default CreatePost;
