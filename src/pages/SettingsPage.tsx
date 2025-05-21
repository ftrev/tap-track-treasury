
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, LogOut, User, Moon, Sun, Download, HelpCircle, Shield, Bell } from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { useTransactions } from '../contexts/TransactionContext';
import { Switch } from "../components/ui/switch";
import { useTheme } from '../contexts/ThemeContext';

const SettingsPage = () => {
  const { userName, setUserName } = useTransactions();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair? Seus dados serão mantidos.')) {
      setUserName('');
      navigate('/');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-finance-backgroundAlt pb-16">
      <div className="container px-4 py-6 max-w-md mx-auto">
        <header className="mb-4 flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="mr-2 p-1"
            aria-label="Voltar"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold text-finance-text">Configurações</h1>
        </header>
        
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-md">
          <div className="flex items-center mb-2">
            <div className="w-12 h-12 rounded-full bg-finance-primary/10 flex items-center justify-center mr-3">
              <User size={24} className="text-finance-primary" />
            </div>
            <div>
              <div className="font-medium">{userName}</div>
              <div className="text-xs text-gray-500">Usuário</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-md">
          <h2 className="text-lg font-medium mb-4 text-finance-text">Preferências</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  {theme === 'dark' ? 
                    <Moon size={20} className="text-gray-600" /> : 
                    <Sun size={20} className="text-amber-500" />
                  }
                </div>
                <div>
                  <div className="font-medium">Tema escuro</div>
                  <div className="text-xs text-gray-500">Mudar aparência do aplicativo</div>
                </div>
              </div>
              <Switch 
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
            
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => navigate('/export')}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <Download size={20} className="text-gray-600" />
                </div>
                <div>
                  <div className="font-medium">Exportar dados</div>
                  <div className="text-xs text-gray-500">Baixar transações em CSV ou JSON</div>
                </div>
              </div>
              <ChevronLeft size={20} className="text-gray-400 transform rotate-180" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <Bell size={20} className="text-gray-600" />
                </div>
                <div>
                  <div className="font-medium">Notificações</div>
                  <div className="text-xs text-gray-500">Configurar alertas</div>
                </div>
              </div>
              <ChevronLeft size={20} className="text-gray-400 transform rotate-180" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-md">
          <h2 className="text-lg font-medium mb-4 text-finance-text">Suporte</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <HelpCircle size={20} className="text-gray-600" />
                </div>
                <div>
                  <div className="font-medium">Ajuda</div>
                  <div className="text-xs text-gray-500">Perguntas frequentes</div>
                </div>
              </div>
              <ChevronLeft size={20} className="text-gray-400 transform rotate-180" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <Shield size={20} className="text-gray-600" />
                </div>
                <div>
                  <div className="font-medium">Política de privacidade</div>
                  <div className="text-xs text-gray-500">Como usamos seus dados</div>
                </div>
              </div>
              <ChevronLeft size={20} className="text-gray-400 transform rotate-180" />
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full bg-white text-finance-alert border border-finance-alert/20 rounded-xl py-3 px-4 flex items-center justify-center mb-6"
        >
          <LogOut size={20} className="mr-2" />
          <span>Sair do aplicativo</span>
        </button>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default SettingsPage;
