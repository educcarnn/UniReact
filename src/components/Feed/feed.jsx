import React, { useEffect, useState } from "react";
import { Card, Button, Dropdown, Badge, Modal, Form } from "react-bootstrap";
import { API_URL } from "../../db/api";
import { usePostContext } from "../../context/PostContext";
import avatar from "../../assets/avatar.png";
import "./feed.css";
import { formatarData } from "../../utils/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faUsers,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import DeletePostModal from "./DeletePost/deletePost";
import EditPostForm from "./EditPost/editPost";

const Feed = () => {
  const [expandedPosts, setExpandedPosts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedPost, setEditedPost] = useState(null);
  const { posts, deletePost, editPost, setPosts } = usePostContext();
  const [reloadFeed, setReloadFeed] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

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

  const handleDeletePost = (postId) => {
    setPostIdToDelete(postId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (postIdToDelete) {
        await API_URL.delete(`/api/${postIdToDelete}`);
        deletePost(postIdToDelete);
        setReloadFeed((prev) => !prev); // Força uma recarga do feed
      }
    } catch (error) {
      console.error("Erro ao deletar post:", error);
    } finally {
      setShowDeleteModal(false);
      setPostIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPostIdToDelete(null);
  };

  const handleEditPost = (post) => {
    setEditedPost(post);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditedPost(null);
  };

  const handleSaveEdit = async (editedPost) => {
    try {
      // Faça a chamada para editar o post no backend
      await API_URL.patch(`/api/${editedPost.id}`, {
        author: editedPost.author,
        category: editedPost.category,
        content: editedPost.content,
      });
  
      // Atualize o contexto com a postagem editada
      editPost(editedPost.id, editedPost);
  
      // Feche o modal de edição
      setShowEditModal(false);
  
      // Força uma recarga do feed
      setReloadFeed((prev) => !prev);
    } catch (error) {
      console.error("Erro ao editar post:", error);
    }
  };

  return (
    <div className="block">
      {posts?.map((post) => (
        <Card key={post?.id} className="mb-3" style={{ width: "70%" }}>
          <div className="itens">
            <Card.Header className="card-header">
              <div className="item-header">
                <img src={avatar} alt="Avatar" className="avatar" />
                <div className="card-avatar">
                  <span>{post.author} </span>
                  {post.created_at && (
                    <span>Publicado em {formatarData(post.created_at)}</span>
                  )}
                  {post.category && (
                    <Badge variant="primary">
                      {post.category === "Post" && (
                        <FontAwesomeIcon icon={faUsers} />
                      )}
                      {post.category === "Artigo" && (
                        <FontAwesomeIcon icon={faFileAlt} />
                      )}
                      {post.category === "Grupo" && (
                        <FontAwesomeIcon icon={faNewspaper} />
                      )}
                      {post.category}
                    </Badge>
                  )}
                </div>
              </div>
            </Card.Header>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Opções
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleEditPost(post)}>
                  Editar
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleDeletePost(post.id)}>
                  Deletar
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <Card.Body className="body">
            <img
              src={`http://localhost:8000/storage/${post?.image}`}
              alt={post?.category}
              style={{ width: "20%", height: "20%" }}
            />
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
        </Card>
      ))}
      
      {editedPost && (
       <EditPostForm
       show={showEditModal}
       onHide={handleCloseEditModal}
       onSave={handleSaveEdit}
       post={editedPost}
     />
      )}

      <DeletePostModal
        show={showDeleteModal}
        onHide={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Feed;
