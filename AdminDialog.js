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
  Tabs,
  Tab,
  Box,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Edit,
  Delete,
  DragHandle,
  ExpandMore,
  Save,
  Email,
  Refresh
} from '@mui/icons-material';

function AdminDialog({ open, onClose, hospitals, capacities, serviceGroups, onSave }) {
  const [currentTab, setCurrentTab] = useState(0);
  const [editingHospital, setEditingHospital] = useState(null);
  const [editingCapacity, setEditingCapacity] = useState(null);
  const [editingService, setEditingService] = useState(null);
  
  // Krankenhaus-Formular
  const [hospitalForm, setHospitalForm] = useState({
    name: '',
    alias: '',
    active: true,
    address: '',
    phone: '',
    email: '',
    contactPerson: ''
  });

  // Kapazität-Formular
  const [capacityForm, setCapacityForm] = useState({
    name: '',
    description: '',
    category: 'capacity'
  });

  // Service-Formular  
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    category: 'service'
  });

  // System-Konfiguration
  const [systemConfig, setSystemConfig] = useState({
    autoFreeTimes: ['06:00', '14:00', '22:00'],
    backupEmail: '',
    refreshInterval: 5,
    externalUrl: '',
    enablePushNotifications: true,
    enableEmailAlerts: true,
    maxPvaPerDay: 50,
    emergencyContacts: []
  });

  const resetHospitalForm = () => {
    setHospitalForm({
      name: '',
      alias: '',
      active: true,
      address: '',
      phone: '',
      email: '',
      contactPerson: ''
    });
    setEditingHospital(null);
  };

  const resetCapacityForm = () => {
    setCapacityForm({
      name: '',
      description: '',
      category: 'capacity'
    });
    setEditingCapacity(null);
  };

  const resetServiceForm = () => {
    setServiceForm({
      name: '',
      description: '',
      category: 'service'
    });
    setEditingService(null);
  };

  const handleSaveHospital = () => {
    if (!hospitalForm.name.trim()) {
      alert('Bitte geben Sie einen Krankenhausnamen ein');
      return;
    }

    const hospitalData = {
      ...hospitalForm,
      id: editingHospital ? editingHospital.id : Date.now()
    };

    onSave('hospital', hospitalData, editingHospital ? 'edit' : 'add');
    resetHospitalForm();
  };

  const handleSaveCapacity = () => {
    if (!capacityForm.name.trim()) {
      alert('Bitte geben Sie einen Namen für die Kapazität ein');
      return;
    }

    const capacityData = {
      ...capacityForm,
      id: editingCapacity ? editingCapacity.id : Date.now()
    };

    onSave('capacity', capacityData, editingCapacity ? 'edit' : 'add');
    resetCapacityForm();
  };

  const handleSaveService = () => {
    if (!serviceForm.name.trim()) {
      alert('Bitte geben Sie einen Namen für die Leistungsgruppe ein');
      return;
    }

    const serviceData = {
      ...serviceForm,
      id: editingService ? editingService.id : Date.now()
    };

    onSave('service', serviceData, editingService ? 'edit' : 'add');
    resetServiceForm();
  };

  const handleEditHospital = (hospital) => {
    setEditingHospital(hospital);
    setHospitalForm({ ...hospital });
  };

  const handleEditCapacity = (capacity) => {
    setEditingCapacity(capacity);
    setCapacityForm({ ...capacity });
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({ ...service });
  };

  const handleDeleteItem = (type, id) => {
    if (window.confirm('Möchten Sie diesen Eintrag wirklich löschen?')) {
      onSave(type, { id }, 'delete');
    }
  };

  const renderHospitalTab = () => (
    <Box>
      {/* Krankenhaus-Liste */}
      <Typography variant="h6" gutterBottom>
        Krankenhäuser verwalten
      </Typography>
      
      <List>
        {hospitals.map((hospital, index) => (
          <ListItem 
            key={hospital.id}
            sx={{ 
              border: 1, 
              borderColor: 'divider', 
              borderRadius: 1, 
              mb: 1,
              backgroundColor: hospital.active ? 'inherit' : '#f5f5f5'
            }}
          >
            <IconButton size="small">
              <DragHandle />
            </IconButton>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {hospital.name}
                  {hospital.alias && (
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                      ({hospital.alias})
                    </Typography>
                  )}
                  {!hospital.active && (
                    <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                      INAKTIV
                    </Typography>
                  )}
                </Box>
              }
              secondary={`${hospital.address || 'Keine Adresse'} | ${hospital.phone || 'Keine Telefonnummer'}`}
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => handleEditHospital(hospital)} size="small">
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDeleteItem('hospital', hospital.id)} size="small">
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Neues Krankenhaus */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>
            {editingHospital ? 'Krankenhaus bearbeiten' : 'Neues Krankenhaus hinzufügen'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Krankenhausname *"
                value={hospitalForm.name}
                onChange={(e) => setHospitalForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Alias/Kurzname"
                value={hospitalForm.alias}
                onChange={(e) => setHospitalForm(prev => ({ ...prev, alias: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                value={hospitalForm.address}
                onChange={(e) => setHospitalForm(prev => ({ ...prev, address: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefon"
                value={hospitalForm.phone}
                onChange={(e) => setHospitalForm(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="E-Mail"
                type="email"
                value={hospitalForm.email}
                onChange={(e) => setHospitalForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ansprechpartner"
                value={hospitalForm.contactPerson}
                onChange={(e) => setHospitalForm(prev => ({ ...prev, contactPerson: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={hospitalForm.active}
                    onChange={(e) => setHospitalForm(prev => ({ ...prev, active: e.target.checked }))}
                  />
                }
                label="Krankenhaus aktiv"
              />
            </Grid>
            <Grid item xs={12}>
              <Button onClick={resetHospitalForm} sx={{ mr: 1 }}>
                Abbrechen
              </Button>
              <Button onClick={handleSaveHospital} variant="contained">
                {editingHospital ? 'Ändern' : 'Hinzufügen'}
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  const renderCapacitiesTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Versorgungskapazitäten verwalten
      </Typography>
      
      <List>
        {capacities.map((capacity) => (
          <ListItem 
            key={capacity.id}
            sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}
          >
            <IconButton size="small">
              <DragHandle />
            </IconButton>
            <ListItemText
              primary={capacity.name}
              secondary={capacity.description}
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => handleEditCapacity(capacity)} size="small">
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDeleteItem('capacity', capacity.id)} size="small">
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>
            {editingCapacity ? 'Kapazität bearbeiten' : 'Neue Kapazität hinzufügen'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Kapazitätsname *"
                value={capacityForm.name}
                onChange={(e) => setCapacityForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Beschreibung"
                value={capacityForm.description}
                onChange={(e) => setCapacityForm(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <Button onClick={resetCapacityForm} sx={{ mr: 1 }}>
                Abbrechen
              </Button>
              <Button onClick={handleSaveCapacity} variant="contained">
                {editingCapacity ? 'Ändern' : 'Hinzufügen'}
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  const renderServicesTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Leistungsgruppen verwalten
      </Typography>
      
      <List>
        {serviceGroups.map((service) => (
          <ListItem 
            key={service.id}
            sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}
          >
            <ListItemText
              primary={service.name}
              secondary={service.description}
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => handleEditService(service)} size="small">
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDeleteItem('service', service.id)} size="small">
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>
            {editingService ? 'Leistungsgruppe bearbeiten' : 'Neue Leistungsgruppe hinzufügen'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name der Leistungsgruppe *"
                value={serviceForm.name}
                onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Beschreibung"
                value={serviceForm.description}
                onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <Button onClick={resetServiceForm} sx={{ mr: 1 }}>
                Abbrechen
              </Button>
              <Button onClick={handleSaveService} variant="contained">
                {editingService ? 'Ändern' : 'Hinzufügen'}
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  const renderSystemTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Systemkonfiguration
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Automatische Freimeldung
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Konfigurieren Sie bis zu 3 Uhrzeiten pro Tag für automatische Freimeldungen
          </Alert>
          
          {systemConfig.autoFreeTimes.map((time, index) => (
            <TextField
              key={index}
              type="time"
              label={`Freimeldung ${index + 1}`}
              value={time}
              onChange={(e) => {
                const newTimes = [...systemConfig.autoFreeTimes];
                newTimes[index] = e.target.value;
                setSystemConfig(prev => ({ ...prev, autoFreeTimes: newTimes }));
              }}
              sx={{ mr: 2, mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
          ))}
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Backup & Export
          </Typography>
          
          <TextField
            fullWidth
            label="Backup E-Mail Adresse"
            type="email"
            value={systemConfig.backupEmail}
            onChange={(e) => setSystemConfig(prev => ({ ...prev, backupEmail: e.target.value }))}
            helperText="Excel-Backup wird automatisch an diese Adresse gesendet"
            sx={{ mb: 2 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Refresh-Intervall (Minuten)"
            type="number"
            value={systemConfig.refreshInterval}
            onChange={(e) => setSystemConfig(prev => ({ ...prev, refreshInterval: parseInt(e.target.value) }))}
            inputProps={{ min: 1, max: 60 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Externe URL"
            value={systemConfig.externalUrl}
            onChange={(e) => setSystemConfig(prev => ({ ...prev, externalUrl: e.target.value }))}
            helperText="URL für externen Zugriff auf die Matrix"
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Benachrichtigungen
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={systemConfig.enablePushNotifications}
                onChange={(e) => setSystemConfig(prev => ({ ...prev, enablePushNotifications: e.target.checked }))}
              />
            }
            label="Push-Benachrichtigungen aktivieren"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={systemConfig.enableEmailAlerts}
                onChange={(e) => setSystemConfig(prev => ({ ...prev, enableEmailAlerts: e.target.checked }))}
              />
            }
            label="E-Mail-Alerts aktivieren"
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={() => onSave('system', systemConfig, 'update')}
            sx={{ mr: 1 }}
          >
            Konfiguration speichern
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Email />}
            onClick={() => alert('Backup wird gesendet...')}
            sx={{ mr: 1 }}
          >
            Backup jetzt senden
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
          >
            System neu laden
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Systemadministration</DialogTitle>
      
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab label="Krankenhäuser" />
            <Tab label="Kapazitäten" />
            <Tab label="Leistungsgruppen" />
            <Tab label="System" />
          </Tabs>
        </Box>

        {currentTab === 0 && renderHospitalTab()}
        {currentTab === 1 && renderCapacitiesTab()}
        {currentTab === 2 && renderServicesTab()}
        {currentTab === 3 && renderSystemTab()}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Schließen</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AdminDialog;
