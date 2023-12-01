import React, { createContext, useState, useContext } from "react";
const PostContext = createContext();

const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]); // Lista de posts

  const addPost = (post) => {
    setPosts([...posts, post]);
  };

  const editPost = (postId, updatedPost) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId ? updatedPost : post
    );
    setPosts(updatedPosts);
  };

  const deletePost = (postId) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
  };

  return (
    <PostContext.Provider value={{ posts, addPost, editPost, deletePost, setPosts }}>
      {children}
    </PostContext.Provider>
  );
};

const usePostContext = () => {
  return useContext(PostContext);
};

export { PostProvider, usePostContext, PostContext };