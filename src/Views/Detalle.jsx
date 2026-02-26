import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Container, Row, Col, Card, CardBody, CardText, Progress } from 'reactstrap'
import axios from 'axios'
import PokeTarjeta from '../Components/PokeTarjeta'

const Detalle = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null); 
  const [habitat, setHabitat] = useState('Desconocido');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');
  const [tipos, setTipos] = useState([]);
  const [estadisticas, setEstadisticas] = useState([]);
  const [listaEvoluciones, setListaEvoluciones] = useState([]);
  const [habilidades, setHabilidades] = useState([]);
  const [cardClass, setCardClass] = useState('d-none');
  const [loadClass, setLoadClass] = useState('d-block');

  const coloresTipos = {
    steel: "#60A1B8", water: "#4D90D5", bug: "#91C12F", dragon: "#0B6DC3",
    electric: "#F2D94E", ghost: "#5269AD", fire: "#FF9D54", ice: "#71D0F5",
    fairy: "#EC8FE6", fighting: "#CE4069", normal: "#9099A1", grass: "#63BB5B",
    psychic: "#FA7179", rock: "#C7B78B", dark: "#5A5366", ground: "#D97746",
    poison: "#AA6BC8", flying: "#8FA8DD"
  };

// MAPEO DE IMÁGENES (Asegúrate de tener estos archivos en public/img/)
  const fondosHabitats = {
    grass: "url('/img/Type_BG/grass.jpg')",
    forest: "url('/img/Type_BG/forest.jpg')",
    // grassland: "url('/img/Type_BG/grassland.jpg')",
    mountain: "url('/img/Type_BG/mountain.jpg')",
    // rare: "url('/img/Type_BG/rare.jpg')",
    // rough_terrain: "url('/img/rough_terrain.jpg')",
    salt_water: "url('/img/Type_BG/salt_water.jpg')",
    fresh_water: "url('/img/Type_BG/fresh_water.jpg')"
    // urban: "url('/img/Type_BG/urban.jpg')",
    // waters_edge: "url('/img/Type_BG/waters_edge.jpg')"
  };

  useEffect(() => {
    getPokemon();
  }, [id]);

  const reproducirSonido = () => {
    if (pokemon && pokemon.cries && pokemon.cries.latest) {
      const audio = new Audio(pokemon.cries.latest);
      audio.volume = 0.5;
      audio.play();
    }
  };

  const getPokemon = async () => {
    setLoadClass('d-block');
    setCardClass('d-none');
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const respuesta = response.data;
        setPokemon(respuesta);

        const img = respuesta.sprites.other.home.front_default || 
                    respuesta.sprites.other['official-artwork'].front_default || 
                    respuesta.sprites.front_default;
        setImagen(img);

        await Promise.all([
            getTipos(respuesta.types),
            getHabilidades(respuesta.abilities),
            getEstadisticas(respuesta.stats),
            getEspecie(respuesta.species.name)
        ]);

        setCardClass('d-block');
        setLoadClass('d-none');
    } catch (error) {
        console.error("Error cargando pokemon", error);
    }
  }

  const getEstadisticas = async (es) => {
    const promesas = es.map(e => axios.get(e.stat.url));
    const respuestas = await Promise.all(promesas);
    const lista = respuestas.map((res, i) => ({
      nombre: res.data.names.find(n => n.language.name === 'es')?.name || res.data.name,
      valor: es[i].base_stat
    }));
    setEstadisticas(lista);
  }

  const getHabilidades = async (hab) => {
    const promesas = hab.map(h => axios.get(h.ability.url));
    const respuestas = await Promise.all(promesas);
    const lista = respuestas.map(res => 
      res.data.names.find(n => n.language.name === 'es')?.name || res.data.name
    );
    setHabilidades(lista);
  }

  const getTipos = async (tip) => {
    const promesas = tip.map(t => axios.get(t.type.url));
    const respuestas = await Promise.all(promesas);
    const lista = respuestas.map(res => 
      res.data.names.find(n => n.language.name === 'es')?.name || res.data.name
    );
    setTipos(lista);
  }

  const getEspecie = async (esp) => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${esp}`);
    const respuesta = response.data;
    if (respuesta.habitat) {
      const resHab = await axios.get(respuesta.habitat.url);
      setHabitat(resHab.data.names.find(n => n.language.name === 'es')?.name || respuesta.habitat.name);
    }
    const desc = respuesta.flavor_text_entries.find(d => d.language.name === 'es')?.flavor_text || "";
    setDescripcion(desc.replace(/[\n\f]/g, ' '));
    await getEvoluciones(respuesta.evolution_chain.url);
  }

  const getEvoluciones = async (ev) => {
    const response = await axios.get(ev);
    const nombres = [];
    const procesar = (nodo) => {
        nombres.push(nodo.species.name);
        nodo.evolves_to.forEach(e => procesar(e));
    };
    procesar(response.data.chain);
    setListaEvoluciones(nombres.map(n => ({ name: n, url: `https://pokeapi.co/api/v2/pokemon/${n}/` })));
  }

  return (
    <Container className='bg-warning mt-3'>
      <Row>
        <Col>
          <Card className='shadow mt-3 mb-3 border-0'>
            <CardBody className='mt-3'>
              
              {/* LOADER */}
              <Row className={loadClass}>
                <Col className='text-center py-5'>
                  <img src='/img/loading_card.gif' width="200" alt="loading"/>
                  {/* <p className='mt-3 fw-bold'>Buscando Pokémon...</p> */}
                </Col>
              </Row>

              {/* CONTENIDO PRINCIPAL */}
              <div className={cardClass}>
                {pokemon && (
                  <Row>
                    {/* Botón Inicio sincronizado con la carga */}
                    <Col xs="12" className='text-end mb-3'>
                      <Link to='/' className='btn btn-danger shadow-sm'>
                        <i className='fa-solid fa-home me-2'></i> Inicio
                      </Link>
                    </Col>

                    <Col md='12' className='text-center'>
                        <img 
                          src={imagen} 
                          alt={pokemon.name}
                          onClick={reproducirSonido}
                          style={{ 
                            maxHeight: '220px', 
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                          }} 
                          className='img-fluid animate__animated animate__zoomIn pointer'
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                          title="¡Haz clic para escuchar su grito!"
                        />
                    </Col>
                    
                    <Col md='12'>
                      <CardText className='h1 text-capitalize text-center mt-2'>{pokemon.name}</CardText>
                      <CardText className='fs-5 text-secondary text-center mb-4'>{descripcion}</CardText>
                      
                      <CardText className='fs-5 text-start'>
                        Altura: <b>{pokemon.height / 10} m</b> | Peso: <b>{pokemon.weight / 10} kg</b>
                      </CardText>

                      {/* TIPOS: Corrección Flexbox para móviles */}
                      <div className='fs-5 mb-3 text-start d-flex flex-wrap align-items-center'>
                        <span className='me-2'>Tipo:</span>
                        {pokemon.types.map((t, i) => (
                          <span 
                            key={i}
                            className="rounded-pill me-2 mb-2 shadow-sm text-white fw-bold"
                            style={{ 
                                backgroundColor: coloresTipos[t.type.name] || '#777',
                                padding: '4px 14px',
                                display: 'inline-flex',
                                fontSize: '0.85rem',
                                textTransform: 'capitalize'
                            }}
                          >
                            {tipos[i] || t.type.name}
                          </span>
                        ))}
                      </div>

                      <CardText className='fs-5 text-start'>
                        Habilidades: {habilidades.map((h,i) => (
                          <span key={i} className="badge bg-dark me-1 fw-normal">{h}</span>
                        ))}
                      </CardText>
                      
                      <CardText className='fs-5 text-capitalize text-start'>
                        Habitat: <b>{habitat}</b>
                      </CardText>
                    </Col>

                    {/* ESTADÍSTICAS: Corrección para pantallas pequeñas */}
                    <Col md='12' className='mt-4'>
                      <CardText className='fs-4 text-center'><b>Estadísticas Base</b></CardText>
                    </Col>
                    {estadisticas.map((es, i) => (
                      <Row key={i} className="px-3 align-items-center mb-1">
                        <Col xs='6' md='3' className='text-start text-md-end'>
                          <b style={{ fontSize: '0.85rem' }} className='text-uppercase'>{es.nombre}</b>
                        </Col>
                        <Col xs='6' md='9'>
                          <Progress className='my-1 shadow-sm' value={es.valor} style={{ height: '18px' }}>
                            <small className='fw-bold'>{es.valor}</small>
                          </Progress>
                        </Col>
                      </Row>
                    ))}

                    <Col md='12' className='mt-5'>
                      <CardText className='fs-4 text-center'><b>Línea Evolutiva</b></CardText>
                    </Col>
                    <Row className="justify-content-center g-3 pb-4">
                      {listaEvoluciones.map((pok, i) => (
                        <Col xs='12' sm='6' md='4' key={i} className='d-flex'>
                          <PokeTarjeta poke={pok} />
                        </Col>
                      ))}
                    </Row>
                  </Row>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Detalle;