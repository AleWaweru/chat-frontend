import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-lg mb-8">The page you are looking for does not exist.</p>
      <div>
        <Link
          className="text-white py-2 px-4 rounded bg-blue-500 hover:bg-blue-600"
          to="/"
        >
          Go to Home Page
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;

