import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Tab, 
  Tabs, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Tooltip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  FormControlLabel, 
  Checkbox, 
  IconButton,
  AppBar,
  Toolbar,
  Grid,
  Alert,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Menu,
  MenuItem as MenuOption,
  Fab,
  Card,
  CardContent,
  Chip,
  Breadcrumbs,
  Link,
  Divider,
  Container,
  Snackbar
} from '@mui/material';
import {
  Fullscreen,
  FullscreenExit,
  Refresh,
  Info,
  Settings,
  PersonAdd,
  GetApp,
  MoreVert,
  LocalHospital,
  Emergency,
  Home,
  Notifications,
  Dashboard,
  AccessTime,
  CheckCircle,
  Warning as WarningIcon,
  Error,
  Circle
} from '@mui/icons-material';
import PVADialog from './components/PVADialog';
import AdminDialog from './components/AdminDialog';
import './App.css';

// Status-Konstanten
const STATUS = {
  FREE: 'free',
  OVERLOADED: 'overloaded', 
  LIMITED: 'limited',
  INCAPACITATED: 'incapacitated',
  NOT_AVAILABLE: 'not_available',
  FUTURE_OVERLOAD: 'future_overload',
  INACTIVE: 'inactive'
};

// Farbkodierung
const STATUS_COLORS = {
  [STATUS.FREE]: '#4caf50', // grün
  [STATUS.OVERLOADED]: '#f44336', // rot
  [STATUS.LIMITED]: '#ff9800', // gelb
  [STATUS.INCAPACITATED]: '#000000', // schwarz
  [STATUS.NOT_AVAILABLE]: '#9e9e9e', // grau
  [STATUS.FUTURE_OVERLOAD]: '#a5d6a7', // hellgrün
  [STATUS.INACTIVE]: '#4caf50' // grün gestreift
};

// Kompakte Leitstellen-optimierte Übersicht - 6 Krankenhäuser für bessere Übersicht
const initialHospitals = [
  { id: 1, name: 'Universitätsklinikum Düsseldorf', alias: 'UKD', active: true },
  { id: 2, name: 'St. Martinus Krankenhaus', alias: 'SMK', active: true },
  { id: 3, name: 'Helios Klinikum', alias: 'HEL', active: false },
  { id: 4, name: 'Evangelisches Krankenhaus', alias: 'EVK', active: true },
  { id: 5, name: 'Marien Hospital', alias: 'MHD', active: true },
  { id: 6, name: 'St. Josef Krankenhaus', alias: 'SJK', active: true },
];

// Realistische Krankenhausabteilungen mit vollständigen Namen
const initialCapacities = [
  { id: 1, name: 'Notaufnahme', category: 'capacity' },
  { id: 2, name: 'Intensivstation', category: 'capacity' },
  { id: 3, name: 'Stroke Unit', category: 'capacity' },
  { id: 4, name: 'Herzkatheterlabor', category: 'capacity' },
  { id: 5, name: 'OP-Bereitschaft', category: 'capacity' },
  { id: 6, name: 'Kindernotaufnahme', category: 'capacity' },
  { id: 7, name: 'Psychiatrie', category: 'capacity' },
  { id: 8, name: 'Radiologie', category: 'capacity' },
  { id: 9, name: 'Labormedizin', category: 'capacity' },
  { id: 10, name: 'Dialyse', category: 'capacity' }
];

// Erweiterte Fachbereiche mit vollständigen Namen
const initialServiceGroups = [
  { id: 11, name: 'Kardiologie', category: 'service' },
  { id: 12, name: 'Neurologie', category: 'service' },
  { id: 13, name: 'Allgemeinchirurgie', category: 'service' },
  { id: 14, name: 'Innere Medizin', category: 'service' },
  { id: 15, name: 'Orthopädie', category: 'service' },
  { id: 16, name: 'Gynäkologie', category: 'service' },
  { id: 17, name: 'Urologie', category: 'service' },
  { id: 18, name: 'Hals-Nasen-Ohren', category: 'service' },
  { id: 19, name: 'Augenheilkunde', category: 'service' },
  { id: 20, name: 'Dermatologie', category: 'service' },
  { id: 21, name: 'Anästhesiologie', category: 'service' },
  { id: 22, name: 'Gastroenterologie', category: 'service' }
];

