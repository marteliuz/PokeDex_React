import { useState, useEffect } from 'react'
import axios from 'axios'
import{Col, Card, CardBody, CardFooter, CardImg, Badge} from 'reactstrap'
import { Link } from 'react-router-dom'

const PokeTarjeta = (params) => {
  const [pokemon, setPokemon] = useState([]);
  const [imagen, setImagen] = useState('');
  const [cardClass, setCardClass] = useState('d-none');
  const [loadClass, setLoadClass] = useState('');
  useEffect( () =>{
    getPokemon()
  },[])
  
  const getPokemon = async() =>{
    const liga = params.poke.url;
    axios.get(liga).then( async(response)=>{
      const respuesta = response.data;
      setPokemon(respuesta);

      setImagen(respuesta.sprites.other['official-artwork'].front_default);
    })

  }


  return (
  <Col sm='4' lg='3' className='mb-3'>
    <Card>
      <CardImg src='/img/loading_black.gif' height='200' className='p-3'></CardImg>
    </Card>
    <Card className='shadow border-4 border-warning'>
      <CardImg src={imagen} height='150' className='p-2' alt={pokemon.name}></CardImg>
      <CardBody className='text-center'>
        <Badge pill color='danger' className='mb-2'># {pokemon.id}</Badge>
        <div className='fw-bold text-capitalize'>{pokemon.name}</div>
      </CardBody>
      <CardFooter className='bg-warning  p-0 border-0'>
          <Link to={`/pokemon/${pokemon.id}`} className='btn  w-100 rounded-0'>
            <i className='fa-solid fa-arrow-up-right-from-square'></i> Detalle
          </Link>
        </CardFooter>
    </Card>
  </Col>
  )
}

export default PokeTarjeta