import React from 'react';
import "./InitLoader.css";
import Container from 'react-bootstrap/esm/Container';

const InitLoader = () => {
    return (
        <>
            <Container className="d-flex align-items-center justify-content-center h-100vh">
                <div className="initLoader">
                    <span className="fs-2 fw-semibold text-gradient">Zoro</span>
                    <div className="ring"></div>
                </div>
            </Container>
        </>
    )
}

export default InitLoader;