import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CATEGORIES } from '../constants/categories';


const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800 text-center">Browse Categories</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{CATEGORIES.map((category) => (
            <div key={category} className="group">

              <button
                onClick={() => handleCategoryClick(category)}
                className="w-full p-8 bg-linear-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:from-indigo-600 hover:to-purple-700 transform hover:-translate-y-2 transition-all duration-300 text-left"
              >
                <h3 className="text-2xl font-bold mb-3">{category}</h3>
                <p className="text-indigo-100 opacity-90">View all posts in this category</p>
              </button>
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <a href="/posts" className="text-indigo-600 hover:text-indigo-800 text-lg font-medium">
            ← Back to All Posts
          </a>
        </div>
      </div>
    </>
  );
};

export default Categories;



