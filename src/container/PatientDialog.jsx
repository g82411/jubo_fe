import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';
import { getPatientOrders, editOrder, creatreNewOrder } from '../actions/action';

const updatePatientOrders = async ({ patientId, setNewestOrderId, setOrders }) => {
    const res = await getPatientOrders(patientId);
    if (res) {
        const { orders } = res;
        setOrders(orders);
        if (orders.length) {
            setNewestOrderId(orders[0].id);
        }
    }
};

const PatientDialog = ({ patient, open, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState('');
  const [editingOrder, setEditingOrder] = useState(null);
  const [editedOrderText, setEditedOrderText] = useState('');
  const [newestOrderId, setNewestOrderId] = useState(-1);


  useEffect(() => {
    if (!patient) {
        return;
    }
    const { id } = patient;
    updatePatientOrders({ patientId: id, setNewestOrderId, setOrders });
  }, [patient])

  const handleAddOrder = async () => {
    if (newOrder.trim()) {
      const { status, order } = await creatreNewOrder({ newestOrderId, order: newOrder.trim(), patientId: patient.id });
      if (status === 201) {
        setOrders([order, ...orders]);
        setNewestOrderId(order.id);
        setNewOrder('');
        return
      } else {
        updatePatientOrders({ patientId: patient.id, setNewestOrderId, setOrders });
      }
    }
  };

  const startEditing = (order, index) => {
    setEditingOrder(index);
    setEditedOrderText(order.text);
  };

  const handleEditOrder = async (index) => {
    const updatedOrder = orders[index]
    const { text: prevOrder, id: orderId } = updatedOrder;
    if (editedOrderText.trim() && editedOrderText !== prevOrder) {
      const { status } =  await editOrder({orderId, order: editedOrderText.trim(), prevOrder });
      if (status === 201) {
        updatedOrder.text = editedOrderText;
        setOrders([...orders]);
        cancelEditing();
        return
      } else{
        updatePatientOrders({ patientId: patient.id, setNewestOrderId, setOrders });
      }
    }
  };

  const cancelEditing = () => {
    setEditingOrder(null);
    setEditedOrderText('');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Patient Orders for {patient?.name}</DialogTitle>
      <DialogContent>
        <List>
          {orders.map((order, index) => (
            <ListItem key={index} secondaryAction={
              editingOrder === index ? (
                <>
                  <Button onClick={() => handleEditOrder(index)}>Save</Button>
                  <Button onClick={cancelEditing}>Cancel</Button>
                </>
              ) : (
                <IconButton edge="end" onClick={() => startEditing(order, index)}>
                  <EditIcon />
                </IconButton>
              )
            }>
              {editingOrder === index ? (
                <TextField
                  fullWidth
                  value={editedOrderText}
                  onChange={(e) => setEditedOrderText(e.target.value)}
                />
              ) : (
                <ListItemText primary={order.text} />
              )}
            </ListItem>
          ))}
        </List>

        <TextField
          fullWidth
          label="New Order"
          value={newOrder}
          onChange={(e) => setNewOrder(e.target.value)}
          margin="normal"
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddOrder}>Add Order</Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

PatientDialog.propTypes = {
    patient: PropTypes.any,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}


export default PatientDialog;
