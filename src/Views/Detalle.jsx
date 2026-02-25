import React from 'react'
import {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {Container, Row, Col, Card, CardBody, CardText, Badge, Progress} from 'reactstrap'
import axios from 'axios'
import PokeTarjeta from '../Components/PokeTarjeta'



const Detalle = () => {
 const {id} = useParams();
 const [pokemon, setPokemon] = useState([]);
 const [especie, setEspecie] = useState([]);
 const [habitat, setHabitat] = useState('Desconocido');
 const [descripcion, setDescripcion] = useState([]);
 const [imagen, setImagen] = useState([]);
 const [tipos, setTipos] = useState([]);
 const [cardClass, setCardClass] = useState('d-none');
 const [loadClass, setLoadClass] = useState('d-block');

  useEffect(() => {
    getPokemon()
  }, [])


 const getPokemon = async () => {
  const liga = 'https://pokeapi.co/api/v2/pokemon/' + id;
  axios.get(liga).then(async(response)=>{
    const respuesta = response.data;
    setPokemon(respuesta);
    // Set images
    if (respuesta.sprites.other.home.front_default != null) {
        // 3D
        setImagen(respuesta.sprites.other.home.front_default);
      } else {
        if (respuesta.sprites.other['official-artwork'].front_default != null) {
          // Official-Artwork
          setImagen(respuesta.sprites.other['official-artwork'].front_default);
        }else{
          if (respuesta.sprites.other.dream_world.front_default != null) {
            // Anime
            setImagen(respuesta.sprites.other.dream_world.front_default);
          } else {
            if (respuesta.sprites.front_default != null) {
              // Pixel Art
              setImagen(respuesta.sprites.front_default);
            } else {
              // loading
              setImagen('/img/loading_card.gif');
            }
          }
        }
      }
      setCardClass('d-block');
      setLoadClass('d-none');

      await getEspecie(respuesta.species.name);

  })
  
 }

 const getEspecie = async(esp)=>{
  const liga = 'https://pokeapi.co/api/v2/pokemon-species/'+esp
  axios.get(liga).then (async(response)=>{
    const respuesta = response.data;
    setEspecie (respuesta);
    if (respuesta.habitat != null) {
      await getHabitat (respuesta.habitat.url)
    }
    await getDescripcion(respuesta.flavor_text_entries);
  })
}

const getHabitat = async (hab) => {
  axios.get(hab).then (async(response)=>{
    setHabitat(response.data.names[1].name);
  })
}

const getDescripcion = async (desc) => {
  let texto = '';
  desc.forEach( (d)=>{
    if (d.language.name == 'es') {
      texto  = d.flavor_text;
    }
  })
  setDescripcion(texto);
}


  return (
    <Container className='bg-danger mt-3'>
      <Row>
        <Col>
        <Card className='shadow mt-3 mb-3'>
          <CardBody className='mt-3'>

            <Row>
              <Col className='text-end'>
              <Link to='/' className='btn btn-warning'>
                <i className='fa-solid fa-home '></i>Inicio
              </Link>
              </Col>
            </Row>

            <Row className={loadClass}>
              <Col md='12'>
              <img src='/img/loading_card.gif' className='w-100'></img>       
             </Col>
            </Row>

            <Row className={cardClass}>
              <Col md='6' >
              <CardText className='h1 text-capitalize text-center'>{pokemon.name}</CardText>
              <CardText className='fs-4 text-start'>{descripcion}</CardText>
              <CardText className='fs-5 text-start'>
                Altura: <b>{(pokemon.height)/10} m </b> 
                Peso: <b>{(pokemon.weight)/10} kg</b>
              </CardText>
              <CardText className='fs-5 text-start'>Tipo: </CardText>
              <CardText className='fs-5 text-start text-capitalize'>
                Habitat: <b>{habitat}</b>
              </CardText>
              </Col>
              <Col md='6'></Col>
            </Row>
          </CardBody>
        </Card>     
        </Col>
      </Row>
    </Container>
  )
}

export default Detalle