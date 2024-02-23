import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, InputGroup, InputGroupText, Input, Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import PokeTarjeta from '../Components/PokeTarjeta';
import { PaginationControl } from 'react-bootstrap-pagination-control';

const Index = ({ history }) => {
    const [pokemones, setPokemones] = useState([]);
    const [allPokemones, setAllPokemones] = useState([]);
    const [listado, setListado] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(20);
    const [total, setTotal] = useState(20);
    const [favoritos, setFavoritos] = useState([]);
    const [modal, setModal] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState(null);

    useEffect(() => {
        getPokemones(offset);
        getAllPokemones();
    }, []);

    const getPokemones = async (o) => {
        const liga = "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + o;
        axios.get(liga).then(async (response) => {
            const respuesta = response.data;
            setPokemones(respuesta.results);
            setListado(respuesta.results);
            setTotal(respuesta.count);
        });
    };

    const getAllPokemones = async () => {
        const liga = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
        axios.get(liga).then(async (response) => {
            const respuesta = response.data;
            setAllPokemones(respuesta.results);
        });
    };

    const buscar = async (e) => {
        if (e.keyCode === 13) {
            if (filtro.trim() !== '') {
                setListado([]);
                setTimeout(() => {
                    setListado(allPokemones.filter(p => p.name.includes(filtro)));
                }, 100);
            }
        } else if (filtro.trim() === '') {
            setListado([]);
            setTimeout(() => {
                setListado(pokemones);
            }, 100);
        }
    };

    const goPage = async (p) => {
        setListado([]);
        await getPokemones((p === 1) ? 0 : ((p - 1) * 20));
        setOffset(p);
    };

    const toggleModal = () => {
        setModal(!modal);
    };

    const addToFavorites = (pokemon) => {
        setFavoritos([...favoritos, pokemon]);
    };

    const openModal = (pokemon) => {
        setSelectedPokemon(pokemon);
        toggleModal();
    };

    const viewDetail = (pokemon) => {
        setSelectedPokemon(pokemon);
        toggleModal();
    };

    const removeFromFavorites = (index) => {
        const updatedFavorites = [...favoritos];
        updatedFavorites.splice(index, 1);
        setFavoritos(updatedFavorites);
    };

    return (
        <Container className="shadow bg-danger mt-3">
            <Row>
                <Col>
                    <InputGroup className="mt-3 mb-3 shadow">
                        <InputGroupText><i className="fa-solid fa-search"></i></InputGroupText>
                        <Input value={filtro} onChange={(e) => { setFiltro(e.target.value) }} onKeyUpCapture={buscar} placeholder="Buscar pokemon"></Input>
                    </InputGroup>
                </Col>
            </Row>
            <Row className="mt-3">
                {listado.map((pok, i) => (
                    <PokeTarjeta poke={pok} key={i} addToFavorites={addToFavorites} openModal={openModal} />
                ))}
                {listado.length === 0 ?
                    <Col className="text-center fs-2 mb-3">No hay coincidencias</Col> : ''}
                <PaginationControl last={true} limit={limit} total={total} page={offset} changePage={page => goPage(page)} />
            </Row>
            <Button color="primary" onClick={toggleModal}>Ver Favoritos</Button>
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalBody>
                    <h3>Mis Pokemones Favoritos</h3>
                    <div className="d-flex flex-wrap justify-content-center">
                        {favoritos.map((fav, index) => (
                            <div key={index} className="text-center m-3">
                                <img src={fav.image} alt={fav.name} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                <p style={{ fontSize: '12px' }}>{fav.name}</p>
                                <div className="mt-2">
                                    <button className="btn btn-danger" onClick={() => removeFromFavorites(index)}>Eliminar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleModal}>Cerrar</Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
};

export default Index;
