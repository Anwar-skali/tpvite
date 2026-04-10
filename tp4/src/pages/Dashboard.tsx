import React, { useState } from 'react';
import HeaderMUI from '../components/HeaderMUI';
import HeaderBS from '../components/HeaderBS';
import { Box, Typography } from '@mui/material';

export default function Dashboard() {
  const [useMui, setUseMui] = useState(true);

  return (
    <div>
      {/* Bascule dynamique entre le Header MUI et Header Bootstrap */}
      {useMui ? (
        <HeaderMUI 
          title="TaskFlow (MUI)" 
          onMenuClick={() => setUseMui(false)} 
          userName="Othmane" 
          onLogout={() => console.log('Déconnexion de MUI')} 
        />
      ) : (
        <HeaderBS 
          title="TaskFlow (Bootstrap)" 
          onMenuClick={() => setUseMui(true)} 
          userName="Othmane" 
          onLogout={() => console.log('Déconnexion de Bootstrap')} 
        />
      )}
      
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Bienvenue sur le Dashboard TP4 !
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Cliquez sur le bouton "Menu" (☰) tout en haut à gauche du Header pour basculer 
          entre la version <b>Material UI</b> et la version <b>Bootstrap</b> en temps réel.
        </Typography>
      </Box>
    </div>
  );
}
