import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import Plot from 'react-plotly.js';


function ChartsPanel() {

    const [Payments, setPayments] = useState([])


    useEffect(() => {
        getPayments()
    }, [])


    const getPayments = (variables) => {
        Axios.post('/api/payment/getPayments', variables)
            .then(response => {
                if (response.data.success) {
                    setPayments(response.data.payments)
                } else {
                    alert('Nie uda³o siê pobraæ dane')
                }
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
    }

    for (var i = 0; i < names.length; i++) {
        objs.forEach(o => {
            if (o.name === names[i]) {
                objsDist[i].price = o.price;
                objsDist[i].quantity += o.quantity;
            }
        })
    }

    for (var i = 0; i < objsDist.length; i++) {
        price.push(objsDist[i].price);
        quantity.push(objsDist[i].quantity);
        cost.push(objsDist[i].quantity * objsDist[i].price);
    }


    console.log()
    return (
        <div style={{ textAlign: 'center' }}>
            <Plot
                data={[
                    {
                        x: names,
                        y: quantity,
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: { color: 'red' },
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
                        type: 'bar',
                        x: names,
                        y: cost,
                        name: "Produkt",
                        marker: { color: 'orange' }
                    },
                ]}
                layout={{ width: 1000, height: 740, title: 'Zysk ze sklepu wedlug towarow' }}
            />
        </div>
    )
}

export default ChartsPanel