function App() {
  const [hospitals, setHospitals] = useState(initialHospitals);
  const [capacities, setCapacities] = useState(initialCapacities);
  const [serviceGroups, setServiceGroups] = useState(initialServiceGroups);
  const [currentTab, setCurrentTab] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [blackWhiteMode, setBlackWhiteMode] = useState(false);
  const [matrixData, setMatrixData] = useState({});
  const [pvaData, setPvaData] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [statusDialog, setStatusDialog] = useState(false);
  const [pvaDialog, setPvaDialog] = useState(false);
  const [legendDialog, setLegendDialog] = useState(false);
  const [adminDialog, setAdminDialog] = useState(false);
  const [refreshBlink, setRefreshBlink] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Matrix-Daten initialisieren
  useEffect(() => {
    const initMatrix = {};
    const initPva = {};
    hospitals.forEach(hospital => {
      [...capacities, ...serviceGroups].forEach(item => {
        const key = `${hospital.id}-${item.id}`;
        
        // Verschiedene Status-Beispiele für Demonstration - alle Status sichtbar machen
        let status = STATUS.FREE;
        let available = true;
        
        // WICHTIG: Wenn Krankenhaus inaktiv ist, sind Abteilungen verfügbar aber inaktiv markiert
        if (!hospital.active) {
          status = STATUS.INACTIVE;
          available = true; // Abteilungen sind verfügbar, aber Krankenhaus ist inaktiv
        } else {
          // Realistische Status-Verteilung für erweiterte Matrix
          const statusChance = Math.random();
          const hospitalFactor = hospital.id;
          const itemFactor = item.id;
          
          // Spezielle Status für bestimmte Kombinationen
          if (hospital.id === 1 && item.id === 2) {
            status = STATUS.OVERLOADED; // UKD Intensivstation
          } else if (hospital.id === 2 && item.id === 1) {
            status = STATUS.LIMITED; // SMK Notaufnahme
          } else if (hospital.id === 1 && item.id === 1) {
            status = STATUS.INCAPACITATED; // UKD Notaufnahme
          } else if (hospital.id === 1 && item.id === 3) {
            status = STATUS.FUTURE_OVERLOAD; // UKD Stroke Unit
          } else if (hospital.id === 5 && item.id === 2) {
            status = STATUS.OVERLOADED; // Marien Hospital Intensiv
          } else if (hospital.id === 6 && item.id === 6) {
            status = STATUS.LIMITED; // St. Josef Kindernotaufnahme
          } else if (hospital.id === 7 && item.id === 5) {
            status = STATUS.FUTURE_OVERLOAD; // Asklepios OP-Bereitschaft
          } else if (hospital.id === 9 && item.id === 1) {
            status = STATUS.OVERLOADED; // Florence Notaufnahme
          } else if (hospital.id === 10 && item.id === 7) {
            status = STATUS.LIMITED; // Rheinland Psychiatrie
          } else if ((hospital.id === 4 || hospital.id === 6) && item.id === 4) {
            status = STATUS.NOT_AVAILABLE; // Kein Herzkatheterlabor
            available = false;
          } else if (hospital.id === 5 && item.id === 6) {
            status = STATUS.NOT_AVAILABLE; // Keine Kindernotaufnahme
            available = false;
          } else if (statusChance < 0.15) {
            status = STATUS.OVERLOADED;
          } else if (statusChance < 0.25) {
            status = STATUS.LIMITED;
          } else if (statusChance < 0.05) {
            status = STATUS.INCAPACITATED;
          } else if (statusChance < 0.1) {
            status = STATUS.FUTURE_OVERLOAD;
          } else if (statusChance < 0.15 && (hospitalFactor + itemFactor) % 7 === 0) {
            status = STATUS.NOT_AVAILABLE;
            available = false;
          }
        }
        
        initMatrix[key] = {
          status,
          available,
          lastUpdate: new Date(Date.now() - Math.random() * 3600000), // Zufällige Updates in letzter Stunde
          updatedBy: Math.random() > 0.5 ? 'Leitstelle' : 'Krankenhaus',
          comment: status === STATUS.OVERLOADED ? 'Hoher Patientenandrang' : 
                   status === STATUS.LIMITED ? 'Personalengpass' :
                   status === STATUS.INCAPACITATED ? 'Technische Störung' : 
                   status === STATUS.NOT_AVAILABLE ? 'Abteilung nicht verfügbar' :
                   status === STATUS.FUTURE_OVERLOAD ? 'Erwartete Überlastung ab 14:00' :
                   status === STATUS.INACTIVE ? 'Krankenhaus inaktiv - Abteilungen verfügbar' : '',
          futureOverloads: status === STATUS.FUTURE_OVERLOAD ? [
            { start: new Date(Date.now() + 2 * 3600000), end: new Date(Date.now() + 4 * 3600000) }
          ] : []
        };
        
        // Beispiel-PVA-Daten entsprechend IG NRW Standard (Sichtungskategorien)
        if (status === STATUS.OVERLOADED || Math.random() > 0.7) {
          const pvaCount = status === STATUS.OVERLOADED ? Math.floor(Math.random() * 5) + 2 : Math.floor(Math.random() * 3) + 1;
          initPva[key] = [];
          
          for (let i = 0; i < pvaCount; i++) {
            // Sichtungskategorien nach IG NRW: 1=rot (kritisch), 2=gelb (mittel), 3=grün (leicht)
            const triageCategory = Math.random() < 0.3 ? 1 : Math.random() < 0.6 ? 2 : 3;
            const arrivalTime = new Date(Date.now() + (15 + Math.random() * 90) * 60000);
            
            initPva[key].push({
              id: Date.now() + Math.random() * 10000,
              triageCategory, // 1=rot, 2=gelb, 3=grün
              patientInfo: {
                age: Math.floor(Math.random() * 80) + 20,
                gender: Math.random() > 0.5 ? 'm' : 'w',
                symptoms: triageCategory === 1 ? 
                  ['Bewusstlosigkeit', 'Herzstillstand', 'Polytrauma', 'Schwerste Atemnot'][Math.floor(Math.random() * 4)] :
                  triageCategory === 2 ?
                  ['Brustschmerzen', 'Atemnot', 'Schlaganfall-Verdacht', 'Sturz mit Bewusstlosigkeit'][Math.floor(Math.random() * 4)] :
                  ['Bauchschmerzen', 'Leichte Verletzung', 'Übelkeit', 'Schmerzen'][Math.floor(Math.random() * 4)]
              },
              medicalInfo: {
                category: triageCategory,
                diagnosis: triageCategory === 1 ? 
                  'V.a. ' + ['Herzinfarkt', 'Polytrauma', 'Schlaganfall', 'Lungenembolie'][Math.floor(Math.random() * 4)] :
                  triageCategory === 2 ?
                  'V.a. ' + ['Angina Pectoris', 'Commotio cerebri', 'Pneumonie', 'Fraktur'][Math.floor(Math.random() * 4)] :
                  'V.a. ' + ['Gastritis', 'Zerrung', 'Erkältung', 'Kopfschmerzen'][Math.floor(Math.random() * 4)],
                vitals: triageCategory === 1 ?
                  `RR ${70 + Math.floor(Math.random() * 40)}/${40 + Math.floor(Math.random() * 30)}, Puls ${100 + Math.floor(Math.random() * 60)}` :
                  `RR ${110 + Math.floor(Math.random() * 50)}/${70 + Math.floor(Math.random() * 30)}, Puls ${70 + Math.floor(Math.random() * 40)}`,
                treatments: triageCategory === 1 ? 'Reanimation läuft' : triageCategory === 2 ? 'Erstversorgung erfolgt' : 'Stabil'
              },
              logisticsInfo: {
                arrivalTime: arrivalTime.toISOString().slice(0, 16),
                transportType: triageCategory === 1 ? 
                  ['NEF', 'RTH', 'RTW'][Math.floor(Math.random() * 3)] :
                  ['RTW', 'KTW', 'NEF'][Math.floor(Math.random() * 3)],
                crew: `${['RTW', 'NEF', 'RTH'][Math.floor(Math.random() * 3)]} ${Math.floor(Math.random() * 50) + 1}/${Math.floor(Math.random() * 9) + 1}`,
                contactNumber: `0211-${Math.floor(Math.random() * 90000) + 10000}`
              },
              confirmed: Math.random() > 0.6,
              createdBy: Math.random() > 0.3 ? 'Leitstelle' : 'Rettungsdienst',
              createdAt: new Date(Date.now() - Math.random() * 1800000) // Letzte 30 Minuten
            });
          }
          
          // Sortierung nach IG NRW Standard: Erst nach Sichtungskategorie (rot, gelb, grün), dann nach Eintreffzeit
          initPva[key].sort((a, b) => {
            if (a.triageCategory !== b.triageCategory) {
              return a.triageCategory - b.triageCategory; // 1 (rot) vor 2 (gelb) vor 3 (grün)
            }
            return new Date(a.logisticsInfo.arrivalTime) - new Date(b.logisticsInfo.arrivalTime);
          });
        } else {
          initPva[key] = [];
        }
      });
    });
    setMatrixData(initMatrix);
    setPvaData(initPva);
  }, [hospitals, capacities, serviceGroups]);

  // Auto-Refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setRefreshBlink(true);
        setTimeout(() => setRefreshBlink(false), 1000);
        // Hier würden echte Daten vom Server abgerufen
      }, 300000); // 5 Minuten
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleCellClick = (hospitalId, itemId) => {
    const key = `${hospitalId}-${itemId}`;
    
    // Wenn PVA vorhanden sind, PVA-Dialog öffnen, sonst Status-Dialog
    if (pvaData[key] && pvaData[key].length > 0) {
      setSelectedCell({ hospitalId, itemId });
      setPvaDialog(true);
    } else {
      setSelectedCell({ hospitalId, itemId });
      setStatusDialog(true);
    }
  };

  const handlePVAClick = (hospitalId, itemId) => {
    setSelectedCell({ hospitalId, itemId });
    setPvaDialog(true);
  };

  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleStatusUpdate = (status, comment, skipAutoFree) => {
    const key = `${selectedCell.hospitalId}-${selectedCell.itemId}`;
    const hospital = hospitals.find(h => h.id === selectedCell.hospitalId);
    const item = [...capacities, ...serviceGroups].find(i => i.id === selectedCell.itemId);
    
    setMatrixData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        status,
        comment,
        lastUpdate: new Date(),
        updatedBy: 'Leitstelle',
        skipAutoFree
      }
    }));
    
    setLastUpdate(new Date());
    showNotification(
      `Status für ${hospital?.name} - ${item?.name} auf "${getStatusLabel(status)}" geändert`, 
      'success'
    );
    setStatusDialog(false);
  };

  const handlePVASave = (pvaItem, action) => {
    const key = `${selectedCell.hospitalId}-${selectedCell.itemId}`;
    
    setPvaData(prev => {
      const currentList = prev[key] || [];
      
      if (action === 'add') {
        return { ...prev, [key]: [...currentList, pvaItem] };
      } else if (action === 'edit') {
        return { 
          ...prev, 
          [key]: currentList.map(pva => pva.id === pvaItem.id ? pvaItem : pva)
        };
      } else if (action === 'delete') {
        return { 
          ...prev, 
          [key]: currentList.filter(pva => pva.id !== pvaItem.id)
        };
      }
      
      return prev;
    });
    
    // PVA-Count in Matrix aktualisieren
    setMatrixData(prev => {
      const currentList = pvaData[key] || [];
      let newCount = currentList.length;
      
      if (action === 'add') newCount++;
      else if (action === 'delete') newCount--;
      
      return {
        ...prev,
        [key]: {
          ...prev[key],
          pvaCount: Math.max(0, newCount)
        }
      };
    });
  };

  const handleAdminSave = (type, data, action) => {
    if (type === 'hospital') {
      if (action === 'add') {
        setHospitals(prev => [...prev, data]);
      } else if (action === 'edit') {
        setHospitals(prev => prev.map(h => h.id === data.id ? data : h));
      } else if (action === 'delete') {
        setHospitals(prev => prev.filter(h => h.id !== data.id));
      }
    } else if (type === 'capacity') {
      if (action === 'add') {
        setCapacities(prev => [...prev, data]);
      } else if (action === 'edit') {
        setCapacities(prev => prev.map(c => c.id === data.id ? data : c));
      } else if (action === 'delete') {
        setCapacities(prev => prev.filter(c => c.id !== data.id));
      }
    } else if (type === 'service') {
      if (action === 'add') {
        setServiceGroups(prev => [...prev, data]);
      } else if (action === 'edit') {
        setServiceGroups(prev => prev.map(s => s.id === data.id ? data : s));
      } else if (action === 'delete') {
        setServiceGroups(prev => prev.filter(s => s.id !== data.id));
      }
    }
    // System-Konfiguration würde hier gespeichert werden
  };

  const handleExport = () => {
    // Hier würde der Excel-Export implementiert
    alert('Excel-Export wird erstellt...');
  };

  const getStatusLabel = (status) => {
    const labels = {
      [STATUS.FREE]: 'Verfügbar',
      [STATUS.OVERLOADED]: 'Ausgelastet',
      [STATUS.LIMITED]: 'Eingeschränkt',
      [STATUS.INCAPACITATED]: 'Handlungsunfähig',
      [STATUS.NOT_AVAILABLE]: 'Verfügbar',
      [STATUS.FUTURE_OVERLOAD]: 'Zukünftig ausgelastet',
      [STATUS.INACTIVE]: 'Inaktiv'
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      [STATUS.FREE]: <CheckCircle />,
      [STATUS.OVERLOADED]: <Error />,
      [STATUS.LIMITED]: <WarningIcon />,
      [STATUS.INCAPACITATED]: <Error />,
      [STATUS.NOT_AVAILABLE]: <Circle />,
      [STATUS.FUTURE_OVERLOAD]: <AccessTime />,
      [STATUS.INACTIVE]: <Circle />
    };
    return icons[status] || <Circle />;
  };

  const getStatistics = () => {
    const stats = {
      total: 0,
      free: 0,
      overloaded: 0,
      limited: 0,
      incapacitated: 0,
      totalPva: 0
    };

    Object.keys(matrixData).forEach(key => {
      const data = matrixData[key];
      if (data.available) {
        stats.total++;
        switch (data.status) {
          case STATUS.FREE:
            stats.free++;
            break;
          case STATUS.OVERLOADED:
            stats.overloaded++;
            break;
          case STATUS.LIMITED:
            stats.limited++;
            break;
          case STATUS.INCAPACITATED:
            stats.incapacitated++;
            break;
          default:
            // Andere Status werden nicht gezählt
            break;
        }
      }
    });

    Object.keys(pvaData).forEach(key => {
      stats.totalPva += pvaData[key].length;
    });

    return stats;
  };

  const stats = getStatistics();

  const getCellStatus = (hospitalId, itemId) => {
    const key = `${hospitalId}-${itemId}`;
    const data = matrixData[key];
    if (!data || !data.available) return STATUS.NOT_AVAILABLE;
    return data.status;
  };

  const getCellColor = (status, isInactive) => {
    if (blackWhiteMode) {
      return status === STATUS.FREE ? '#ffffff' : '#000000';
    }
    
    // Wenn Krankenhaus inaktiv ist, immer grün gestreift anzeigen (egal welcher Status)
    if (isInactive || status === STATUS.INACTIVE) {
      return 'repeating-linear-gradient(45deg, #4caf50, #4caf50 10px, #ffffff 10px, #ffffff 20px)';
    }
    
    return STATUS_COLORS[status] || '#9e9e9e';
  };

  const renderStatusCard = (title, count, color, icon) => (
    <Card sx={{ minWidth: 120, textAlign: 'center' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, color }}>
          {icon}
          <Typography variant="h4" sx={{ ml: 1, fontWeight: 'bold' }}>
            {count}
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  const renderMatrix = (items) => (
    <Paper elevation={2} sx={{ mt: 2 }}>
      <Box sx={{ p: 1, backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontSize: '1rem' }}>
          <Dashboard sx={{ mr: 1 }} />
          {currentTab === 0 ? 'Versorgungskapazitäten' : 'Leistungsgruppen'}
          <Chip 
            label={`${items.length} Bereiche`} 
            size="small" 
            sx={{ ml: 2 }} 
          />
        </Typography>
      </Box>
      
      <TableContainer sx={{ overflow: 'hidden' }}>
        <Table 
          size="small" 
          sx={{ 
            '& .MuiTableCell-root': { 
              border: '1px solid #e0e0e0',
              padding: '2px 4px',
              fontSize: '0.7rem'
            } 
          }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fafafa' }}>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 60, maxWidth: 80, width: 70 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalHospital sx={{ mr: 0.5, color: 'primary.main', fontSize: '0.9rem' }} />
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    KH
                  </Typography>
                </Box>
              </TableCell>
              {items.map(item => (
                <TableCell 
                  key={item.id} 
                  sx={{ 
                    fontWeight: 'bold', 
                    textAlign: 'center', 
                    minWidth: 90,
                    maxWidth: 90,
                    width: 90,
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    height: 85,
                    fontSize: '0.7rem',
                    padding: '4px 2px'
                  }}
                  title={item.name}
                >
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: '0.7rem',
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      lineHeight: 1.3,
                      fontWeight: 'bold'
                    }}
                  >
                    {item.name}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {hospitals.map(hospital => (
              <TableRow key={hospital.id} hover sx={{ height: 50 }}>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#fafafa', maxWidth: 80, padding: '4px 6px' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.75rem', lineHeight: 1.1 }}>
                      {hospital.alias}
                    </Typography>
                    {!hospital.active && (
                      <Chip 
                        label="OFF" 
                        size="small" 
                        color="default" 
                        variant="outlined"
                        sx={{ fontSize: '0.55rem', height: 14, mt: 0.5 }}
                      />
                    )}
                  </Box>
                </TableCell>
                {items.map(item => {
                  const status = getCellStatus(hospital.id, item.id);
                  const pvaCount = pvaData[`${hospital.id}-${item.id}`]?.length || 0;
                  const cellData = matrixData[`${hospital.id}-${item.id}`];
                  
                  return (
                    <TableCell 
                      key={item.id} 
                      sx={{ 
                        textAlign: 'center',
                        position: 'relative',
                        cursor: 'pointer',
                        background: getCellColor(status, !hospital.active),
                        minHeight: 50,
                        maxHeight: 50,
                        height: 50,
                        minWidth: 90,
                        maxWidth: 90,
                        width: 90,
                        padding: '2px',
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                          transform: 'scale(1.05)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          zIndex: 1
                        }
                      }}
                      onClick={() => handleCellClick(hospital.id, item.id)}
                    >
                      <Tooltip 
                        title={
                          <Box sx={{ p: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                              {hospital.name} - {item.name}
                            </Typography>
                            <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.3)' }} />
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              {getStatusIcon(status)}
                              <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>
                                Status: {getStatusLabel(status)}
                              </Typography>
                            </Box>
                            
                            {cellData?.comment && (
                              <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic' }}>
                                💬 {cellData.comment}
                              </Typography>
                            )}
                            
                            {pvaCount > 0 && (
                              <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                  📋 {pvaCount} Voranmeldung{pvaCount > 1 ? 'en' : ''}
                                </Typography>
                                {/* Aufschlüsselung nach Sichtungskategorien */}
                                {pvaData[`${hospital.id}-${item.id}`] && (
                                  <Box sx={{ mt: 0.5 }}>
                                    {[1, 2, 3].map(category => {
                                      const categoryCount = pvaData[`${hospital.id}-${item.id}`].filter(p => p.triageCategory === category).length;
                                      if (categoryCount === 0) return null;
                                      const categoryColors = { 1: '#f44336', 2: '#ff9800', 3: '#4caf50' };
                                      const categoryNames = { 1: 'Rot (kritisch)', 2: 'Gelb (mittel)', 3: 'Grün (leicht)' };
                                      return (
                                        <Typography 
                                          key={category}
                                          variant="caption" 
                                          sx={{ 
                                            color: categoryColors[category], 
                                            display: 'block',
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold'
                                          }}
                                        >
                                          ● {categoryCount}x {categoryNames[category]}
                                        </Typography>
                                      );
                                    })}
                                  </Box>
                                )}
                                <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.7rem' }}>
                                  Klicken für PVA-Details
                                </Typography>
                              </Box>
                            )}
                            
                            {status === STATUS.FUTURE_OVERLOAD && cellData?.futureOverloads?.length > 0 && (
                              <Typography variant="body2" sx={{ color: '#2196f3', mb: 1 }}>
                                ⏰ Geplante Auslastung: {cellData.futureOverloads[0].start.toLocaleTimeString()} - {cellData.futureOverloads[0].end.toLocaleTimeString()}
                              </Typography>
                            )}
                            
                            <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.3)' }} />
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" color="textSecondary">
                                Aktualisiert: {cellData?.lastUpdate?.toLocaleTimeString()}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                von {cellData?.updatedBy}
                              </Typography>
                            </Box>
                            
                            <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center', opacity: 0.8 }}>
                              Klicken zum Bearbeiten
                            </Typography>
                          </Box>
                        }
                        placement="top"
                        arrow
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: 'rgba(0, 0, 0, 0.9)',
                              maxWidth: 400,
                              fontSize: '0.875rem'
                            }
                          }
                        }}
                      >
                        <Box sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          position: 'relative'
                        }}>
                          {/* Status-Anzeige */}
                          <Box sx={{ 
                            position: 'absolute', 
                            top: 2, 
                            left: 2,
                            color: 'white',
                            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))'
                          }}>
                            {React.cloneElement(getStatusIcon(status), { sx: { fontSize: '1rem' } })}
                          </Box>
                          
                          {/* PVA Bubbles nach IG NRW Standard - größer und besser sichtbar */}
                          {pvaCount > 0 && pvaData[`${hospital.id}-${item.id}`] && (
                            <Box sx={{ 
                              position: 'absolute', 
                              top: 2, 
                              right: 2,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 0.5
                            }}>
                              {[1, 2, 3].map(category => {
                                const categoryCount = pvaData[`${hospital.id}-${item.id}`].filter(p => p.triageCategory === category).length;
                                if (categoryCount === 0) return null;
                                
                                const categoryColors = { 
                                  1: '#f44336', // rot (kritisch)
                                  2: '#ff9800', // gelb (mittel) 
                                  3: '#4caf50'  // grün (leicht)
                                };
                                
                                return (
                                  <Badge 
                                    key={category}
                                    badgeContent={categoryCount} 
                                    sx={{ 
                                      '& .MuiBadge-badge': {
                                        backgroundColor: categoryColors[category],
                                        color: 'white',
                                        fontSize: '0.65rem',
                                        minWidth: 14,
                                        height: 14,
                                        fontWeight: 'bold',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                                        border: '1px solid white'
                                      }
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePVAClick(hospital.id, item.id);
                                    }}
                                  >
                                    <Box 
                                      sx={{ 
                                        width: 8, 
                                        height: 8, 
                                        borderRadius: '50%',
                                        backgroundColor: categoryColors[category],
                                        border: '1px solid white',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                      }} 
                                    />
                                  </Badge>
                                );
                              })}
                            </Box>
                          )}
                          
                          {/* Zentraler Status-Text für größere Zellen */}
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'white',
                              textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                              fontWeight: 'bold',
                              fontSize: '0.65rem',
                              textAlign: 'center',
                              lineHeight: 1,
                              mt: 1
                            }}
                          >
                            {getStatusLabel(status).substring(0, 4)}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  return (
    <Box sx={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Box 
        sx={{ 
          border: refreshBlink ? '3px solid #f44336' : 'none',
          transition: 'border 0.5s ease',
          height: '100%',
          backgroundColor: '#fafafa',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header - nur anzeigen wenn nicht im Vollbildmodus */}
        {!isFullscreen && (
          <>
            <AppBar position="sticky" color="primary" elevation={2}>
              <Toolbar>
                <LocalHospital sx={{ mr: 2 }} />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  IG NRW - Krankenhaus Matrix
                </Typography>
                
                {/* Status Chips */}
                <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                  <Chip 
                    icon={<CheckCircle />}
                    label={`${stats.free} frei`} 
                    color="success" 
                    size="small" 
                  />
                  <Chip 
                    icon={<WarningIcon />}
                    label={`${stats.limited} eingeschränkt`} 
                    color="warning" 
                    size="small" 
                  />
                  <Chip 
                    icon={<Error />}
                    label={`${stats.overloaded} ausgelastet`} 
                    color="error" 
                    size="small" 
                  />
                  {stats.totalPva > 0 && (
                    <Chip 
                      icon={<Emergency />}
                      label={`${stats.totalPva} PVA`} 
                      color="info" 
                      size="small" 
                    />
                  )}
                </Box>
                
                {/* Auto-Refresh */}
                <FormControlLabel
                  control={<Switch checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />}
                  label="Auto"
                  sx={{ mr: 1, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                />
                
                {/* S/W Mode */}
                <FormControlLabel
                  control={<Switch checked={blackWhiteMode} onChange={(e) => setBlackWhiteMode(e.target.checked)} />}
                  label="S/W"
                  sx={{ mr: 1, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                />
                
                <IconButton onClick={() => setLegendDialog(true)} color="inherit">
                  <Info />
                </IconButton>
                
                <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} color="inherit">
                  <MoreVert />
                </IconButton>
                
                <IconButton onClick={() => setIsFullscreen(!isFullscreen)} color="inherit">
                  {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
                
                <IconButton onClick={() => window.location.reload()} color="inherit">
                  <Refresh />
                </IconButton>
              </Toolbar>
            </AppBar>

            {/* Breadcrumbs & Status Info */}
            <Box sx={{ p: 2, backgroundColor: 'white', borderBottom: '1px solid #ddd' }}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Breadcrumbs>
                    <Link color="inherit" href="#" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Home sx={{ mr: 0.5 }} fontSize="inherit" />
                      Leitstelle
                    </Link>
                    <Typography color="textPrimary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Dashboard sx={{ mr: 0.5 }} fontSize="inherit" />
                      Matrix-Übersicht
                    </Typography>
                  </Breadcrumbs>
                </Grid>
                <Grid item>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      icon={<AccessTime />}
                      label={`Aktualisiert: ${lastUpdate.toLocaleTimeString()}`}
                      variant="outlined"
                      size="small"
                    />
                    {autoRefresh && (
                      <Chip 
                        icon={<Notifications />}
                        label="Live"
                        color="success"
                        size="small"
                        sx={{ animation: 'pulse 2s infinite' }}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </>
        )}

        {/* Vollbildmodus - Floating Controls */}
        {isFullscreen && (
          <Box 
            sx={{ 
              position: 'fixed', 
              top: 16, 
              right: 16, 
              zIndex: 1000,
              backgroundColor: 'rgba(0,0,0,0.7)',
              borderRadius: 2,
              p: 1,
              display: 'flex',
              gap: 1
            }}
          >
            <IconButton onClick={() => setLegendDialog(true)} sx={{ color: 'white' }}>
              <Info />
            </IconButton>
            <IconButton onClick={() => setIsFullscreen(false)} sx={{ color: 'white' }}>
              <FullscreenExit />
            </IconButton>
            <IconButton onClick={() => window.location.reload()} sx={{ color: 'white' }}>
              <Refresh />
            </IconButton>
          </Box>
        )}

        {/* Mehr-Menü - nur wenn nicht Vollbild */}
        {!isFullscreen && (
          <>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
            >
              <MenuOption onClick={() => { setAdminDialog(true); setMenuAnchor(null); }}>
                <Settings sx={{ mr: 1 }} />
                Administration
              </MenuOption>
              <MenuOption onClick={() => { handleExport(); setMenuAnchor(null); }}>
                <GetApp sx={{ mr: 1 }} />
                Excel Export
              </MenuOption>
            </Menu>

            {/* Systemhinweise */}
            <Box sx={{ px: 2 }}>
              <Alert 
                severity="info" 
                icon={<Notifications />}
                sx={{ mb: 2 }}
              >
                <strong>Systemstatus:</strong> Alle Verbindungen aktiv. 
                {stats.overloaded > 0 && ` ⚠️ ${stats.overloaded} Bereiche ausgelastet.`}
                {stats.totalPva > 0 && ` 📋 ${stats.totalPva} aktive Voranmeldungen.`}
              </Alert>
            </Box>

            {/* Statistics Dashboard */}
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {renderStatusCard('Verfügbar', stats.free, '#4caf50', <CheckCircle />)}
                {renderStatusCard('Eingeschränkt', stats.limited, '#ff9800', <WarningIcon />)}
                {renderStatusCard('Ausgelastet', stats.overloaded, '#f44336', <Error />)}
                {renderStatusCard('Handlungsunfähig', stats.incapacitated, '#000000', <Error />)}
                {renderStatusCard('Voranmeldungen', stats.totalPva, '#2196f3', <Emergency />)}
                {renderStatusCard('Gesamt Bereiche', stats.total, '#9e9e9e', <Dashboard />)}
              </Grid>
            </Box>
          </>
        )}

        {/* Matrix Tabelle - kompakt für kein Scrolling */}
        <Box sx={{ 
          p: isFullscreen ? 0.5 : 1, 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Tabs nur wenn nicht Vollbild */}
          {!isFullscreen && (
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1, flexShrink: 0 }}>
              <Tabs 
                value={currentTab} 
                onChange={(e, newValue) => setCurrentTab(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    minHeight: '40px'
                  }
                }}
              >
                <Tab 
                  label={`Versorgungskapazitäten (${capacities.length})`}
                  icon={<LocalHospital />}
                  iconPosition="start"
                />
                <Tab 
                  label={`Leistungsgruppen (${serviceGroups.length})`}
                  icon={<Dashboard />}
                  iconPosition="start"
                />
              </Tabs>
            </Box>
          )}
          
          {/* Matrix - angepasst für bessere Proportionen */}
          <Box sx={{ 
            '& .MuiTable-root': isFullscreen ? {
              '& .MuiTableCell-root': {
                padding: '3px',
                fontSize: '0.7rem'
              },
              '& .MuiTableCell-head': {
                fontSize: '0.75rem'
              }
            } : {}
          }}>
            {currentTab === 0 && renderMatrix(capacities)}
            {currentTab === 1 && renderMatrix(serviceGroups)}
          </Box>
        </Box>

        {/* Floating Action Button für PVA - nur wenn nicht Vollbild */}
        {!isFullscreen && (
          <Fab 
            color="primary" 
            aria-label="Neue Voranmeldung"
            sx={{ 
              position: 'fixed', 
              bottom: 24, 
              right: 24,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
            onClick={() => {
              // Beispiel: Erste verfügbare Zelle für neue PVA wählen
              const firstHospital = hospitals.find(h => h.active);
              const firstCapacity = capacities[0];
              if (firstHospital && firstCapacity) {
                setSelectedCell({ hospitalId: firstHospital.id, itemId: firstCapacity.id });
                setPvaDialog(true);
              }
            }}
          >
            <PersonAdd />
          </Fab>
        )}

        {/* Status Dialog */}
        <StatusDialog 
          open={statusDialog}
          onClose={() => setStatusDialog(false)}
          onSubmit={handleStatusUpdate}
          currentData={selectedCell ? matrixData[`${selectedCell.hospitalId}-${selectedCell.itemId}`] : null}
        />

        {/* PVA Dialog */}
        <PVADialog 
          open={pvaDialog}
          onClose={() => setPvaDialog(false)}
          hospitalId={selectedCell?.hospitalId}
          departmentId={selectedCell?.itemId}
          pvaList={selectedCell ? pvaData[`${selectedCell.hospitalId}-${selectedCell.itemId}`] || [] : []}
          onSave={handlePVASave}
        />

        {/* Admin Dialog */}
        <AdminDialog 
          open={adminDialog}
          onClose={() => setAdminDialog(false)}
          hospitals={hospitals}
          capacities={capacities}
          serviceGroups={serviceGroups}
          onSave={handleAdminSave}
        />

        {/* Legende Dialog */}
        <LegendDialog 
          open={legendDialog}
          onClose={() => setLegendDialog(false)}
          blackWhiteMode={blackWhiteMode}
          hospitals={hospitals}
          capacities={capacities}
          serviceGroups={serviceGroups}
        />

        {/* Snackbar für Benachrichtigungen */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

// Status Dialog Komponente
function StatusDialog({ open, onClose, onSubmit, currentData }) {
  const [status, setStatus] = useState(STATUS.FREE);
  const [comment, setComment] = useState('');
  const [orderedBy, setOrderedBy] = useState('');
  const [skipAutoFree, setSkipAutoFree] = useState(false);

  useEffect(() => {
    if (currentData) {
      setStatus(currentData.status);
      setComment(currentData.comment || '');
    }
  }, [currentData]);

  const handleSubmit = () => {
    if (!orderedBy.trim()) {
      alert('Bitte geben Sie an, von wem der Auftrag kommt');
      return;
    }
    onSubmit(status, comment, skipAutoFree);
    setOrderedBy('');
    setComment('');
    setSkipAutoFree(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Status ändern</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value={STATUS.FREE}>Frei</MenuItem>
                <MenuItem value={STATUS.OVERLOADED}>Ausgelastet</MenuItem>
                <MenuItem value={STATUS.LIMITED}>Eingeschränkt</MenuItem>
                <MenuItem value={STATUS.INCAPACITATED}>Handlungsunfähig</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Auftrag von *"
              value={orderedBy}
              onChange={(e) => setOrderedBy(e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bemerkung"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              multiline
              rows={3}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={skipAutoFree} 
                  onChange={(e) => setSkipAutoFree(e.target.checked)} 
                />
              }
              label="Nächste automatische Freimeldung überspringen"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={handleSubmit} variant="contained">Speichern</Button>
      </DialogActions>
    </Dialog>
  );
}

// Legende Dialog Komponente
function LegendDialog({ open, onClose, blackWhiteMode, hospitals, capacities, serviceGroups }) {
  
  // Dynamische Legende basierend auf aktuellen Matrix-Daten
  const getLegendItems = () => {
    return [
      { 
        color: '#4caf50', 
        label: 'Verfügbar', 
        description: 'Die Abteilung kann weitere Patienten aufnehmen',
        icon: <CheckCircle />,
        priority: 'success',
        example: 'UKD - Kardiologie: Bereit für Patienten'
      },
      { 
        color: '#ff9800', 
        label: 'Eingeschränkt verfügbar', 
        description: 'Die Abteilung ist betriebsbereit, aber mit Einschränkungen (z.B. Personalengpass)',
        icon: <WarningIcon />,
        priority: 'warning',
        example: 'SMK - Notaufnahme: Personalengpass, verlängerte Wartezeiten'
      },
      { 
        color: '#f44336', 
        label: 'Derzeit ausgelastet', 
        description: 'Die Abteilung kann nur noch Notfallbehandlungen leisten',
        icon: <Error />,
        priority: 'error',
        example: 'UKD - Intensivstation: Alle Betten belegt, nur Notfälle'
      },
      { 
        color: '#a5d6a7', 
        label: 'Zukünftige Auslastung', 
        description: 'Es liegt mindestens eine geplante zukünftige Auslastung vor',
        icon: <AccessTime />,
        priority: 'info',
        example: 'UKD - Stroke Unit: Erwartete Überlastung ab 14:00'
      },
      { 
        pattern: 'striped', 
        color: '#4caf50', 
        label: 'Krankenhaus inaktiv', 
        description: 'Die Abteilungen sind verfügbar, aber das Krankenhaus nimmt derzeit nicht am IG NRW System teil',
        icon: <CheckCircle />,
        priority: 'default',
        example: 'Helios - alle Abteilungen: Verfügbar, aber System-Teilnahme pausiert'
      },
      { 
        color: '#000000', 
        label: 'Handlungsunfähig', 
        description: 'Das Krankenhaus ist zur Zeit nicht in der Lage, Patienten aufzunehmen',
        icon: <Error />,
        priority: 'error',
        example: 'UKD - Notaufnahme: Technische Störung, keine Patientenaufnahme'
      },
      { 
        color: '#9e9e9e', 
        label: 'Nicht verfügbar', 
        description: 'Diese Abteilung ist im Krankenhaus nicht vorhanden',
        icon: <Circle />,
        priority: 'default',
        example: 'SMK - Intensivstation: Abteilung geschlossen'
      }
    ];
  };

  const legendItems = getLegendItems();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Info sx={{ mr: 1, color: 'primary.main' }} />
          Legende - Aktuelle Matrix-Status
        </Box>
      </DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Live-Status der Matrix:</strong> Diese Übersicht zeigt alle aktuell in der Matrix vorhandenen Status-Codes mit echten Beispielen.
        </Alert>

        <Grid container spacing={3}>
          {legendItems.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card 
                variant="outlined" 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  borderLeft: `6px solid ${item.color}`,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                {/* Header mit Icon und Status */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      width: 48, 
                      height: 32, 
                      backgroundColor: blackWhiteMode ? 
                        (item.color === '#4caf50' ? '#ffffff' : '#000000') : 
                        item.color,
                      background: item.pattern === 'striped' ? 
                        'repeating-linear-gradient(45deg, #4caf50, #4caf50 8px, #ffffff 8px, #ffffff 16px)' : 
                        undefined,
                      border: '2px solid #ccc',
                      borderRadius: 2,
                      mr: 2,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }} 
                  >
                    <Box sx={{ 
                      color: item.color === '#ffffff' || item.color === '#a5d6a7' ? '#333' : '#fff', 
                      fontSize: '1.2rem',
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
                    }}>
                      {item.icon}
                    </Box>
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {item.label}
                    </Typography>
                    <Chip 
                      label={item.priority.toUpperCase()} 
                      size="small" 
                      color={item.priority}
                      variant="filled"
                    />
                  </Box>
                </Box>

                {/* Beschreibung */}
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {item.description}
                </Typography>

                {/* Beispiel aus der Matrix */}
                <Box sx={{ 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: 1, 
                  p: 2, 
                  borderLeft: `3px solid ${item.color}`
                }}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                    AKTUELLES BEISPIEL AUS DER MATRIX:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                    {item.example}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />
        
        {/* PVA Symbole */}
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Emergency sx={{ mr: 1, color: 'error.main' }} />
          Patientenvoranmeldungen (PVA)
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, backgroundColor: '#ffebee', border: '1px solid #ffcdd2' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Badge badgeContent={3} color="error">
                  <Emergency />
                </Badge>
                <Typography variant="subtitle2" sx={{ ml: 2, fontWeight: 'bold' }}>
                  Kategorie I - Kritisch
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Lebensbedrohliche Notfälle (rot) - sofortige Behandlung erforderlich
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, backgroundColor: '#fff3e0', border: '1px solid #ffcc02' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Badge badgeContent={2} color="warning">
                  <Emergency />
                </Badge>
                <Typography variant="subtitle2" sx={{ ml: 2, fontWeight: 'bold' }}>
                  Kategorie II - Mittel
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Dringliche Behandlung (gelb) - zeitnahe Versorgung notwendig
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, backgroundColor: '#e8f5e8', border: '1px solid #c8e6c9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Badge badgeContent={1} color="success">
                  <Emergency />
                </Badge>
                <Typography variant="subtitle2" sx={{ ml: 2, fontWeight: 'bold' }}>
                  Kategorie III - Leicht
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Behandelbare Verletzungen (grün) - Behandlung kann warten
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Zusätzliche Matrix-Informationen */}
        <Divider sx={{ my: 3 }} />
        
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>💡 Tipp für Leitstellen:</strong> Klicken Sie auf eine Matrix-Zelle für Statusänderung oder PVA-Verwaltung. 
            PVA-Badges zeigen die Anzahl wartender Voranmeldungen an.
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            icon={<AccessTime />}
            label="Live-Update alle 5 Min" 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            icon={<LocalHospital />}
            label={`${hospitals.length} Krankenhäuser`} 
            color="info" 
            variant="outlined"
          />
          <Chip 
            icon={<Dashboard />}
            label={`${capacities.length + serviceGroups.length} Bereiche`} 
            color="secondary" 
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="contained" size="large" sx={{ minWidth: 120 }}>
          Verstanden
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default App;
