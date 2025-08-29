import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Alert,
  Paper,
  Chip,
  Tooltip,
  Avatar,
  Badge,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Edit,
  Delete,
  DragHandle,
  ExpandMore,
  Save,
  Email,
  Refresh,
  Add,
  LocalHospital,
  Settings,
  Construction,
  GroupWork,
  CloudSync,
  ExpandLess,
  Check,
  Warning,
  Info,
  ErrorOutline,
  Cancel,
  ContactPhone,
  Notifications
} from '@mui/icons-material';

function AdminDialog({ open, onClose, hospitals, capacities, serviceGroups, onSave }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [currentTab, setCurrentTab] = useState(0);
  const [editingHospital, setEditingHospital] = useState(null);
  const [editingCapacity, setEditingCapacity] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [accordionExpanded, setAccordionExpanded] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
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

  // Reset Form Funktionen
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
    setAccordionExpanded(false);
    setFormErrors({});
  };

  const resetCapacityForm = () => {
    setCapacityForm({
      name: '',
      description: '',
      category: 'capacity'
    });
    setEditingCapacity(null);
    setAccordionExpanded(false);
    setFormErrors({});
  };

  const resetServiceForm = () => {
    setServiceForm({
      name: '',
      description: '',
      category: 'service'
    });
    setEditingService(null);
    setAccordionExpanded(false);
    setFormErrors({});
  };

  // Formular-Validierung
  const validateHospitalForm = () => {
    const errors = {};
    if (!hospitalForm.name.trim()) {
      errors.name = 'Name ist erforderlich';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateCapacityForm = () => {
    const errors = {};
    if (!capacityForm.name.trim()) {
      errors.name = 'Name ist erforderlich';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateServiceForm = () => {
    const errors = {};
    if (!serviceForm.name.trim()) {
      errors.name = 'Name ist erforderlich';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Speichern-Funktionen
  const handleSaveHospital = () => {
    if (!validateHospitalForm()) return;
    
    const action = editingHospital ? 'edit' : 'add';
    const hospital = {
      ...hospitalForm,
      id: editingHospital || Date.now()
    };
    
    onSave('hospital', hospital, action);
    resetHospitalForm();
  };

  const handleSaveCapacity = () => {
    if (!validateCapacityForm()) return;
    
    const action = editingCapacity ? 'edit' : 'add';
    const capacity = {
      ...capacityForm,
      id: editingCapacity || Date.now()
    };
    
    onSave('capacity', capacity, action);
    resetCapacityForm();
  };

  const handleSaveService = () => {
    if (!validateServiceForm()) return;
    
    const action = editingService ? 'edit' : 'add';
    const service = {
      ...serviceForm,
      id: editingService || Date.now()
    };
    
    onSave('service', service, action);
    resetServiceForm();
  };

  // Bearbeiten-Funktionen
  const handleEditHospital = (hospital) => {
    setHospitalForm({
      name: hospital.name,
      alias: hospital.alias || '',
      active: hospital.active,
      address: hospital.address || '',
      phone: hospital.phone || '',
      email: hospital.email || '',
      contactPerson: hospital.contactPerson || ''
    });
    setEditingHospital(hospital.id);
    setAccordionExpanded(true);
    setFormErrors({});
  };

  const handleEditCapacity = (capacity) => {
    setCapacityForm({
      name: capacity.name,
      description: capacity.description || '',
      category: capacity.category
    });
    setEditingCapacity(capacity.id);
    setAccordionExpanded(true);
    setFormErrors({});
  };

  const handleEditService = (service) => {
    setServiceForm({
      name: service.name,
      description: service.description || '',
      category: service.category
    });
    setEditingService(service.id);
    setAccordionExpanded(true);
    setFormErrors({});
  };

  // Löschen-Funktion
  const handleDeleteItem = (type, id) => {
    // In einer vollständigen Implementierung würde hier ein Bestätigungsdialog angezeigt werden
    onSave(type, { id }, 'delete');
  };

  // Tab-Panels rendern
  const renderHospitalTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalHospital sx={{ mr: 1, color: 'primary.main' }} />
          Krankenhäuser verwalten
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => {
            resetHospitalForm();
            setAccordionExpanded(true);
          }}
          size="small"
          sx={{ borderRadius: 20, textTransform: 'none' }}
        >
          Neues Krankenhaus
        </Button>
      </Box>
      
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          Krankenhausinformationen werden in der Matrix angezeigt und für Notfallkontakte verwendet.
          Sie können Krankenhäuser deaktivieren, ohne sie zu löschen.
        </Typography>
      </Alert>
      
      <Paper elevation={0} sx={{ borderRadius: 2, bgcolor: '#fafafa', mb: 3 }}>
        <List sx={{ py: 0 }}>
          {hospitals.map((hospital, index) => (
            <ListItem 
              key={hospital.id}
              sx={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 2, 
                mb: 1,
                backgroundColor: hospital.active ? 'inherit' : '#f5f5f5',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#f0f7ff',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: hospital.active ? 'primary.main' : 'text.disabled',
                    mr: 2
                  }}
                >
                  {hospital.alias ? hospital.alias.charAt(0) : hospital.name.charAt(0)}
                </Avatar>
                
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
                      {hospital.name}
                    </Typography>
                    
                    {hospital.alias && (
                      <Chip 
                        label={hospital.alias}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                    )}
                    
                    {!hospital.active && (
                      <Chip
                        label="Inaktiv"
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {hospital.address || 'Keine Adresse'} | {hospital.phone || 'Keine Telefonnummer'}
                  </Typography>
                </Box>
                
                <Box>
                  <Tooltip title="Bearbeiten" arrow>
                    <IconButton onClick={() => handleEditHospital(hospital)} size="small" color="primary">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Löschen" arrow>
                    <IconButton onClick={() => handleDeleteItem('hospital', hospital.id)} size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </ListItem>
          ))}
          
          {hospitals.length === 0 && (
            <ListItem>
              <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                <LocalHospital sx={{ fontSize: 40, color: '#ccc', mb: 1 }} />
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Keine Krankenhäuser vorhanden
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Fügen Sie Ihr erstes Krankenhaus hinzu
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<Add />} 
                  onClick={() => {
                    resetHospitalForm();
                    setAccordionExpanded(true);
                  }}
                  sx={{ mt: 2, textTransform: 'none' }}
                >
                  Krankenhaus hinzufügen
                </Button>
              </Box>
            </ListItem>
          )}
        </List>
      </Paper>
      
      <Accordion 
        expanded={accordionExpanded} 
        onChange={() => setAccordionExpanded(!accordionExpanded)}
        sx={{ 
          borderRadius: 2, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          '&:before': { display: 'none' },
          mb: 3
        }}
      >
        <AccordionSummary 
          expandIcon={accordionExpanded ? <ExpandLess /> : <ExpandMore />}
          sx={{ 
            backgroundColor: '#f5f8ff',
            borderRadius: accordionExpanded ? '8px 8px 0 0' : 2
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <Edit sx={{ mr: 1, fontSize: '1.2rem', color: 'primary.main' }} />
            {editingHospital ? 'Krankenhaus bearbeiten' : 'Neues Krankenhaus hinzufügen'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Krankenhausname"
                value={hospitalForm.name}
                onChange={(e) => setHospitalForm(prev => ({ ...prev, name: e.target.value }))}
                required
                error={!!formErrors.name}
                helperText={formErrors.name}
                placeholder="z.B. Universitätsklinikum Düsseldorf"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>🏥</Box>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Alias/Kurzname"
                value={hospitalForm.alias}
                onChange={(e) => setHospitalForm(prev => ({ ...prev, alias: e.target.value }))}
                placeholder="z.B. UKD"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>🔤</Box>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                value={hospitalForm.address}
                onChange={(e) => setHospitalForm(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Vollständige Anschrift"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>📍</Box>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefon"
                value={hospitalForm.phone}
                onChange={(e) => setHospitalForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="z.B. 0211-12345678"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>📞</Box>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="E-Mail"
                type="email"
                value={hospitalForm.email}
                onChange={(e) => setHospitalForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="z.B. notaufnahme@krankenhaus.de"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>📧</Box>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ansprechpartner"
                value={hospitalForm.contactPerson}
                onChange={(e) => setHospitalForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                placeholder="Name des Hauptansprechpartners"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>👤</Box>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={hospitalForm.active}
                    onChange={(e) => setHospitalForm(prev => ({ ...prev, active: e.target.checked }))}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Krankenhaus aktiv
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Inaktive Krankenhäuser werden in der Matrix angezeigt, aber als nicht teilnehmend markiert
                    </Typography>
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  onClick={resetHospitalForm} 
                  startIcon={<Cancel />}
                  sx={{ textTransform: 'none' }}
                >
                  Abbrechen
                </Button>
                <Button 
                  onClick={handleSaveHospital} 
                  variant="contained" 
                  startIcon={editingHospital ? <Save /> : <Add />}
                  sx={{ 
                    borderRadius: 20, 
                    px: 3,
                    textTransform: 'none'
                  }}
                >
                  {editingHospital ? 'Änderungen speichern' : 'Krankenhaus hinzufügen'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  const renderCapacitiesTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Construction sx={{ mr: 1, color: 'primary.main' }} />
          Versorgungskapazitäten verwalten
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => {
            resetCapacityForm();
            setAccordionExpanded(true);
          }}
          size="small"
          sx={{ borderRadius: 20, textTransform: 'none' }}
        >
          Neue Kapazität
        </Button>
      </Box>
      
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          Versorgungskapazitäten werden im ersten Tab der Matrix angezeigt und repräsentieren die wichtigsten Ressourcen jedes Krankenhauses.
        </Typography>
      </Alert>
      
      <Paper elevation={0} sx={{ borderRadius: 2, bgcolor: '#fafafa', mb: 3 }}>
        <List sx={{ py: 0 }}>
          {capacities.map((capacity) => (
            <ListItem 
              key={capacity.id}
              sx={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 2, 
                mb: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#f0f7ff',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main',
                    mr: 2
                  }}
                >
                  {capacity.name.charAt(0)}
                </Avatar>
                
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {capacity.name}
                  </Typography>
                  
                  {capacity.description && (
                    <Typography variant="body2" color="textSecondary" noWrap>
                      {capacity.description}
                    </Typography>
                  )}
                </Box>
                
                <Box>
                  <Tooltip title="Bearbeiten" arrow>
                    <IconButton onClick={() => handleEditCapacity(capacity)} size="small" color="primary">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Löschen" arrow>
                    <IconButton onClick={() => handleDeleteItem('capacity', capacity.id)} size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </ListItem>
          ))}
          
          {capacities.length === 0 && (
            <ListItem>
              <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                <Construction sx={{ fontSize: 40, color: '#ccc', mb: 1 }} />
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Keine Kapazitäten vorhanden
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<Add />} 
                  onClick={() => {
                    resetCapacityForm();
                    setAccordionExpanded(true);
                  }}
                  sx={{ mt: 2, textTransform: 'none' }}
                >
                  Kapazität hinzufügen
                </Button>
              </Box>
            </ListItem>
          )}
        </List>
      </Paper>
      
      <Accordion 
        expanded={accordionExpanded} 
        onChange={() => setAccordionExpanded(!accordionExpanded)}
        sx={{ 
          borderRadius: 2, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          '&:before': { display: 'none' },
          mb: 3
        }}
      >
        <AccordionSummary 
          expandIcon={accordionExpanded ? <ExpandLess /> : <ExpandMore />}
          sx={{ 
            backgroundColor: '#f5f8ff',
            borderRadius: accordionExpanded ? '8px 8px 0 0' : 2
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <Edit sx={{ mr: 1, fontSize: '1.2rem', color: 'primary.main' }} />
            {editingCapacity ? 'Kapazität bearbeiten' : 'Neue Kapazität hinzufügen'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Kapazitätsname"
                value={capacityForm.name}
                onChange={(e) => setCapacityForm(prev => ({ ...prev, name: e.target.value }))}
                required
                error={!!formErrors.name}
                helperText={formErrors.name}
                placeholder="z.B. Notaufnahme, Intensivstation, Stroke Unit"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>🔧</Box>
                }}
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
                placeholder="Kurze Beschreibung der Kapazität und ihrer Bedeutung"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, mt: 1, color: 'text.secondary' }}>📝</Box>
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  onClick={resetCapacityForm} 
                  startIcon={<Cancel />}
                  sx={{ textTransform: 'none' }}
                >
                  Abbrechen
                </Button>
                <Button 
                  onClick={handleSaveCapacity} 
                  variant="contained" 
                  startIcon={editingCapacity ? <Save /> : <Add />}
                  sx={{ 
                    borderRadius: 20, 
                    px: 3,
                    textTransform: 'none'
                  }}
                >
                  {editingCapacity ? 'Änderungen speichern' : 'Kapazität hinzufügen'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  const renderServicesTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <GroupWork sx={{ mr: 1, color: 'primary.main' }} />
          Leistungsgruppen verwalten
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => {
            resetServiceForm();
            setAccordionExpanded(true);
          }}
          size="small"
          sx={{ borderRadius: 20, textTransform: 'none' }}
        >
          Neue Leistungsgruppe
        </Button>
      </Box>
      
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          Leistungsgruppen werden im zweiten Tab der Matrix angezeigt und repräsentieren die medizinischen Fachabteilungen jedes Krankenhauses.
        </Typography>
      </Alert>
      
      <Paper elevation={0} sx={{ borderRadius: 2, bgcolor: '#fafafa', mb: 3 }}>
        <List sx={{ py: 0 }}>
          {serviceGroups.map((service) => (
            <ListItem 
              key={service.id}
              sx={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 2, 
                mb: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#f0f7ff',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'secondary.main',
                    mr: 2
                  }}
                >
                  {service.name.charAt(0)}
                </Avatar>
                
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {service.name}
                  </Typography>
                  
                  {service.description && (
                    <Typography variant="body2" color="textSecondary" noWrap>
                      {service.description}
                    </Typography>
                  )}
                </Box>
                
                <Box>
                  <Tooltip title="Bearbeiten" arrow>
                    <IconButton onClick={() => handleEditService(service)} size="small" color="primary">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Löschen" arrow>
                    <IconButton onClick={() => handleDeleteItem('service', service.id)} size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </ListItem>
          ))}
          
          {serviceGroups.length === 0 && (
            <ListItem>
              <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                <GroupWork sx={{ fontSize: 40, color: '#ccc', mb: 1 }} />
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Keine Leistungsgruppen vorhanden
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<Add />} 
                  onClick={() => {
                    resetServiceForm();
                    setAccordionExpanded(true);
                  }}
                  sx={{ mt: 2, textTransform: 'none' }}
                >
                  Leistungsgruppe hinzufügen
                </Button>
              </Box>
            </ListItem>
          )}
        </List>
      </Paper>
      
      <Accordion 
        expanded={accordionExpanded} 
        onChange={() => setAccordionExpanded(!accordionExpanded)}
        sx={{ 
          borderRadius: 2, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          '&:before': { display: 'none' },
          mb: 3
        }}
      >
        <AccordionSummary 
          expandIcon={accordionExpanded ? <ExpandLess /> : <ExpandMore />}
          sx={{ 
            backgroundColor: '#f5f8ff',
            borderRadius: accordionExpanded ? '8px 8px 0 0' : 2
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <Edit sx={{ mr: 1, fontSize: '1.2rem', color: 'primary.main' }} />
            {editingService ? 'Leistungsgruppe bearbeiten' : 'Neue Leistungsgruppe hinzufügen'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name der Leistungsgruppe"
                value={serviceForm.name}
                onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                required
                error={!!formErrors.name}
                helperText={formErrors.name}
                placeholder="z.B. Kardiologie, Neurologie, Allgemeinchirurgie"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>👥</Box>
                }}
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
                placeholder="Kurze Beschreibung der Leistungsgruppe und ihrer Kompetenzen"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, mt: 1, color: 'text.secondary' }}>📝</Box>
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  onClick={resetServiceForm} 
                  startIcon={<Cancel />}
                  sx={{ textTransform: 'none' }}
                >
                  Abbrechen
                </Button>
                <Button 
                  onClick={handleSaveService} 
                  variant="contained" 
                  startIcon={editingService ? <Save /> : <Add />}
                  sx={{ 
                    borderRadius: 20, 
                    px: 3,
                    textTransform: 'none'
                  }}
                >
                  {editingService ? 'Änderungen speichern' : 'Leistungsgruppe hinzufügen'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  const renderSystemTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Settings sx={{ mr: 1, color: 'primary.main' }} />
        Systemkonfiguration
      </Typography>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#fafafa', mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <Refresh sx={{ mr: 1, color: 'primary.main' }} />
              Automatische Freimeldung
            </Typography>
            <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
              <Typography variant="body2">
                Konfigurieren Sie bis zu 3 Uhrzeiten pro Tag für automatische Freimeldungen.
                Zu diesen Zeiten werden alle Status auf "Verfügbar" zurückgesetzt, sofern nicht überschrieben.
              </Typography>
            </Alert>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
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
                  InputLabelProps={{ shrink: true }}
                  sx={{ 
                    width: 150,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <Email sx={{ mr: 1, color: 'primary.main' }} />
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
              InputProps={{
                startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>📧</Box>
              }}
              placeholder="backup@leitstelle.de"
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
              helperText="Wie oft die Matrix automatisch aktualisiert wird"
              InputProps={{
                startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>🔄</Box>
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Externe URL"
              value={systemConfig.externalUrl}
              onChange={(e) => setSystemConfig(prev => ({ ...prev, externalUrl: e.target.value }))}
              helperText="URL für externen Zugriff auf die Matrix"
              InputProps={{
                startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>🔗</Box>
              }}
              placeholder="https://matrix.leitstelle.de"
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <Notifications sx={{ mr: 1, color: 'primary.main' }} />
              Benachrichtigungen
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={systemConfig.enablePushNotifications}
                    onChange={(e) => setSystemConfig(prev => ({ ...prev, enablePushNotifications: e.target.checked }))}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Push-Benachrichtigungen aktivieren
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Browser-Benachrichtigungen bei Statusänderungen und neuen PVAs
                    </Typography>
                  </Box>
                }
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={systemConfig.enableEmailAlerts}
                    onChange={(e) => setSystemConfig(prev => ({ ...prev, enableEmailAlerts: e.target.checked }))}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      E-Mail-Alerts aktivieren
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      E-Mail-Benachrichtigungen bei kritischen Statusänderungen
                    </Typography>
                  </Box>
                }
              />
            </Box>
            
            <TextField
              fullWidth
              label="Maximale PVAs pro Tag"
              type="number"
              value={systemConfig.maxPvaPerDay}
              onChange={(e) => setSystemConfig(prev => ({ ...prev, maxPvaPerDay: parseInt(e.target.value) }))}
              inputProps={{ min: 1 }}
              sx={{ mt: 2 }}
              helperText="Warnung anzeigen, wenn Limit überschritten wird"
              InputProps={{
                startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>📊</Box>
              }}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => onSave('system', systemConfig, 'update')}
                sx={{ 
                  borderRadius: 20, 
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
              >
                Konfiguration speichern
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Email />}
                onClick={() => alert('Backup wird gesendet...')}
                sx={{ 
                  borderRadius: 20,
                  textTransform: 'none'
                }}
              >
                Backup jetzt senden
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
                sx={{ 
                  borderRadius: 20,
                  textTransform: 'none'
                }}
              >
                System neu laden
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  // Dialog-Funktionen
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        borderBottom: '1px solid #eee',
        backgroundColor: '#f9f9f9',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 1.5 }}>
            <Settings />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Systemadministration
          </Typography>
        </Box>
      </DialogTitle>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#f9f9f9' }}>
        <Tabs 
          value={currentTab} 
          onChange={(e, newValue) => {
            setCurrentTab(newValue);
            setAccordionExpanded(false);
            resetHospitalForm();
            resetCapacityForm();
            resetServiceForm();
          }}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{
            px: 3,
            '.MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              minHeight: 48,
              py: 2
            }
          }}
        >
          <Tab 
            label="Krankenhäuser" 
            icon={<LocalHospital />} 
            iconPosition="start" 
          />
          <Tab 
            label="Kapazitäten" 
            icon={<Construction />} 
            iconPosition="start" 
          />
          <Tab 
            label="Leistungsgruppen" 
            icon={<GroupWork />} 
            iconPosition="start" 
          />
          <Tab 
            label="System" 
            icon={<CloudSync />} 
            iconPosition="start" 
          />
        </Tabs>
      </Box>
      
      <DialogContent sx={{ p: 3 }}>
        {currentTab === 0 && renderHospitalTab()}
        {currentTab === 1 && renderCapacitiesTab()}
        {currentTab === 2 && renderServicesTab()}
        {currentTab === 3 && renderSystemTab()}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eee' }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 20, px: 3, textTransform: 'none' }}
        >
          Schließen
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AdminDialog;
