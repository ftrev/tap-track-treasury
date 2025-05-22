
import { Capacitor } from '@capacitor/core';

export const isNativePlatform = () => {
  return Capacitor.isNativePlatform();
};

export const getPlatform = () => {
  return Capacitor.getPlatform();
};

export const isMobileApp = () => {
  return isNativePlatform() && (getPlatform() === 'ios' || getPlatform() === 'android');
};

export const getAppVersionName = async () => {
  if (isNativePlatform()) {
    try {
      // Este é apenas um placeholder. Em uma implementação real, você usaria
      // um plugin como @capacitor/app para obter a versão do aplicativo
      return '1.0.0';
    } catch (error) {
      console.error('Erro ao obter versão do app:', error);
      return '0.0.0';
    }
  }
  return 'web';
};
