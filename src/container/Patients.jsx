import { useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import PatientDialog from './PatientDialog';
import { getPatients } from '../actions/action';
import { useEffect } from 'react';

const queryPatients = async ({ setPatients }) => {
    const res = await getPatients();
    if (res) {
        const { patients } = res
        setPatients(patients)
    }
}

const PatientList = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [patients, setPatients] = useState([]);
  useEffect(() => {
    queryPatients({ setPatients })
  }, [])

  const handleListItemClick = (patient) => {
    setOpenDialog(true);
    setSelectedPatient(patient);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
  };

  return (
    <div>
      <List>
        {patients.map((patient) => (
          <ListItem button key={patient.id} onClick={() => handleListItemClick(patient)}>
            <ListItemText primary={patient.name} />
          </ListItem>
        ))}
      </List>
      <PatientDialog patient={selectedPatient} open={openDialog} onClose={handleClose} />
    </div>
  );
};

export default PatientList;
