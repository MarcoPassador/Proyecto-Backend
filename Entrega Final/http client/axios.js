import axios from "axios";

const host = 'http://localhost:8080/api';
const testProduct = {
    name: "prueba",
    price: 1,
    stock: 5,
    photo: "no hay",
    code: "prb1",
    desc: "producto de prueba"
}

const testModProduct = {
    name: "prueba 2",
    price: 1,
    stock: 5,
    photo: "no hay",
    code: "prb1",
    desc: "producto de prueba"
}

const sameStatus = (resStatus, preStatus) => {
    return resStatus === preStatus
}

const getProducts = async () => {
    return await axios.get(`${host}/products`)
    .then(response => {
        console.log('****PRODUCTOS LISTADOS****')
        console.log(response.data);
        console.log(`La respuesta tiene el status esperado: ${sameStatus(response.status, 200)}`)
    })
    .catch(err => {
        console.log(err)
    })
}

const addProduct = async() => {
    return await axios.post(`${host}/products`, testProduct)
    .then(response => {
        console.log('****PRODUCTO AÑADIDO****')
        console.log(response.data);
        console.log(`La respuesta tiene el status esperado: ${sameStatus(response.status, 201)}`)
    })
    .catch(err => {
        console.log(err)
    })
}

const getProduct = async () => {
    return await axios.get(`${host}/products`)
    .then(response => {
        const products = response.data;
        console.log(products.productos[0].id)
        axios.get(`${host}/products/${products.productos[0].id}`)
        .then(product => {
            console.log('****PRODUCTO MOSTRADO****')
            console.log(product.data);
            console.log(`La respuesta tiene el status esperado: ${sameStatus(product.status, 200)}`)
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err)
    })
}

const updatedProduct = async () => {
    return await axios.get(`${host}/products`)
    .then(response => {
        const products = response.data;
        axios.put(`${host}/products/${products.productos[0].id}`, testModProduct)
        .then(response => {
            console.log('****PRODUCTO MODIFICADO****')
            console.log(response.data);
            console.log(`La respuesta tiene el status esperado: ${sameStatus(response.status, 201)}`)
        })
        .catch(err => {
            console.log(err);
        })
    })
}

const deleteProduct = async () => {
    return await axios.get(`${host}/products`)
    .then(response => {
        const products = response.data;
        axios.delete(`${host}/products/${products.productos[0].id}`)
        .then(response => {
            console.log('****PRODUCTO ELIMINADO****')
            console.log(response.data);
            console.log(`La respuesta tiene el status esperado: ${sameStatus(response.status, 200)}`)
        })
        .catch(err => {
            console.log(err);
        })
    })
}


getProducts();
addProduct();
getProduct();
updatedProduct();
deleteProduct();




