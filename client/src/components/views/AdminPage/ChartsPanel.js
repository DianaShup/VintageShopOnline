import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import Plot from 'react-plotly.js';


function ChartsPanel() {

    const [Payments, setPayments] = useState([])
    const [Products, setProducts] = useState([])

    const Categories = [
        { key: 1, value: "Artykuly higieniczne" },
        { key: 2, value: "Twarz" },
        { key: 3, value: "Wlosy" },
        { key: 4, value: "Makijaz" },
        { key: 5, value: "Perfumy" },
        { key: 6, value: "Cialo" },
        { key: 7, value: "Sukienka Vintage" },
        { key: 8, value: "Akcesoria Vintage" }
    ]

    useEffect(() => {
        getPayments()
    }, [])

    useEffect(() => {
        getProducts()
    }, [])

    const getProducts = async (variables) => {
        await Axios.post('/api/product/getProducts', variables)
            .then(response => {
                if (response.data.success) {
                    setProducts(response.data.products)
                } else {
                    alert('Nie uda³o siê pobraæ dane produktu')
                }
            })
    }

    const getPayments = async (variables) => {
        await Axios.post('/api/payment/getPayments', variables)
            .then(response => {
                if (response.data.success) {
                    setPayments(response.data.payments)
                } else {
                    alert('Nie uda³o siê pobraæ dane')
                }
            })
            .catch(function (e) {
                console.log(e); // "oh, no!"
            })
    }

    const tmp = [];
    const objs = [];
    Payments.forEach(function (e) {
        e.product.forEach(function (p) {

            tmp.push(
                p.name
            );
            objs.push({
                name: p.name,
                price: p.price,
                quantity: p.quantity
            })
        })
    });

    const objsDist = [];
    const names = [...new Set(tmp)];
    const price = [];
    const quantity = [];
    const cost = [];

    for (var i = 0; i < names.length; i++) {
        objsDist.push({ name: names[i], price: 0, quantity: 0 });
    };

    for (var i = 0; i < names.length; i++) {
        objs.forEach(o => {
            if (o.name === names[i]) {
                objsDist[i].price = o.price;
                objsDist[i].quantity += o.quantity;
            }
        })
    };

    for (var i = 0; i < objsDist.length; i++) {
        price.push(objsDist[i].price);
        quantity.push(objsDist[i].quantity);
        cost.push(objsDist[i].quantity * objsDist[i].price);
    };




    const categQuantity = [];
    const categCost = [];
    const prods = [];


    for (var i = 0; i < Categories.length; i++) {
        categQuantity.push({ key: Categories[i].value, value: 0 });
        categCost.push({ key: Categories[i].value, value: 0 });
    }

    Products.forEach(function (e) {
        prods.push({ name: e.title, cat: e.categories, price: e.price, quantity: e.sold })
    });

    for (var i = 0; i < prods.length; i++) {
        for (var j = 0; j < categQuantity.length; j++) {
            if (typeof Categories[prods[i].cat] != 'undefined') {
                console.log(Categories[prods[i].cat].value)
                if (categQuantity[j].key === Categories[prods[i].cat].value) {
                    categQuantity[j].value += prods[i].quantity
                }

                if (categCost[j].key === Categories[prods[i].cat].value) {
                    categCost[j].value += prods[i].price
                }
            }
        }
    }
    const categCostX = [];
    const categCostY = [];
    const categQuantityX = [];
    const categQuantityY = [];

    for (var i = 0; i < categCost.length; i++) {
        categCostX.push(categCost[i].key)
        categCostY.push(categCost[i].value)
        categQuantityX.push(categQuantity[i].key)
        categQuantityY.push(categQuantity[i].value)
    }

    console.log(categCostX)
    console.log(categQuantityY)
    return (
        <div style={{ textAlign: 'center' }}>
            <Plot
                data={[
                    {
                        x: names,
                        y: quantity,
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: { color: 'red', line: { width: 1.5 } },
                        name: "Trend"
                    },
                    { type: 'bar', x: names, y: quantity, name: "Produkt", marker: { color: 'pink' } },
                ]}
                layout={{ width: 1000, height: 740, title: 'Liczba sprzedazy produktow' }}
            />

            <Plot
                data={[
                    {
                        type: 'pie',
                        labels: names,
                        values: price,
                        name: "Produkt",
                        marker: { color: 'brown' }
                    },
                ]}
                layout={{ width: 1000, height: 740, title: 'Koszty produktow ze sklepu' }}
            />

            <Plot
                data={[
                    {
                        x: categCostX,
                        y: categCostY,
                        type: 'bar',
                        marker: {
                            color: '#C8A2C8', line: { width: 2.5 }
                        }
                    }
                ]}
                layout={{ width: 1000, height: 740, title: 'Cena kazdej z kategorii artykulow', autosize: true }}
            />

            <Plot
                data={[
                    {
                        x: categQuantityY,
                        y: categQuantityX,
                        type: 'bar',
                        orientation: 'h',
                        marker: {
                            color: '#c8c8a2', line: { width: 2.5 }
                        }
                    }
                ]}
                layout={{ width: 1200, height: 740, title: 'Liczba artykulow w kategoriach'}}
            />

            <Plot
                data={[
                    {
                        type: 'bar',
                        x: names,
                        y: cost,
                        name: "Produkt",
                        marker: { color: 'orange', line: { width: 1.5 } }
                    },
                ]}
                layout={{ width: 1000, height: 740, title: 'Zysk ze sklepu wedlug towarow' }}
            />
        </div>
    )
}

export default ChartsPanel