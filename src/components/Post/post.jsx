import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { API_URL } from "../../db/api";
import { usePostContext } from "../../context/PostContext";

const Post = ({ showModal, handleClose }) => {
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const { addPost, setPosts } = usePostContext();

  useEffect(() => {
    if (showError) {
      const errorTimeout = setTimeout(() => {
        setShowError(false);
        setError("");
      }, 3000);

      return () => clearTimeout(errorTimeout);
    }
  }, [showError]);

  const handlePost = async () => {
    if (!author || !category || !content) {
      setError("Todos os campos são obrigatórios");
      setShowError(true);
      return;
    }

    const formData = new FormData();
    formData.append("author", author);
    formData.append("category", category);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await API_URL.post("/api/post", formData);
      // Adicionar a nova postagem ao contexto
      addPost(response.data);
      // Fechar a modal
      handleClose();
    } catch (error) {
      console.error("Erro ao criar postagem:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileSizeInMB = selectedFile.size / (1024 * 1024);
      if (fileSizeInMB > 2) {
        setError("A imagem deve ter no máximo 2MB");
        setShowError(true);
        return;
      }
    }
    setImage(selectedFile);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await API_URL.get("/api/get");
        // Atualizar a lista de posts no contexto
        setPosts(response.data);
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      }
    };

    // Chamar a função fetchPosts ao montar o componente
    fetchPosts();

    // Atualizar a lista de posts a cada intervalo de tempo (por exemplo, a cada 5 segundos)
    const intervalId = setInterval(fetchPosts, 500);

    // Limpar o intervalo ao desmontar o componente
    return () => clearInterval(intervalId);
  }, [setPosts]);

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Criar Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showError && <p style={{ color: "red" }}>{error}</p>}
        <Form>
          <Form.Group controlId="author">
            <Form.Label>Autor do Post</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite seu nome"
              onChange={(e) => setAuthor(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="category">
            <Form.Label>Selecione a Categoria</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="Post">Post</option>
              <option value="Artigo">Artigo</option>
              <option value="Grupo">Grupo</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="content">
            <Form.Label>Escrever Publicação</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Digite sua publicação aqui..."
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="image">
            <Form.Label>Inserir Imagem</Form.Label>
            <Form.Control type="file" accept=".jpg, .png" onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fechar
        </Button>
        <Button variant="primary" onClick={handlePost}>
          Publicar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Post;
