import React, { useState, useEffect } from 'react';
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
  Alert,
  Avatar,
  Paper,
  Divider,
  Badge,
  Tooltip,
  Zoom,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Skeleton
} from '@mui/material';
import { 
  Add, 
  Delete, 
  Edit, 
  Save, 
  Cancel, 
  PersonAdd, 
  MedicalServices,
  LocalShipping,
  ListAlt, 
  AccessTime, 
  CheckCircle,
  ErrorOutline,
  WarningAmber,
  Info as InfoIcon,
  SaveAlt
} from '@mui/icons-material';

// IG NRW Standard Sichtungskategorien mit verbesserten Beschreibungen
const TRIAGE_CATEGORIES = {
  1: {
    id: 1,
    label: 'Kategorie 1 - Kritisch',
    color: '#d32f2f',
    description: 'Akut lebensbedrohlich, sofortige Behandlung erforderlich',
    icon: <ErrorOutline />
  },
  2: {
    id: 2,
    label: 'Kategorie 2 - Dringlich', 
    color: '#f57c00',
    description: 'Potenziell lebensbedrohlich, Behandlung innerhalb 30 Min',
    icon: <WarningAmber />
  },
  3: {
    id: 3,
    label: 'Kategorie 3 - Normal',
    color: '#2e7d32',
    description: 'Nicht lebensbedrohlich, Behandlung planbar',
    icon: <CheckCircle />
  }
};

