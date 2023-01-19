import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

interface LoadingProps {
  show: boolean
}

function Loading(props:LoadingProps) {
    // const [show, setShow] = useState(false);

    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);

  return (
    <>
    <Modal show={props.show} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Button variant="primary" disabled>
            <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            />
            <span className="visually-hidden">Loading...</span>
        </Button>{' '}
        <Button variant="primary" disabled>
            <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
            />
            Loading...
        </Button>
        </Modal.Body>
      </Modal>

      
    </>
  );
}

export default Loading;