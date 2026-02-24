import React, { useState, useEffect, useMemo } from 'react'
import { Container, Row, Col, InputGroupText, Input, InputGroup } from 'reactstrap'
import axios from 'axios'
import PokeTarjeta from '../Components/PokeTarjeta'
import { PaginationControl } from 'react-bootstrap-pagination-control'

const Index = () => {
  const [pokemones, setPokemones] = useState([]);
  const [Allpokemones, setAllPokemones] = useState([]);
  const [listado, setListado] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getPokemones(page);
    if (Allpokemones.length === 0) getAllPokemones();
  }, [page]);

  // OPTIMIZACIÓN: Debouncing manual para el filtro
  useEffect(() => {
    const handler = setTimeout(() => {
      if (filtro.trim() !== '') {
        // Filtrado optimizado: convertimos a minúsculas una sola vez
        const query = filtro.toLowerCase();
        const filtrados = Allpokemones.filter(p => 
          p.name.toLowerCase().includes(query)
        );
        setListado(filtrados);
      } else {
        setListado(pokemones);
      }
    }, 300); // Espera 300ms después de que el usuario deja de escribir

    return () => clearTimeout(handler); // Limpia el timer si el usuario sigue escribiendo
  }, [filtro, pokemones, Allpokemones]);

  const getPokemones = async (p) => {
    const apiOffset = (p - 1) * limit;
    const liga = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${apiOffset}`;
    try {   
      const response = await axios.get(liga);
      setPokemones(response.data.results);
      setTotal(response.data.count);
    } catch (error) { console.log(error); }
  }

  const getAllPokemones = async () => {
    const liga = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
    try {   
      const response = await axios.get(liga);
      setAllPokemones(response.data.results);
    } catch (error) { console.log(error); }
  }

  return (
    <Container className='shadow mt-3 p-3'>
      <Row className="mb-3">
        <Col>
          <InputGroup className='shadow-sm'>
            <InputGroupText><i className='fa-solid fa-search'></i></InputGroupText>
            <Input 
              value={filtro} 
              onChange={(e) => setFiltro(e.target.value)} 
              placeholder='Buscar Pokemon...'
            />
          </InputGroup>
        </Col>
      </Row>

      <Row className='mt-3 justify-content-center' xs='2' sm='3' md='4' lg='5'>
        { listado.map( (pok, i) => (
            <PokeTarjeta poke={pok} key={pok.name} /> 
        )) }
      </Row>

      <Row className="mt-4">
        <Col className="d-flex justify-content-center">
          {filtro === '' && (
            <PaginationControl 
              last={true} limit={limit} total={total} page={page} 
              changePage={p => { setListado([]); setPage(p); }} 
            />
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default Index;