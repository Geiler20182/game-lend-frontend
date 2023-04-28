import React, { useState, useEffect } from "react";
export const apiUrl = process.env.API_BASE_URL;

const Resume = () => {
    const [mostFrequentCustomer, setMostFrequentCustomer] = useState({});
    const [mostRentedGame, setMostRentedGame] = useState({});
    const [salesByDate, setSalesByDate] = useState(null); // Establecer el valor inicial en null
    const [rentalData, setRentalData] = useState({
        startDate: "",
    });


    useEffect(() => {
        try {
            fetch(`${apiUrl}/api/customers/most-frequent`)
                .then((response) => response.json())
                .then((data) => setMostFrequentCustomer(data));

            fetch(`${apiUrl}/api/games/most-rented`)
                .then((response) => response.json())
                .then((data) => setMostRentedGame(data));
        } catch (error) {
            console.error("Error:", error);
        }
    }, []);

    const handleSalesByDate = (e) => {
        const date = e.target.value;
        console.log(date);
        try {
            fetch(`${apiUrl}/api/rentals/sales?date=${date}`)
                .then((response) => response.json())
                .then((data) => setSalesByDate(data));
            setRentalData((prevState) => ({ ...prevState, startDate: date }));
        } catch (error) {
            console.error("Error:", error);
        }
    };


    return (
        <div className="row">
            <div className="col-md-4">
                <div className="card mb-4">
                    <div className="card-header text-center">
                        <h1 className="text-primary display-6">Cliente más frecuente</h1>
                    </div>
                    <div className="card-body">
                        <img
                            src={"/banner7.jpg"}
                            className="card-img-top"
                            style={{ maxHeight: "130px", objectFit: "cover" }}
                        />
                        {mostFrequentCustomer.name && (
                            <>
                                <h3 className="card-title mb-2 text-secondary">{mostFrequentCustomer.name}</h3>
                                <p className="card-subtitle mb-1 text-primary">{mostFrequentCustomer.email}</p>
                                {/* <p className="mb-0">{`Veces rentado: ${mostFrequentCustomer.rentedTimes}`}</p> */}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="col-md-4">
                <div className="card mb-4">
                    <div className="card-header text-center">
                        <h1 className="text-primary display-6">Ventas por Día</h1>
                    </div>
                    <div className="card-body">
                        <img
                            src={"/banner5.jpg"}
                            className="card-img-top"
                            alt={"banner6.jpg"}
                            style={{ maxHeight: "130px", objectFit: "cover" }}
                        />
                        <div className="form-group">
                            <label htmlFor="start-date" className="form-label ">
                                <h3 className="text-secondary">Fecha</h3>
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                id="start-date"
                                value={rentalData.startDate}
                                onChange={handleSalesByDate}
                            />
                        </div>
                        {salesByDate && salesByDate.length > 0 ? (
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">ID Venta</th>
                                        <th scope="col">ID cliente</th>
                                        <th scope="col">ID Juego</th>
                                        <th scope="col">Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salesByDate.map((sale) => (
                                        <tr key={sale.rentalId}>
                                            <th scope="row" className="text-primary">
                                                {sale.rentalId}
                                            </th>
                                            <td>{sale.customerId}</td>
                                            <td>{sale.gameId}</td>
                                            <td className="text-success">{`$${sale.rentalPrice.toFixed(2)}`}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No hay ventas para la fecha seleccionada</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="col-md-4">
                <div className="card mb-4">
                    <div className="card-header text-center">
                        <h1 className="text-primary display-6">Juego más rentado</h1>
                    </div>
                    <div className="card-body">
                        <img
                            src={mostRentedGame["urlImage"]}
                            className="card-img-top"
                            alt={"banner6.jpg"}
                            style={{ maxHeight: "130px", objectFit: "cover" }}
                        />
                        {mostRentedGame.name && (
                            <>
                                <h3 className="card-title mb-2 text-secondary">{mostRentedGame.name}</h3>
                                <p className="card-subtitle mb-1 text-primary">{mostRentedGame.year}</p>
                                {/* <p className="mb-0">{`Rentado ${mostRentedGame.count} veces`}</p> */}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Resume;
