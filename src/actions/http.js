// eslint-disable-next-line no-undef
const API_URL = import.meta.env.VITE_API_URL;

export const queryPaitents = () => {
    return fetch(`${API_URL}/patients`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export const queryPaitentOrders = (patientId) => {
    return fetch(`${API_URL}/orders/${patientId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export const handleEditOrder = ({ orderId, order, prevOrder }) => {
    return fetch(`${API_URL}/order/${orderId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "order_id": orderId,
            "text": order,
            "prev_order": prevOrder
        }),
    });
}


export const createOrder = ({ patientId, order, newestOrderId }) => {
    return fetch(`${API_URL}/order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "patient_id": patientId,
            "text": order,
            "last_order_id": newestOrderId
        }),
    });
};