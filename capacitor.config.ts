
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.8f2b559e2aa64c8c88de1b5a6c48e8c5',
  appName: 'trip-glide-expense-flow',
  webDir: 'dist',
  server: {
    url: 'https://8f2b559e-2aa6-4c8c-88de-1b5a6c48e8c5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystorePassword: null,
      keystoreAlias: null,
      keystoreAliasPassword: null,
      releaseType: null,
    }
  }
};

export default config;
