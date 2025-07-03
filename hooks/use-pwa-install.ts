'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}

export interface PWAInstallState {
  canInstall: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  showPrompt: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
}

export interface PWAInstallActions {
  install: () => Promise<boolean>;
  dismissPrompt: () => void;
  resetPrompt: () => void;
}

const STORAGE_KEY = 'pwa-install-dismissed';
const INSTALL_DELAY = 2000; // 2 seconds

export function usePWAInstall(): PWAInstallState & PWAInstallActions {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstallation = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes('android-app://');
      
      setIsStandalone(isStandaloneMode);
      setIsInstalled(isStandaloneMode);
      
      console.log('[PWA] Standalone mode:', isStandaloneMode);
    };

    checkInstallation();

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('[PWA] Before install prompt triggered');
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      console.log('[PWA] App installed successfully');
      setDeferredPrompt(null);
      setIsInstalled(true);
      setIsStandalone(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      console.log('[PWA] Display mode changed:', e.matches ? 'standalone' : 'browser');
      setIsStandalone(e.matches);
    };
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const install = async () => {
    console.log('[PWA] Install requested, prompt available:', !!deferredPrompt);
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] User choice:', outcome);
      
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("[PWA] Error installing:", error);
      return false;
    }
  };

  const dismissPrompt = (): void => {
    setShowPrompt(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    
    // Track dismissal
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'pwa_prompt_dismissed', {
        event_category: 'engagement',
        event_label: 'custom_prompt_dismissed'
      });
    }
  };

  const resetPrompt = (): void => {
    localStorage.removeItem(STORAGE_KEY);
    setShowPrompt(true);
  };

  return {
    canInstall: !!deferredPrompt && !isInstalled && !isStandalone,
    isInstalled,
    isStandalone,
    isIOS,
    isAndroid,
    showPrompt,
    deferredPrompt,
    install,
    dismissPrompt,
    resetPrompt,
  };
}