import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardBody, CardFooter, CardImg, Badge } from 'reactstrap'
import { Link } from 'react-router-dom'

const PokeTarjeta = (params) => {
  const [pokemon, setPokemon] = useState({});
  const [imagen, setImagen] = useState(null);
  const [cardClass, setCardClass] = useState('d-none');
  const [loadClass, setLoadClass] = useState('d-block');
  const [fadeClass, setFadeClass] = useState('opacity-0');

  useEffect(() => {
    getPokemon();
  }, [params.poke.url]); // Se recarga si cambia la URL

  const getPokemon = async () => {
    setLoadClass('d-block');
    setCardClass('d-none');
    try {
      const response = await axios.get(params.poke.url);
      const res = response.data;
      setPokemon(res);
      
      const img = res.sprites.other?.home?.front_default || 
                  res.sprites.other?.['official-artwork']?.front_default || 
                  res.sprites.front_default;
      
      setImagen(img);
      setCardClass('d-block');
      setLoadClass('d-none');
      setTimeout(() => setFadeClass('opacity-100'), 50);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='w-100 mb-4'>
      <Card className={`shadow border-4 border-warning ${loadClass}`}>
        <div className='d-flex align-items-center justify-content-center' style={{ height: '200px' }}>
          <img src='/img/loading_card.gif' width="50" alt="loading" />
        </div>
      </Card>

      <Card className={`shadow border-4 border-warning h-100 ${cardClass} ${fadeClass}`} style={{ transition: 'opacity 0.5s' }}>
        {imagen && <CardImg src={imagen} style={{ height: '150px', objectFit: 'contain' }} className='p-2' />}
        <CardBody className='text-center p-2'>
          <Badge pill color='danger'># {pokemon.id}</Badge>
          <div className='fw-bold text-capitalize mt-2'>{pokemon.name}</div>
        </CardBody>
        <CardFooter className='bg-warning p-0 border-0'>
          <Link to={`/pokemon/${pokemon.name}`} className='btn btn-warning w-100 rounded-0 fw-bold'>
            Detalle
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default PokeTarjeta;