import React from 'react'
import {Container, Row, Col, InputGroupText, Input, InputGroup} from 'reactstrap'
import axios from 'axios'
import {useState, useEffect} from 'react'
import PokeTarjeta from '../Components/PokeTarjeta'
import {PaginationControl} from 'react-bootstrap-pagination-control'



const Index = () => {
  const [pokemones, setPokemones] = useState([]);
  const [Allpokemones, setAllPokemones] = useState([]);
  const [listado, setListado] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);


  // El useEffect debe observar cambios en 'offset' si quieres paginación
  useEffect(() => {
    getPokemones(offset);
    getAllPokemones();
  }, [offset]); 

  const getPokemones = async (o) => {
    // Usando Template Literals para la URL
    const liga = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${o}`;

    try {   
      const response = await axios.get(liga);
      const respuesta = response.data;
      setPokemones(respuesta.results);
      setListado(respuesta.results);
      setTotal(respuesta.count);

    } catch (error) {
      console.log('Error getting Pokemons:', error)
    }
  }

  const getAllPokemones = async (o) => {
    const liga = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';

    try {   
      const response = await axios.get(liga);
      const respuesta = response.data;
      setAllPokemones(respuesta.results);
    } catch (error) {
      console.log('Error getting All Pokemons:', error)
    }
  }

  const buscar = async(e)=>{
    if (e.keyCode==13) {
      if(filtro.trim() != ''){
        setListado([]);
        setTimeout(() => {
          setListado(Allpokemones.filter(p => p.name.includes(filtro)))
        }, 100);
      }
    } else if(filtro.trim() == '') {
      setListado([]);
      setTimeout(() => {
        setListado(pokemones)
      }, 100);
    }
  }

  const goPage = async(p) =>{
    setListado([]);
    await getPokemones((p==1) ? 0 : ((p-1)*20));
    setOffset(p);
  }


  return (
    <Container className='shadow mt-3'>
      <Row>
        <Col>
          <InputGroup className='shadow'>
            <InputGroupText><i className='fa-solid fa-search'></i></InputGroupText>
            <Input value={filtro} onChange={(e) => {setFiltro(e.target.value)}} onKeyUpCapture={buscar} placeholder='Buscar Pokemon'></Input>
          </InputGroup>
        </Col>
      </Row>


      <Row className='mt-3'>
        { listado.map( (pok, i) =>(
          <PokeTarjeta  poke={pok} key = {i} />
        ) ) }
        <PaginationControl last={true} limit={limit} total={total} page={offset} changePage={page =>goPage(page)}></PaginationControl>
      </Row>


{/* <Row className='mt-3' xs='1' sm='2' md='3' lg='4' xl='5'>
  { listado.map( (pok, i) =>(
    <PokeTarjeta poke={pok} key={i} />
  ) ) }
  
  <Col xs="12" className="mt-4">
    <PaginationControl 
      last={true} 
      limit={limit} 
      total={total} 
      page={offset} 
      changePage={page => goPage(page)} 
    />
  </Col>
</Row> */}
    </Container>
  )
}

export default Index