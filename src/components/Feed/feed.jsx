import React, { useEffect, useState } from "react";
import { Card, Button, Dropdown } from "react-bootstrap";
import { API_URL } from "../../db/api";
import { usePostContext } from "../../context/PostContext";
import avatar from "../../assets/avatar.png";
import "./feed.css";

const Feed = () => {
  const [expandedPosts, setExpandedPosts] = useState([]);
  const { posts, deletePost, editPost, setPosts } = usePostContext();
  const [reloadFeed, setReloadFeed] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await API_URL.get("/api/get");
        setPosts(response?.data);
        console.log(posts);
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      }
    };

    fetchPosts();
  }, [reloadFeed, setPosts]);

  useEffect(() => {
    // Este useEffect será acionado sempre que a lista de posts for atualizada no contexto
    console.log("Lista de posts atualizada:", posts);
  }, [posts]);

  const handleExpandPost = (postId) => {
    setExpandedPosts((prevExpanded) => [...prevExpanded, postId]);
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm("Deseja realmente deletar este post?");
    if (confirmDelete) {
      try {
        await API_URL.delete(`/api/${postId}`);
        deletePost(postId);
        setReloadFeed((prev) => !prev); // Força uma recarga do feed
      } catch (error) {
        console.error("Erro ao deletar post:", error);
      }
    }
  };

  const handleEditPost = async (postId, content) => {
    const editedContent = prompt("Edite o conteúdo do post:", content);
    if (editedContent !== null) {
      try {
        await API_URL.patch(`/api/${postId}`, { content: editedContent });
        editPost(postId, {
          ...posts.find((post) => post.id === postId),
          content: editedContent,
        });
        setReloadFeed((prev) => !prev); // Força uma recarga do feed
      } catch (error) {
        console.error("Erro ao editar post:", error);
      }
    }
  };

  return (
    <div className="block">
      {posts?.map((post) => (
        <Card key={post?.id} className="mb-3" style={{ width: "70%" }}>
          <Card.Header className="card-header">
            <div className="">
              <img src={avatar} alt="Avatar" className="avatar" />
              <div className="card-avatar">
                <span>{post.author} </span>
                <span>Publicado em 12 de setembro às 14:30 </span>
                  {console.log(post.image)}
                <img src={`http://localhost:8000/storage/${post?.image}`} alt="" height={500} width={500} />
              </div>
            </div>

            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Opções
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => handleEditPost(post.id, post.content)}
                >
                  Editar
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleDeletePost(post.id)}>
                  Deletar
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Card.Header>
          <Card.Body>
            <Card.Text>
              {expandedPosts?.includes(post.id)
                ? post?.content
                : post?.content?.length > 500
                ? `${post?.content?.slice(0, 500)}...`
                : post?.content}
            </Card.Text>
            {post?.content?.length > 500 &&
              !expandedPosts?.includes(post.id) && (
                <Button
                  variant="link"
                  onClick={() => handleExpandPost(post.id)}
                >
                  Leia mais...
                </Button>
              )}
          </Card.Body>
          {/*
             {post?.image?.length > 0 && !expandedPosts.includes(post.id) && (
            <div>
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={`${API_URL.defaults.baseURL}/images/${image}`}
                  alt={`Imagem ${index}`}
                  style={{ maxWidth: "100%", marginBottom: "10px" }}
                />
              ))}
            </div>
          )}
          */}
        
        </Card>
      ))}
    </div>
  );
};

export default Feed;
