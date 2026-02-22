import { useState, useEffect } from 'react'
import axios from 'axios'
import { Col, Card, CardBody, CardFooter, CardImg, Badge } from 'reactstrap'
import { Link } from 'react-router-dom'

const PokeTarjeta = (params) => {
  const [pokemon, setPokemon] = useState({});
  const [imagen, setImagen] = useState(null);
  const [cardClass, setCardClass] = useState('d-none');
  const [loadClass, setLoadClass] = useState('d-block');

  useEffect(() => {
    getPokemon()
  }, [])

  const getPokemon = async () => {
    const liga = params.poke.url;
    try {
      const response = await axios.get(liga);
      const respuesta = response.data;
      setPokemon(respuesta);
      setImagen(respuesta.sprites.other['official-artwork'].front_default);
      setCardClass('d-block');
      setLoadClass('d-none');
    } catch (error) {
      setLoadClass('d-none');
    }
  }

  return (

    <Col sm='4' lg='4' className='mb-4 d-flex align-items-stretch'>
      
      {/* TARJETA DE CARGA */}
      <Card className={`shadow border-4 border-warning w-100 p-0 ${loadClass}`}>
        <CardImg 
          src='/img/loading_card.gif' 
          className='p-3'
          style={{ height: '276px', objectFit: 'contain' }} 
        />
      </Card>

      {/* TARJETA REAL */}
      <Card className={`shadow border-4 border-warning w-100 p-0 h-100 ${cardClass}`}>
        <CardImg 
          src={imagen || ''} 
          className='p-2'
          alt={pokemon.name}
          style={{ height: '150px', objectFit: 'contain' }} 
        />
        
        {/* d-flex flex-column asegura que el contenido se distribuya bien si el nombre es largo */}
        <CardBody className='text-center d-flex flex-column justify-content-center'>
          <Badge pill color='danger' className='mb-2 mx-auto' style={{width:'fit-content'}}>
            # {pokemon.id}
          </Badge>
          <div 
            className='fw-bold text-capitalize' 
            style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', lineHeight: '1.2' }}
          >
            {pokemon.name}
          </div>
        </CardBody>

        <CardFooter className='bg-warning border-0 overflow-hidden'>
          <Link 
            to={`/pokemon/${pokemon.id}`} 
            className='btn btn-warning w-100 rounded-0 d-block fw-bold'
            style={{ 
              border: 'none', 
              backgroundColor: 'transparent', 
              padding: '12px 0',
              color: 'black'
            }}
          >
            <i className='fa-solid fa-arrow-up-right-from-square'></i> Detalle
          </Link>
        </CardFooter>
      </Card>
    </Col>
  )
}

export default PokeTarjeta