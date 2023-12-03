import React, { useEffect, useState } from "react";
import { Card, Button, Dropdown, Badge, Modal, Form } from "react-bootstrap";
import { API_URL } from "../../db/api";
import { usePostContext } from "../../context/PostContext";
import avatar from "../../assets/avatar.png";
import "./feed.css";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faUsers, faNewspaper } from "@fortawesome/free-solid-svg-icons";

const Feed = () => {
  const [expandedPosts, setExpandedPosts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedPost, setEditedPost] = useState(null);
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

  const handleEditPost = (post) => {
    setEditedPost(post);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditedPost(null);
  };

  const handleSaveEdit = async () => {
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

  const formatarData = (data) => {
    try {
      // Tenta fazer o parse da data
      const dataParseada = parseISO(data);
      // Formata a data
      return format(dataParseada, "dd 'de' MMMM 'às' HH:mm", { locale: pt });
    } catch (error) {
      // Se houver um erro ao fazer o parse, retorna a data original
      return data;
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

      {/* Modal de Edição */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editTitle">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={editedPost?.author}
                onChange={(e) =>
                  setEditedPost((prev) => ({
                    ...prev,
                    author: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group controlId="editCategory">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                as="select"
                value={editedPost?.category}
                onChange={(e) =>
                  setEditedPost((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              >
                <option value="Post">Post</option>
                <option value="Artigo">Artigo</option>
                <option value="Grupo">Grupo</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="editContent">
              <Form.Label>Conteúdo</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editedPost?.content}
                onChange={(e) =>
                  setEditedPost((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Salvar Edições
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Feed;
