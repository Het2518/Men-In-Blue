import { useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Web3Context } from '../contexts/Web3Context';

export const useAppNavigation = () => {
  const navigate = useNavigate();
  const { account, roles } = useContext(Web3Context);

  const goHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const goDashboard = useCallback(() => {
    if (account) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  }, [navigate, account]);

  const goToProducer = useCallback(() => {
    if (roles.isProducer) {
      navigate('/producer');
    }
  }, [navigate, roles.isProducer]);

  const goToBuyer = useCallback(() => {
    if (roles.isBuyer) {
      navigate('/buyer');
    }
  }, [navigate, roles.isBuyer]);

  const goToCertifier = useCallback(() => {
    if (roles.isCertifier) {
      navigate('/certifier');
    }
  }, [navigate, roles.isCertifier]);

  const goToAdmin = useCallback(() => {
    if (roles.isAdmin) {
      navigate('/admin');
    }
  }, [navigate, roles.isAdmin]);

  const canAccess = {
    dashboard: !!account,
    producer: roles.isProducer,
    buyer: roles.isBuyer,
    certifier: roles.isCertifier,
    admin: roles.isAdmin
  };

  return {
    goHome,
    goDashboard,
    goToProducer,
    goToBuyer,
    goToCertifier,
    goToAdmin,
    canAccess,
    account,
    roles
  };
};
