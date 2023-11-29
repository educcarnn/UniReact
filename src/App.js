
import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header/header";
import Post from "./components/Post/post";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Feed from "./components/Feed/feed";
import { PostProvider } from "./context/PostContext";

function App() {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <PostProvider>
      <div className="App">
        <Header />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "8px",
            alignItems: "center",
          }}
        >
          <Button
            variant="primary"
            style={{
              backgroundColor: "#0085FC",
              color: "white",
              padding: "8px",
              width: "16vh",
              borderRadius: "8px",
            }}
            onClick={handleShowModal}
          >
            Criar Post
          </Button>
        </div>

        <Post showModal={showModal} handleClose={handleCloseModal} />
        <Feed />
      </div>
    </PostProvider>
  );
}

export default App;