const PVADialog = ({ open, onClose, hospital, capacity, pvaList = [], onSavePva, onDeletePva }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // States für Tabs und Stepper
  const [tabValue, setTabValue] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // PVA States
  const [editingPva, setEditingPva] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [newPva, setNewPva] = useState({
    id: Date.now(),
    patientInfo: {
      name: '',
      age: '',
      gender: '',
      symptoms: ''
    },
    triageCategory: 1,
    arrivalTime: new Date().toISOString(),
    hospital: hospital?.name || '',
    capacity: capacity?.name || '',
    status: 'angemeldet'
  });

  // Reset form wenn Dialog geöffnet/geschlossen wird
  useEffect(() => {
    if (open) {
      setFormErrors({});
    } else {
      resetForm();
      setActiveStep(0);
    }
  }, [open]);

  const resetForm = () => {
    setNewPva({
      id: Date.now(),
      patientInfo: {
        name: '',
        age: '',
        gender: '',
        symptoms: ''
      },
      triageCategory: 1,
      arrivalTime: new Date().toISOString(),
      hospital: hospital?.name || '',
      capacity: capacity?.name || '',
      status: 'angemeldet'
    });
    setEditingPva(null);
    setFormErrors({});
    setActiveStep(0);
  };

  // Validierung für Stepper
  const validateStep = (step) => {
    const errors = {};
    
    if (step === 0) {
      if (!newPva.patientInfo.name.trim()) {
        errors.name = 'Name ist erforderlich';
      }
      if (!newPva.patientInfo.symptoms.trim()) {
        errors.symptoms = 'Symptome sind erforderlich';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      // Direkt zur Liste springen, da wir nur einen Schritt haben
      setTabValue(1);
    }
  };

  const handleSave = async () => {
    if (!newPva.patientInfo.name || !newPva.patientInfo.symptoms) {
      setFormErrors({
        ...formErrors,
        name: !newPva.patientInfo.name ? 'Name ist erforderlich' : '',
        symptoms: !newPva.patientInfo.symptoms ? 'Symptome sind erforderlich' : ''
      });
      setTabValue(0);
      setActiveStep(0);
      return;
    }

    // Simulieren wir ein Loading
    setLoading(true);
    setTimeout(() => {
      onSavePva(newPva, editingPva ? 'edit' : 'add');
      resetForm();
      setLoading(false);
      // Wechseln zur Liste nach dem Speichern
      setTabValue(3);
    }, 800);
  };

  const handleEdit = (pva) => {
    setEditingPva(pva.id);
    setNewPva(pva);
    setTabValue(0);
    setActiveStep(0);
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleDelete = (id) => {
    // Bestätigung Dialog würde hier in einer vollen Implementierung angezeigt werden
    onDeletePva({ id });
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue < 3) {
      setActiveStep(newValue);
    }
  };

  // Steps für den Stepper
  const steps = [
    { label: 'Patientendaten', icon: <PersonAdd /> }
  ];

  // Render Funktionen für Tab-Inhalte
  const renderPatientInfoTab = () => (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, backgroundColor: '#fafafa' }}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
        <PersonAdd sx={{ mr: 1, color: 'primary.main' }} />
        Patienteninformationen
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <TextField
            fullWidth
            label="Patientenname"
            value={newPva.patientInfo.name}
            onChange={(e) => setNewPva(prev => ({
              ...prev,
              patientInfo: { ...prev.patientInfo, name: e.target.value }
            }))}
            required
            error={!!formErrors.name}
            helperText={formErrors.name}
            InputProps={{
              startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>👤</Box>
            }}
            placeholder="Name des Patienten"
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Alter"
            type="number"
            value={newPva.patientInfo.age}
            onChange={(e) => setNewPva(prev => ({
              ...prev,
              patientInfo: { ...prev.patientInfo, age: e.target.value }
            }))}
            InputProps={{
              startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>🔢</Box>
            }}
            placeholder="Alter in Jahren"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Geschlecht</InputLabel>
            <Select
              value={newPva.patientInfo.gender}
              onChange={(e) => setNewPva(prev => ({
                ...prev,
                patientInfo: { ...prev.patientInfo, gender: e.target.value }
              }))}
              startAdornment={<Box sx={{ mr: 1, ml: 1, color: 'text.secondary' }}>👥</Box>}
            >
              <MenuItem value="">
                <em>Bitte wählen</em>
              </MenuItem>
              <MenuItem value="m">Männlich</MenuItem>
              <MenuItem value="w">Weiblich</MenuItem>
              <MenuItem value="d">Divers</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Symptome/Beschwerden"
            value={newPva.patientInfo.symptoms}
            onChange={(e) => setNewPva(prev => ({
              ...prev,
              patientInfo: { ...prev.patientInfo, symptoms: e.target.value }
            }))}
            multiline
            rows={3}
            required
            error={!!formErrors.symptoms}
            helperText={formErrors.symptoms}
            InputProps={{
              startAdornment: <Box sx={{ mr: 1, mt: 1, color: 'text.secondary' }}>🩺</Box>
            }}
            placeholder="Beschreiben Sie die Hauptsymptome und Beschwerden"
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const renderMedicalInfoTab = () => (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, backgroundColor: '#fafafa' }}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
        <MedicalServices sx={{ mr: 1, color: 'primary.main' }} />
        Medizinische Informationen
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Sichtungskategorie nach IG NRW
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {Object.values(TRIAGE_CATEGORIES).map(cat => (
                <Button
                  key={cat.id}
                  variant={newPva.triageCategory === cat.id ? "contained" : "outlined"}
                  startIcon={cat.icon}
                  onClick={() => setNewPva(prev => ({
                    ...prev,
                    triageCategory: cat.id,
                    medicalInfo: { ...prev.medicalInfo, category: cat.id }
                  }))}
                  sx={{
                    borderColor: cat.color,
                    backgroundColor: newPva.triageCategory === cat.id ? cat.color : 'transparent',
                    color: newPva.triageCategory === cat.id ? '#fff' : cat.color,
                    '&:hover': {
                      backgroundColor: newPva.triageCategory === cat.id ? cat.color : `${cat.color}22`,
                    },
                    flexGrow: 1,
                    minWidth: '100px',
                    textTransform: 'none'
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {cat.label.split(' - ')[0]}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      {cat.label.split(' - ')[1]}
                    </Typography>
                  </Box>
                </Button>
              ))}
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
              {TRIAGE_CATEGORIES[newPva.triageCategory]?.description}
            </Typography>
          </Box>
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
            placeholder="z.B. V.a. Herzinfarkt, Pneumonie, Polytrauma"
            InputProps={{
              startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>📋</Box>
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Vitalwerte"
            value={newPva.medicalInfo.vitals}
            onChange={(e) => setNewPva(prev => ({
              ...prev,
              medicalInfo: { ...prev.medicalInfo, vitals: e.target.value }
            }))}
            placeholder="z.B. RR 120/80, Puls 85, SpO2 97%"
            InputProps={{
              startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>❤️</Box>
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Bisherige Behandlung"
            value={newPva.medicalInfo.treatments}
            onChange={(e) => setNewPva(prev => ({
              ...prev,
              medicalInfo: { ...prev.medicalInfo, treatments: e.target.value }
            }))}
            placeholder="z.B. O2-Gabe, Medikamente, i.v. Zugang"
            InputProps={{
              startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>💊</Box>
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const renderLogisticsTab = () => (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, backgroundColor: '#fafafa' }}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
        <LocalShipping sx={{ mr: 1, color: 'primary.main' }} />
        Logistik & Transport
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Transportmittel</InputLabel>
            <Select
              value={newPva.logisticsInfo.transportMethod}
              onChange={(e) => setNewPva(prev => ({
                ...prev,
                logisticsInfo: { ...prev.logisticsInfo, transportMethod: e.target.value }
              }))}
              startAdornment={<Box sx={{ mr: 1, ml: 1, color: 'text.secondary' }}>🚑</Box>}
            >
              <MenuItem value="">
                <em>Bitte wählen</em>
              </MenuItem>
              <MenuItem value="RTW">RTW</MenuItem>
              <MenuItem value="NAW">NAW</MenuItem>
              <MenuItem value="KTW">KTW</MenuItem>
              <MenuItem value="RTH">RTH</MenuItem>
              <MenuItem value="ITW">ITW</MenuItem>
              <MenuItem value="Privat">Privat</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
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
            InputProps={{
              startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>🕒</Box>
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Priorität</InputLabel>
            <Select
              value={newPva.logisticsInfo.priority}
              onChange={(e) => setNewPva(prev => ({
                ...prev,
                logisticsInfo: { ...prev.logisticsInfo, priority: e.target.value }
              }))}
              startAdornment={<Box sx={{ mr: 1, ml: 1, color: 'text.secondary' }}>🔄</Box>}
            >
              <MenuItem value="high">
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#d32f2f' }}>
                  <ErrorOutline fontSize="small" sx={{ mr: 1 }} />
                  Hoch
                </Box>
              </MenuItem>
              <MenuItem value="normal">
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#f57c00' }}>
                  <WarningAmber fontSize="small" sx={{ mr: 1 }} />
                  Normal
                </Box>
              </MenuItem>
              <MenuItem value="low">
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#2e7d32' }}>
                  <CheckCircle fontSize="small" sx={{ mr: 1 }} />
                  Niedrig
                </Box>
              </MenuItem>
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
            InputProps={{
              startAdornment: <Box sx={{ mr: 1, mt: 1, color: 'text.secondary' }}>ℹ️</Box>
            }}
          />
        </Grid>
      </Grid>
    </Paper>
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
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <ListAlt sx={{ mr: 1, color: 'primary.main' }} />
            Aktuelle Voranmeldungen
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            color="primary"
            onClick={() => {
              resetForm();
              setTabValue(0);
            }}
            size="small"
            sx={{ textTransform: 'none', borderRadius: 20 }}
          >
            Neue PVA
          </Button>
        </Box>
        
        <Paper sx={{ maxHeight: 400, overflow: 'auto', borderRadius: 2 }} elevation={0}>
          <List disablePadding>
            {sortedPvas.map((pva) => (
              <ListItem 
                key={pva.id} 
                divider 
                sx={{
                  borderLeft: `4px solid ${TRIAGE_CATEGORIES[pva.triageCategory]?.color || '#666'}`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: TRIAGE_CATEGORIES[pva.triageCategory]?.color || '#666',
                      width: 36,
                      height: 36,
                      mr: 2,
                      fontSize: '0.9rem'
                    }}
                  >
                    {pva.triageCategory}
                  </Avatar>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {pva.patientInfo.name}
                      </Typography>
                      {pva.patientInfo.age && (
                        <Chip 
                          label={`${pva.patientInfo.age}J${pva.patientInfo.gender ? (pva.patientInfo.gender === 'm' ? '♂' : pva.patientInfo.gender === 'w' ? '♀' : '⚧') : ''}`}
                          size="small"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                      <Chip 
                        label={TRIAGE_CATEGORIES[pva.triageCategory]?.label || 'Unbekannt'} 
                        size="small" 
                        sx={{ 
                          backgroundColor: TRIAGE_CATEGORIES[pva.triageCategory]?.color || '#666',
                          color: 'white',
                          fontSize: '0.75rem',
                          height: 20
                        }} 
                      />
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary" noWrap sx={{ maxWidth: '90%' }}>
                      {pva.patientInfo.symptoms}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                      <Tooltip title="Voraussichtliche Ankunft" arrow>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTime sx={{ fontSize: '0.9rem', color: 'text.secondary', mr: 0.5 }} />
                          <Typography variant="caption" color="textSecondary">
                            {new Date(pva.arrivalTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                            {pva.logisticsInfo.estimatedArrival && ` → ${pva.logisticsInfo.estimatedArrival}`}
                          </Typography>
                        </Box>
                      </Tooltip>
                      
                      {pva.logisticsInfo.transportMethod && (
                        <Tooltip title="Transportmittel" arrow>
                          <Chip 
                            label={pva.logisticsInfo.transportMethod} 
                            size="small"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        </Tooltip>
                      )}
                      
                      {pva.medicalInfo.diagnosis && (
                        <Tooltip title="Diagnose" arrow>
                          <Typography variant="caption" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                            {pva.medicalInfo.diagnosis}
                          </Typography>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                  
                  <Box>
                    <IconButton onClick={() => handleEdit(pva)} size="small" color="primary">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(pva.id)} size="small" color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </ListItem>
            ))}
            
            {pvaList.length === 0 && (
              <ListItem>
                <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                  <ListAlt sx={{ fontSize: 40, color: '#ccc', mb: 1 }} />
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Keine Voranmeldungen vorhanden
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Fügen Sie eine neue Patientenvoranmeldung hinzu
                  </Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<Add />} 
                    sx={{ mt: 2, textTransform: 'none' }}
                    onClick={() => {
                      resetForm();
                      setTabValue(0);
                    }}
                  >
                    Neue PVA erstellen
                  </Button>
                </Box>
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>
    );
  };

  // Dialog-Header mit Status-Anzeige und Informationen
  const renderDialogHeader = () => {
    const selectedCategory = TRIAGE_CATEGORIES[newPva.triageCategory];
    
    return (
      <Box sx={{ position: 'relative' }}>
        <DialogTitle sx={{ 
          pb: 1,
          borderBottom: '1px solid #eee',
          backgroundColor: tabValue === 3 ? '#fff' : '#f9f9f9',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  tabValue < 3 ? (
                    <Avatar
                      sx={{
                        width: 22,
                        height: 22,
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        bgcolor: selectedCategory?.color || '#666'
                      }}
                    >
                      {newPva.triageCategory}
                    </Avatar>
                  ) : null
                }
              >
                <Avatar sx={{ bgcolor: 'primary.main', mr: 1.5 }}>
                  {tabValue === 3 ? <ListAlt /> : <PersonAdd />}
                </Avatar>
              </Badge>
              
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {editingPva ? 'PVA bearbeiten' : 'Neue Patientenvoranmeldung'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {hospital?.name} - {capacity?.name}
                </Typography>
              </Box>
            </Box>
            
            {tabValue < 3 && (
              <Chip 
                label={`Schritt ${activeStep + 1} von 3`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </DialogTitle>
        
        {tabValue === 0 && (
          <Stepper 
            activeStep={0} 
            alternativeLabel 
            sx={{ 
              pt: 3, 
              px: 2, 
              backgroundColor: '#f9f9f9',
              borderBottom: '1px solid #eee'
            }}
          >
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel 
                  StepIconProps={{ 
                    icon: step.icon
                  }}
                >
                  <Typography variant="caption">{step.label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
      </Box>
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
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
      {renderDialogHeader()}
      
      <DialogContent sx={{ px: { xs: 2, md: 3 }, pt: 3, pb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{
              '.MuiTab-root': {
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                minHeight: 48
              }
            }}
          >
            <Tab 
              label="Patientendaten" 
              icon={<PersonAdd />} 
              iconPosition="start" 
              sx={{ color: formErrors.name || formErrors.symptoms ? 'error.main' : undefined }}
            />
            <Tab label="PVA-Liste" icon={<ListAlt />} iconPosition="start" />
          </Tabs>
        </Box>

        {tabValue === 0 && renderPatientInfoTab()}
        {tabValue === 1 && renderPvaList()}

        {tabValue !== 3 && (
          <Alert 
            severity="info" 
            variant="outlined"
            icon={<InfoIcon />}
            sx={{ mt: 3, mb: 0, borderRadius: 2 }}
          >
            <Typography variant="body2">
              <strong>Hinweis:</strong> Sichtungskategorien nach IG NRW Standard: 
              <Box component="span" sx={{ color: '#d32f2f', fontWeight: 'bold', mx: 0.5 }}>1 = Kritisch</Box> • 
              <Box component="span" sx={{ color: '#f57c00', fontWeight: 'bold', mx: 0.5 }}>2 = Dringlich</Box> • 
              <Box component="span" sx={{ color: '#2e7d32', fontWeight: 'bold', mx: 0.5 }}>3 = Normal</Box>
            </Typography>
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eee' }}>
        {tabValue === 3 ? (
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{ borderRadius: 20, px: 3, textTransform: 'none' }}
          >
            Schließen
          </Button>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button 
              onClick={handleCancel} 
              startIcon={<Cancel />}
              sx={{ textTransform: 'none', color: 'text.secondary' }}
            >
              {editingPva ? 'Abbrechen' : 'Zurücksetzen'}
            </Button>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                onClick={handleSave} 
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : (editingPva ? <Save /> : <Add />)}
                variant="contained"
                disabled={loading}
                sx={{ 
                  borderRadius: 20, 
                  px: 3,
                  textTransform: 'none',
                  bgcolor: TRIAGE_CATEGORIES[newPva.triageCategory]?.color,
                  '&:hover': {
                    bgcolor: TRIAGE_CATEGORIES[newPva.triageCategory]?.color + 'dd',
                  }
                }}
              >
                {loading ? 'Wird gespeichert...' : (editingPva ? 'Aktualisieren' : 'PVA hinzufügen')}
              </Button>
            </Box>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PVADialog;
