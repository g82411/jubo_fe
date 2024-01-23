import { queryPaitents, queryPaitentOrders, handleEditOrder, createOrder } from "./http";


export const getPatients = async () => {
    const response = await queryPaitents();
    if (response.ok) {
        const data = await response.json();
        return data;
    }
}

export const getPatientOrders = async (patientId) => {
    const response = await queryPaitentOrders(patientId);
    if (response.ok) {
        const data = await response.json();
        return data;
    }
}

export const editOrder = async ({ orderId, order, prevOrder }) => {
    const response = await handleEditOrder({ orderId, order, prevOrder });
    if (response.ok) {
        const data = await response.json();
        return {status: response.status, data};
    }
    return {status: response.status};
}

export const creatreNewOrder = async ({ newestOrderId, order, patientId }) => {
    const response = await createOrder({ newestOrderId, order, patientId });
    if (response.ok) {
        const { message: newOrder } = await response.json();
        return {status: response.status, order: newOrder };
    }
    return {status: response.status};
}
