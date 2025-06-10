import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  Settings,
  Scan,
  Lock,
  Unlock,
  Signal,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Router,
  Globe,
  Shield,
  Info,
  Save,
  X,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';

interface WiFiNetwork {
  ssid: string;
  signal: number;
  security: 'open' | 'wep' | 'wpa' | 'wpa2' | 'wpa3';
  connected: boolean;
  saved: boolean;
}

interface SavedNetwork {
  id: string;
  ssid: string;
  password: string;
  autoConnect: boolean;
  lastConnected: string;
}

const WiFiManagementPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'failed'>('connected');
  
  const [availableNetworks, setAvailableNetworks] = useState<WiFiNetwork[]>([
    {
      ssid: 'МОЈА_БАШТА_ГЛАВНА',
      signal: 95,
      security: 'wpa2',
      connected: true,
      saved: true
    },
    {
      ssid: 'Dom_WiFi_5G',
      signal: 78,
      security: 'wpa3',
      connected: false,
      saved: true
    },
    {
      ssid: 'Komšija_Internet',
      signal: 45,
      security: 'wpa2',
      connected: false,
      saved: false
    },
    {
      ssid: 'Guest_Network',
      signal: 32,
      security: 'open',
      connected: false,
      saved: false
    },
    {
      ssid: 'ESP32_Hotspot',
      signal: 88,
      security: 'wpa2',
      connected: false,
      saved: false
    }
  ]);

  const [savedNetworks, setSavedNetworks] = useState<SavedNetwork[]>([
    {
      id: '1',
      ssid: 'МОЈА_БАШТА_ГЛАВНА',
      password: '••••••••••',
      autoConnect: true,
      lastConnected: '2024-12-21 14:30'
    },
    {
      id: '2',
      ssid: 'Dom_WiFi_5G',
      password: '••••••••••',
      autoConnect: false,
      lastConnected: '2024-12-20 09:15'
    }
  ]);

  const [wifiSettings, setWifiSettings] = useState({
    autoConnect: true,
    showHiddenNetworks: false,
    powerSaving: false,
    frequency: '2.4GHz' as '2.4GHz' | '5GHz' | 'auto'
  });

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Simulate finding new networks
      setAvailableNetworks(prev => [
        ...prev,
        {
          ssid: `Нова_Мрежа_${Math.floor(Math.random() * 100)}`,
          signal: Math.floor(Math.random() * 60) + 20,
          security: 'wpa2',
          connected: false,
          saved: false
        }
      ]);
    }, 2000);
  };

  const handleConnect = (ssid: string) => {
    setSelectedNetwork(ssid);
    const network = availableNetworks.find(n => n.ssid === ssid);
    if (network?.security === 'open') {
      // Connect directly for open networks
      connectToNetwork(ssid, '');
    } else {
      setShowConnectModal(true);
    }
  };

  const connectToNetwork = (ssid: string, pwd: string) => {
    setConnectionStatus('connecting');
    setShowConnectModal(false);
    
    setTimeout(() => {
      // Simulate connection
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        setConnectionStatus('connected');
        setAvailableNetworks(prev => 
          prev.map(network => ({
            ...network,
            connected: network.ssid === ssid
          }))
        );
        
        // Add to saved networks if not already saved
        if (!savedNetworks.find(n => n.ssid === ssid)) {
          setSavedNetworks(prev => [...prev, {
            id: Date.now().toString(),
            ssid,
            password: pwd ? '••••••••••' : '',
            autoConnect: true,
            lastConnected: new Date().toLocaleString('sr-RS')
          }]);
        }
      } else {
        setConnectionStatus('failed');
        setTimeout(() => setConnectionStatus('disconnected'), 3000);
      }
    }, 3000);
    
    setPassword('');
    setSelectedNetwork(null);
  };

  const getSignalIcon = (signal: number) => {
    if (signal >= 80) return <Signal className="w-4 h-4 text-green-400" />;
    if (signal >= 60) return <Signal className="w-4 h-4 text-yellow-400" />;
    if (signal >= 40) return <Signal className="w-4 h-4 text-orange-400" />;
    return <Signal className="w-4 h-4 text-red-400" />;
  };

  const getSecurityIcon = (security: string) => {
    if (security === 'open') return <Unlock className="w-4 h-4 text-gray-400" />;
    return <Lock className="w-4 h-4 text-blue-400" />;
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Повезано';
      case 'connecting': return 'Повезивање...';
      case 'failed': return 'Неуспешно повезивање';
      default: return 'Није повезано';
    }
  };

  const removeSavedNetwork = (id: string) => {
    setSavedNetworks(prev => prev.filter(network => network.id !== id));
  };

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Connection Status */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Router className="w-5 h-5 text-white flex-shrink-0" />
            <span className="text-white font-semibold">Статус Везе</span>
          </div>
          <div className={`flex items-center gap-2 ${getConnectionStatusColor()}`}>
            {connectionStatus === 'connected' ? <Wifi className="w-5 h-5 flex-shrink-0" /> : 
             connectionStatus === 'connecting' ? <RefreshCw className="w-5 h-5 animate-spin flex-shrink-0" /> :
             <WifiOff className="w-5 h-5 flex-shrink-0" />}
            <span className="font-medium text-sm sm:text-base">{getConnectionStatusText()}</span>
          </div>
        </div>

        {connectionStatus === 'connected' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-green-300 font-medium text-sm">Интернет</span>
              </div>
              <div className="text-sm text-green-200">Активан</div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Signal className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-blue-300 font-medium text-sm">Јачина Сигнала</span>
              </div>
              <div className="text-sm text-blue-200">95% (Одлично)</div>
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="text-purple-300 font-medium text-sm">Безбедност</span>
              </div>
              <div className="text-sm text-purple-200">WPA2 Заштићено</div>
            </div>
          </div>
        )}

        {connectionStatus === 'failed' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-red-300 font-medium text-sm">Грешка при повезивању</span>
            </div>
            <div className="text-sm text-red-200">Проверите лозинку и покушајте поново</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Available Networks */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Scan className="w-5 h-5 text-white flex-shrink-0" />
              <span className="text-white font-semibold text-sm sm:text-base">Доступне Мреже</span>
            </div>
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap"
            >
              <RefreshCw className={`w-4 h-4 flex-shrink-0 ${isScanning ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isScanning ? 'Скенирање...' : 'Скенирај'}</span>
              <span className="sm:hidden">{isScanning ? '...' : 'Скен'}</span>
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {availableNetworks.map((network, index) => (
              <div
                key={index}
                className={`bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors ${
                  network.connected ? 'border-green-500/50 bg-green-500/10' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {getSignalIcon(network.signal)}
                      {getSecurityIcon(network.security)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-medium text-sm break-all">{network.ssid}</span>
                        {network.connected && (
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        )}
                        {network.saved && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-white/60 break-words">
                        {network.security.toUpperCase()} • {network.signal}%
                      </div>
                    </div>
                  </div>
                  
                  {!network.connected && (
                    <button
                      onClick={() => handleConnect(network.ssid)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0"
                    >
                      Повежи се
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Networks */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-white flex-shrink-0" />
            <span className="text-white font-semibold text-sm sm:text-base">Сачуване Мреже</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {savedNetworks.map((network) => (
              <div
                key={network.id}
                className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-white font-medium text-sm break-all">{network.ssid}</span>
                    {network.autoConnect && (
                      <div className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs whitespace-nowrap flex-shrink-0">
                        Аутоматски
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {/* Edit functionality */}}
                      className="p-1 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeSavedNetwork(network.id)}
                      className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-white/60 break-words">
                  Последње повезивање: {network.lastConnected}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WiFi Settings */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-white flex-shrink-0" />
          <span className="text-white font-semibold text-sm sm:text-base">WiFi Подешавања</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-white font-medium text-sm">Аутоматско повезивање</div>
                <div className="text-xs sm:text-sm text-white/60 break-words">Аутоматски се повежи на познате мреже</div>
              </div>
              <button
                onClick={() => setWifiSettings(prev => ({ ...prev, autoConnect: !prev.autoConnect }))}
                className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                  wifiSettings.autoConnect ? 'bg-green-500' : 'bg-gray-500'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  wifiSettings.autoConnect ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-white font-medium text-sm">Прикажи скривене мреже</div>
                <div className="text-xs sm:text-sm text-white/60 break-words">Укључи скривене SSID мреже у скен</div>
              </div>
              <button
                onClick={() => setWifiSettings(prev => ({ ...prev, showHiddenNetworks: !prev.showHiddenNetworks }))}
                className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                  wifiSettings.showHiddenNetworks ? 'bg-green-500' : 'bg-gray-500'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  wifiSettings.showHiddenNetworks ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-white font-medium text-sm">Штедња енергије</div>
                <div className="text-xs sm:text-sm text-white/60 break-words">Смањи потрошњу батерије</div>
              </div>
              <button
                onClick={() => setWifiSettings(prev => ({ ...prev, powerSaving: !prev.powerSaving }))}
                className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                  wifiSettings.powerSaving ? 'bg-green-500' : 'bg-gray-500'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  wifiSettings.powerSaving ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div>
              <div className="text-white font-medium mb-2 text-sm">Фреквенција</div>
              <select
                value={wifiSettings.frequency}
                onChange={(e) => setWifiSettings(prev => ({ ...prev, frequency: e.target.value as any }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="auto">Аутоматски</option>
                <option value="2.4GHz">2.4 GHz</option>
                <option value="5GHz">5 GHz</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm sm:text-base">Повежи се на мрежу</h3>
              <button
                onClick={() => setShowConnectModal(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Мрежа</label>
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm break-all">
                  {selectedNetwork}
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Лозинка</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 pr-10 text-white placeholder-white/50 text-sm"
                    placeholder="Унесите лозинку"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => connectToNetwork(selectedNetwork!, password)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Повежи се
                </button>
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Откажи
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WiFiManagementPage;