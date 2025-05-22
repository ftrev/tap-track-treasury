
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b4c725bd80914a9c91bae643bc0bb0f0',
  appName: 'tap-track-treasury',
  webDir: 'dist',
  server: {
    url: 'https://b4c725bd-8091-4a9c-91ba-e643bc0bb0f0.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    backgroundColor: "#FFFFFF"
  },
  ios: {
    backgroundColor: "#FFFFFF"
  }
};

export default config;
