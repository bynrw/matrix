import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Chip,
  Tabs,
  Tab,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import { Add, Delete, Edit, Save, Cancel } from '@mui/icons-material';

// IG NRW Standard Sichtungskategorien
const TRIAGE_CATEGORIES = {
  1: {
    id: 1,
    label: 'Kategorie 1 - Kritisch',
    color: '#d32f2f',
    description: 'Akut lebensbedrohlich, sofortige Behandlung erforderlich'
  },
  2: {
    id: 2,
    label: 'Kategorie 2 - Dringlich', 
    color: '#f57c00',
    description: 'Potenziell lebensbedrohlich, Behandlung innerhalb 30 Min'
  },
  3: {
    id: 3,
    label: 'Kategorie 3 - Normal',
    color: '#2e7d32',
    description: 'Nicht lebensbedrohlich, Behandlung planbar'
  }
};

const PVADialog = ({ open, onClose, hospital, capacity, pvaList, onSavePva, onDeletePva }) => {
  const [tabValue, setTabValue] = useState(0);
  const [editingPva, setEditingPva] = useState(null);
  const [newPva, setNewPva] = useState({
    id: Date.now(),
    patientInfo: {
      name: '',
      age: '',
      gender: '',
      symptoms: ''
    },
    medicalInfo: {
      diagnosis: '',
      vitals: '',
      treatments: '',
      category: ''
    },
    logisticsInfo: {
      transportMethod: '',
      estimatedArrival: '',
      priority: 'normal',
      specialRequirements: ''
    },
    triageCategory: 1,
    arrivalTime: new Date().toISOString(),
    hospital: hospital?.name || '',
    capacity: capacity?.name || '',
    status: 'angemeldet'
  });

  const resetForm = () => {
    setNewPva({
      id: Date.now(),
      patientInfo: {
        name: '',
        age: '',
        gender: '',
        symptoms: ''
      },
      medicalInfo: {
        diagnosis: '',
        vitals: '',
        treatments: '',
        category: ''
      },
      logisticsInfo: {
        transportMethod: '',
        estimatedArrival: '',
        priority: 'normal',
        specialRequirements: ''
      },
      triageCategory: 1,
      arrivalTime: new Date().toISOString(),
      hospital: hospital?.name || '',
      capacity: capacity?.name || '',
      status: 'angemeldet'
    });
    setEditingPva(null);
  };

  const handleSave = () => {
    if (!newPva.patientInfo.name || !newPva.patientInfo.symptoms) {
      alert('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    onSavePva(newPva);
    resetForm();
  };

  const handleEdit = (pva) => {
    setEditingPva(pva.id);
    setNewPva(pva);
    setTabValue(0);
  };

  const handleCancel = () => {
    resetForm();
  };

  const renderPatientInfoTab = () => (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid item xs={8}>
        <TextField
          fullWidth
          label="Patientenname *"
          value={newPva.patientInfo.name}
          onChange={(e) => setNewPva(prev => ({
            ...prev,
            patientInfo: { ...prev.patientInfo, name: e.target.value }
          }))}
          required
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          fullWidth
          label="Alter"
          type="number"
          value={newPva.patientInfo.age}
          onChange={(e) => setNewPva(prev => ({
            ...prev,
            patientInfo: { ...prev.patientInfo, age: e.target.value }
          }))}
          required
        />
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Geschlecht</InputLabel>
          <Select
            value={newPva.patientInfo.gender}
            onChange={(e) => setNewPva(prev => ({
              ...prev,
              patientInfo: { ...prev.patientInfo, gender: e.target.value }
            }))}
          >
            <MenuItem value="m">Männlich</MenuItem>
            <MenuItem value="w">Weiblich</MenuItem>
            <MenuItem value="d">Divers</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Symptome/Beschwerden *"
          value={newPva.patientInfo.symptoms}
          onChange={(e) => setNewPva(prev => ({
            ...prev,
            patientInfo: { ...prev.patientInfo, symptoms: e.target.value }
          }))}
          multiline
          rows={3}
          required
        />
      </Grid>
    </Grid>
  );

  const renderMedicalInfoTab = () => (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Sichtungskategorie nach IG NRW *</InputLabel>
          <Select
            value={newPva.triageCategory}
            onChange={(e) => setNewPva(prev => ({
              ...prev,
              triageCategory: e.target.value,
              medicalInfo: { ...prev.medicalInfo, category: e.target.value }
            }))}
          >
            {Object.values(TRIAGE_CATEGORIES).map(cat => (
              <MenuItem key={cat.id} value={cat.id}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: cat.color,
                      mr: 1,
                      border: '1px solid #ccc'
                    }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {cat.label}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {cat.description}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Diagnose/Verdachtsdiagnose"
          value={newPva.medicalInfo.diagnosis}
          onChange={(e) => setNewPva(prev => ({
            ...prev,
            medicalInfo: { ...prev.medicalInfo, diagnosis: e.target.value }
          }))}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Vitalwerte"
          value={newPva.medicalInfo.vitals}
          onChange={(e) => setNewPva(prev => ({
            ...prev,
            medicalInfo: { ...prev.medicalInfo, vitals: e.target.value }
          }))}
          placeholder="z.B. RR 120/80, Puls 85"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Bisherige Behandlung"
          value={newPva.medicalInfo.treatments}
          onChange={(e) => setNewPva(prev => ({
            ...prev,
            medicalInfo: { ...prev.medicalInfo, treatments: e.target.value }
          }))}
        />
      </Grid>
    </Grid>
  );

  const renderLogisticsTab = () => (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Transportmittel</InputLabel>
          <Select
            value={newPva.logisticsInfo.transportMethod}
            onChange={(e) => setNewPva(prev => ({
              ...prev,
              logisticsInfo: { ...prev.logisticsInfo, transportMethod: e.target.value }
            }))}
          >
            <MenuItem value="RTW">RTW</MenuItem>
            <MenuItem value="NAW">NAW</MenuItem>
            <MenuItem value="KTW">KTW</MenuItem>
            <MenuItem value="RTH">RTH</MenuItem>
            <MenuItem value="ITW">ITW</MenuItem>
            <MenuItem value="Privat">Privat</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Voraussichtliche Ankunft"
          type="time"
          value={newPva.logisticsInfo.estimatedArrival}
          onChange={(e) => setNewPva(prev => ({
            ...prev,
            logisticsInfo: { ...prev.logisticsInfo, estimatedArrival: e.target.value }
          }))}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Priorität</InputLabel>
          <Select
            value={newPva.logisticsInfo.priority}
            onChange={(e) => setNewPva(prev => ({
              ...prev,
              logisticsInfo: { ...prev.logisticsInfo, priority: e.target.value }
            }))}
          >
            <MenuItem value="high">Hoch</MenuItem>
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="low">Niedrig</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Besondere Anforderungen"
          value={newPva.logisticsInfo.specialRequirements}
          onChange={(e) => setNewPva(prev => ({
            ...prev,
            logisticsInfo: { ...prev.logisticsInfo, specialRequirements: e.target.value }
          }))}
          multiline
          rows={2}
          placeholder="z.B. Isolation, Rollstuhl, Übergewicht..."
        />
      </Grid>
    </Grid>
  );

  const renderPvaList = () => {
    // Sortierung nach IG NRW Standard: Sichtungskategorie, dann Ankunftszeit
    const sortedPvas = [...pvaList].sort((a, b) => {
      if (a.triageCategory !== b.triageCategory) {
        return a.triageCategory - b.triageCategory;
      }
      return new Date(a.arrivalTime) - new Date(b.arrivalTime);
    });

    return (
      <List sx={{ maxHeight: 400, overflow: 'auto' }}>
        {sortedPvas.map((pva) => (
          <ListItem key={pva.id} divider>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: TRIAGE_CATEGORIES[pva.triageCategory]?.color || '#666',
                      mr: 1
                    }}
                  />
                  <Typography variant="subtitle2">
                    {pva.patientInfo.name} ({pva.patientInfo.age}J)
                  </Typography>
                  <Chip 
                    label={TRIAGE_CATEGORIES[pva.triageCategory]?.label || 'Unbekannt'} 
                    size="small" 
                    sx={{ 
                      backgroundColor: TRIAGE_CATEGORIES[pva.triageCategory]?.color || '#666',
                      color: 'white',
                      fontSize: '0.75rem'
                    }} 
                  />
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    {pva.patientInfo.symptoms}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Ankunft: {new Date(pva.arrivalTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                    {pva.logisticsInfo.estimatedArrival && ` → ${pva.logisticsInfo.estimatedArrival}`}
                  </Typography>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => handleEdit(pva)} size="small">
                <Edit />
              </IconButton>
              <IconButton onClick={() => onDeletePva(pva.id)} size="small" color="error">
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        {pvaList.length === 0 && (
          <ListItem>
            <ListItemText 
              primary="Keine PVAs vorhanden" 
              secondary="Fügen Sie eine neue Patientenvoranmeldung hinzu"
            />
          </ListItem>
        )}
      </List>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        PVA - Patientenvoranmeldungen
        <Typography variant="subtitle2" color="textSecondary">
          {hospital?.name} - {capacity?.name}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Patientendaten" />
            <Tab label="Medizinische Daten" />
            <Tab label="Logistik" />
            <Tab label="PVA-Liste" />
          </Tabs>
        </Box>

        {tabValue === 0 && renderPatientInfoTab()}
        {tabValue === 1 && renderMedicalInfoTab()}
        {tabValue === 2 && renderLogisticsTab()}
        {tabValue === 3 && renderPvaList()}

        {tabValue !== 3 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="caption">
              Sichtungskategorien nach IG NRW Standard: 
              1 = Kritisch (rot), 2 = Dringlich (gelb), 3 = Normal (grün)
            </Typography>
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        {tabValue !== 3 && (
          <>
            <Button onClick={handleCancel} startIcon={<Cancel />}>
              {editingPva ? 'Abbrechen' : 'Zurücksetzen'}
            </Button>
            <Button 
              onClick={handleSave} 
              variant="contained" 
              startIcon={editingPva ? <Save /> : <Add />}
              disabled={!newPva.patientInfo.name || !newPva.patientInfo.symptoms}
            >
              {editingPva ? 'Aktualisieren' : 'Hinzufügen'}
            </Button>
          </>
        )}
        <Button onClick={onClose}>
          Schließen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PVADialog;
