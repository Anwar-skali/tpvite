import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { logout } from '../features/auth/authSlice';
import HeaderMUI from './HeaderMUI';
import HeaderBS from './HeaderBS';

interface AppHeaderProps {
  useMui: boolean;
  onToggleFramework: () => void;
  titleMui: string;
  titleBs: string;
}

/**
 * Header unique branché sur Redux : nom utilisateur + déconnexion centralisés.
 * Conserve les implémentations MUI / BS existantes sans les dupliquer.
 */
export default function Header({ useMui, onToggleFramework, titleMui, titleBs }: AppHeaderProps) {
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const displayName = user?.name ?? user?.email ?? 'Utilisateur';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return useMui ? (
    <HeaderMUI
      title={titleMui}
      onMenuClick={onToggleFramework}
      userName={displayName}
      onLogout={handleLogout}
    />
  ) : (
    <HeaderBS
      title={titleBs}
      onMenuClick={onToggleFramework}
      userName={displayName}
      onLogout={handleLogout}
    />
  );
}
