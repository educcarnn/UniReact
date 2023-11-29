import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const Post = ({ showModal, handleClose }) => {
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (showError) {
      const errorTimeout = setTimeout(() => {
        setShowError(false);
        setError("");
      }, 3000);

      return () => clearTimeout(errorTimeout);
    }
  }, [showError]);

  const handlePost = () => {
    // Realizar validações
    if (!author || !category || !content) {
      setError("Todos os campos são obrigatórios");
      setShowError(true);
      return;
    }

    // Enviar os dados para a API
    // ...

    // Fechar a modal
    handleClose();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Realizar validações do arquivo se necessário
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
