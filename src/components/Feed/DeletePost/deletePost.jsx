
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeletePostModal = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Exclusão</Modal.Title>
      </Modal.Header>
      <Modal.Body>Deseja realmente deletar este post?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Deletar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeletePostModal;
