import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getCartItems, removeCartItem, onSuccessBuy} from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import { Result} from 'antd';
import Paypal from '../../utils/Paypal';


function CartPage(props) {
    const dispatch = useDispatch();
    const [Total, setTotal] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)
    const [ShowSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        let cartItems = [];
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                });
                dispatch(getCartItems(cartItems, props.user.userData.cart))
                    .then((response) => {
                        if (response.payload.length > 0) {
                            calculateTotal(response.payload)
                        }
                    })
            }
        }
    }, [dispatch, props.user.userData])


    const calculateTotal = (cartDetail) => {
        let total = 0;
        cartDetail.map(item => { total += parseInt(item.price, 10) * item.quantity});
        setTotal(total)
        setShowTotal(true)
    }


    const removeFromCart = (productId) => {
        dispatch(removeCartItem(productId))
            .then((response) => {
                if (response.payload.cartDetail.length <= 0) {
                    setShowTotal(false)
                } else {
                    calculateTotal(response.payload.cartDetail)
                }
            })
    }

    const transactionSuccess = (data) => {
        dispatch(onSuccessBuy({
            cartDetail: props.user.cartDetail,
            paymentData: data
        }))
            .then(response => {
                if (response.payload.success) {
                    setShowSuccess(true)
                    setShowTotal(false)
                }
            })
    }

    const transactionError = () => {
        console.log('błąd płatności')
    }
    const transactionCanceled = () => {
        console.log('odwołana płatność')
    }


    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h1>Koszyk</h1>
            <div>
                <UserCardBlock
                    products={props.user.cartDetail}
                    removeItem={removeFromCart}
                />
                {ShowTotal ?
                    <div style={{ marginTop: '3rem' }}>
                        <h2>Podsumowanie: {Total} zł</h2>
                    </div>
                    :
                    ShowSuccess ?
                        <Result
                            status="success"
                        /> :
                        <div style={{
                            width: '100%', display: 'flex', flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                           
                        </div>
                }
            </div>

            {ShowTotal &&
                <Paypal toPay={Total} onSuccess={transactionSuccess} transactionError={transactionError}
                    transactionCanceled={transactionCanceled}
                />
            }
        </div>
    )
}

export default CartPage
