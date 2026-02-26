import React, { useState, useEffect } from 'react';
import { Container, Row, Col, InputGroup, InputGroupText, Input } from 'reactstrap';
import axios from 'axios';
import PokeTarjeta from '../Components/PokeTarjeta';

const Index = () => {
  const [pokemones, setPokemones] = useState([]); // Los de la página actual
  const [allPokemones, setAllPokemones] = useState([]); // La lista de TODOS para el filtro
  const [filtro, setFiltro] = useState('');
  const [offset, setOffset] = useState(0);
  const limit = 20;

  useEffect(() => {
    getAllPokemones(); // Carga masiva para el buscador
    getPokemones();    // Carga inicial de la página 1
  }, []);

  useEffect(() => {
    getPokemones();
  }, [offset]);

  // Trae solo los 20 de la página actual
  const getPokemones = async () => {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    setPokemones(res.data.results);
  };

  // Trae los nombres y URLs de los 1000+ pokémones para que el filtro funcione siempre
  const getAllPokemones = async () => {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`);
    setAllPokemones(res.data.results);
  };

  // LÓGICA DE BÚSQUEDA:
  // Si hay texto, busca en la lista de 1000. Si no, muestra los 20 de la página.
  const listaAMostrar = filtro.trim() !== '' 
    ? allPokemones.filter(p => p.name.toLowerCase().includes(filtro.toLowerCase())).slice(0, 20)
    : pokemones;

  return (
    <Container className="mt-3">
      <Row className="mb-4">
        <Col md="12">
          <InputGroup className="shadow-sm">
            <InputGroupText className="bg-danger text-white">
              <i className="fa-solid fa-search"></i>
            </InputGroupText>
            <Input 
              placeholder="Buscar por nombre en toda la Pokédex..." 
              value={filtro} 
              onChange={(e) => setFiltro(e.target.value)} 
            />
          </InputGroup>
        </Col>
      </Row>

      <Row>
        {listaAMostrar.length > 0 ? (
          listaAMostrar.map((pok, i) => (
            <Col sm="4" lg="3" key={i} className="d-flex align-items-stretch mb-3">
              <PokeTarjeta poke={pok} />
            </Col>
          ))
        ) : (
          <Col className="text-center py-5">
            <img src="/img/loading_card.gif" width="100" alt="no encontrado" />
            <p className="fs-4 mt-3">No hay coincidencias para "{filtro}"</p>
          </Col>
        )}
      </Row>

      {/* Solo mostramos paginación si NO estamos buscando */}
      {filtro === '' && (
        <Row className="mt-4 pb-5">
          <Col className="d-flex justify-content-center">
            <button 
              className="btn btn-danger me-2 shadow" 
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
            >
              <i className="fa-solid fa-angles-left"></i> Anterior
            </button>
            <button 
              className="btn btn-danger shadow" 
              onClick={() => setOffset(offset + limit)}
            >
              Siguiente <i className="fa-solid fa-angles-right"></i>
            </button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Index;