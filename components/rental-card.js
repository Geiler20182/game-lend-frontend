import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
export const apiUrl = process.env.API_BASE_URL;

export default function RentalCard({
    rentalId,
    customerId,
    gameId,
    rentalDate,
    limitDate,
    returnDate,
    price,
    onReceive,
}) {
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showReceiveModal, setShowReceiveModal] = useState(false);

    const [customer, setCustomer] = useState({});
    const [game, setGame] = useState({});

    const handleOpenModal = (message) => {
        setErrorMessage(message);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleReceive = () => {
        fetch(`${apiUrl}/api/games/${gameId}/status?status=AVAILABLE`, {
            method: "PUT",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al recibir el juego");
                }
                // Actualizar la renta con la fecha de retorno
                const currentDate = new Date().toISOString();
                const requestBody = {
                    returnDate: currentDate,
                };
                fetch(`${apiUrl}/api/rentals/${rentalId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        rentalId: rentalId,
                        rentalDate: rentalDate,
                        limitDate: limitDate,
                        returnDate: new Date().toISOString(),
                        customerId: customerId,
                        gameId: gameId,
                        rentalPrice: price,
                    }),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Error al actualizar la renta");
                        }
                        onReceive();
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        handleOpenModal("Error al actualizar la renta");
                    });
            })
            .catch((error) => {
                console.error("Error:", error);
                handleOpenModal("Error al recibir el juego");
            });

        location.reload();
    };

    const loadCustomer = () => {
        fetch(`${apiUrl}/api/customers/${customerId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener el cliente");
                }
                return response.json();
            })
            .then((data) => {
                setCustomer(data);
            })
            .catch((error) => {
                console.error("Error:", error);
                setCustomer({});
            });
    };

    const loadGame = () => {
        fetch(`${apiUrl}/api/games/${gameId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener el juego");
                }
                return response.json();
            })
            .then((data) => {
                setGame(data);
            })
            .catch((error) => {
                console.error("Error:", error);
                setGame({});
            });
    };

    useEffect(() => {
        loadCustomer();
        loadGame();
    }, []);
    
    const randomProfileImage = `/banner${Math.floor(Math.random() * 4) + 1}.jpg`;

    return (
        <>
            <div className="card mb-4 h-100">
                <div className="card-header d-flex justify-content-between align-items-center text-center">
                    <h5 className="card-title mb-0">Renta {rentalId}</h5>
                </div>
                <img
                    src={randomProfileImage}
                    className="card-img-top"
                    alt={name}
                    style={{ maxHeight: "80px", objectFit: "cover" }}
                />
                <div className="card-body">
                    <p className="card-text mb-0">
                        <strong>Cliente: </strong> {customer.name}
                    </p>
                    <p className="card-text mb-0">
                        <strong>Correo: </strong> {customer.email}
                    </p>
                    <p className="card-text mb-0">
                        <strong>Juego: </strong> {game.name}
                    </p>
                    <p className="card-text mb-0">
                        <strong>Precio: </strong> <span className="text-success">${price}</span>
                    </p>
                    <p className="card-text mb-0">
                        <strong>Fecha de renta: </strong><span className="text-primary">{rentalDate.slice(0, 10)}</span> 
                    </p>
                    <p className="card-text mb-0">
                        <strong>Fecha límite: </strong><span className="text-primary">{limitDate.slice(0, 10)}</span> 
                    </p>
                    <p className="card-text mb-0">
                        <strong>Fecha entraga: </strong> {returnDate !== null ? <span className="text-primary">{returnDate.slice(0, 10)}</span>  : "No entregado"}
                    </p>
                </div>

                <div className="card-footer text-center">
                    {returnDate === null ? (
                        <button className="btn btn-primary btn-sm" onClick={() => setShowReceiveModal(true)}>
                            Recibir Juego
                        </button>
                    ) : (
                        <button className="btn btn-warning btn-sm" disabled>
                            Juego recibido
                        </button>
                    )}
                </div>
            </div>
            <Modal isOpen={showReceiveModal} toggle={() => setShowReceiveModal(false)}>
                <ModalHeader toggle={() => setShowReceiveModal(false)}>Confirmar Recepción</ModalHeader>
                <ModalBody>¿Estás seguro de recibir el juego? Esta acción no se puede deshacer.</ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setShowReceiveModal(false)}>
                        Cancelar
                    </Button>
                    <Button color="primary" onClick={handleReceive}>
                        Confirmar
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}
