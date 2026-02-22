import React from 'react'
import {Container, Row, Col, InputGroupText, Input, InputGroup} from 'reactstrap'
import axios from 'axios'
import {useState, useEffect} from 'react'
import PokeTarjeta from '../Components/PokeTarjeta'



const Index = () => {
  const [pokemones, setPokemones] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);

  // El useEffect debe observar cambios en 'offset' si quieres paginación
  useEffect(() => {
    getPokemones(offset);
  }, [offset]); 

  const getPokemones = async (o) => {
    // Usando Template Literals para la URL
    const liga = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${o}`;

    try {   
      const response = await axios.get(liga);
      const respuesta = response.data;
      setPokemones(respuesta.results);
      // Si quieres ver los datos, míralos aquí:
      //console.log("Datos recibidos:", respuesta.results);
    } catch (error) {
      console.log('Error getting Pokemons:', error)
      // Opcional: Podrías poner un mensaje de alerta para el usuario
      // alert("No se pudo conectar con el servidor de Pokémon");
    }
  }

  return (
    <Container>
      <Row>
        <Col>
          <InputGroup className='shadow'>
            <InputGroupText><i className='fa-solid fa-search'></i></InputGroupText>
            <Input placeholder='Buscar Pokemon'></Input>
          </InputGroup>
        </Col>
      </Row>
      <Row className='mt-3'>
        { pokemones.map( (pok, i) =>(
          <PokeTarjeta  poke={pok} key = {i} />

        ) ) }
      </Row>
    </Container>

  )
}

export default Index