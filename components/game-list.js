import GameCard from "./game-card";
import React, { useState, useEffect } from "react";
import NewGame from "./new-game";
export const apiUrl = process.env.API_BASE_URL;

export default function GameList() {
    const [games, setGames] = useState([]);
    const [searchBy, setSearchBy] = useState("name");
    const [searchValue, setSearchValue] = useState("");
    const [showCreateGameModal, setShowCreateGameModal] = useState(false);

    
    useEffect(() => {
        async function fetchGames() {
            try {
                var value = searchValue;
                if (searchBy === "year") value = parseInt(searchValue) || 0;

                const response = await fetch(`${apiUrl}/api/games/search?${searchBy}=${value}`, {
                    method: "GET",
                });
                const gamesData = await response.json();
                setGames(gamesData);
            } catch (error) {
                setGames([]);
            }
        }
        fetchGames();
    }, [searchBy, searchValue]);

    const handleSearchByChange = (event) => {
        setSearchValue("");
        setSearchBy(event.target.value);
    };

    const handleSearchValueChange = (event) => {
        setSearchValue(event.target.value);
    }; 

    const handleSearchSubmit = (event) => {
        event.preventDefault();
    };

    const mapSearchBy = {
        "name": "nombre",
        "producer" : "productor",
        "director" : "director",
        "year" : "año",
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-end">
                <NewGame show={showCreateGameModal} handleClose={() => setShowCreateGameModal(false)} />
                <button type="button" className="btn btn-outline-primary" onClick={() => setShowCreateGameModal(true)}>Agregar nuevo juego</button>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 offset-md-3">
                    <form onSubmit={handleSearchSubmit}>
                        <div className="input-group">
                            <select className="form-select" value={searchBy} onChange={handleSearchByChange}>
                                <option value="name">Nombre</option>
                                <option value="producer">Productor</option>
                                <option value="director">Director</option>
                                <option value="year">Año</option>
                            </select>
                            <input
                                type="text"
                                className="form-control "
                                value={searchValue}
                                onChange={handleSearchValueChange}
                                style={{ width: "20rem" }} 
                                placeholder={`Buscar video juego por ${mapSearchBy[searchBy]}...`}
                            />
                            <button type="submit" className="btn btn-primary">
                                Buscar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="row">
                {games.length > 0 ? (
                    games.map((game, index) => (
                        <div className="col-md-4 col-sm-6 col-xl-3 mt-2" key={index}>
                            <GameCard
                                key={`card-game=${game.gameId}`}
                                id={game.gameId}
                                name={game.name}
                                imageUrl={game.urlImage}
                                platform={game.platform}
                                director={game.director}
                                producer={game.producer}
                                year={game.year}
                                price={game.price}
                                available={game.gameStatus === "AVAILABLE" ? true : false}
                            />
                        </div>
                    ))
                ) : (
                    <div className="d-flex justify-content-center text-center">
                        <div className="alert alert-warning w-50">No se encontraron Video Juegos!</div>
                    </div>
                )}
            </div>
        </div>
    );
}
