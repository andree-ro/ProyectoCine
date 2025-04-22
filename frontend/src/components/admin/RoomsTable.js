import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const RoomsTable = ({ rooms, onEdit, onDelete, loading }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleDeleteClick = (room) => {
    setSelectedRoom(room);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRoom) {
      onDelete(selectedRoom.id);
    }
    setDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedRoom(null);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Póster</TableCell>
              <TableCell>Sala</TableCell>
              <TableCell>Película</TableCell>
              <TableCell>Capacidad</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>
                  <Avatar
                    variant="rounded"
                    src={room.movie_poster}
                    alt={room.movie_title}
                    sx={{ width: 60, height: 60 }}
                  />
                </TableCell>
                <TableCell>{room.name}</TableCell>
                <TableCell>{room.movie_title}</TableCell>
                <TableCell>
                  <Chip 
                    label={`${room.fila} x ${room.columna} (${room.fila * room.columna} asientos)`} 
                    color="primary" 
                    variant="outlined" 
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="primary"
                    onClick={() => onEdit(room)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => handleDeleteClick(room)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rooms.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay salas disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar la sala "{selectedRoom?.name}"? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoomsTable;