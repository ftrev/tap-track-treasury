
import React from 'react';
import { BottomNavigation } from '../components/BottomNavigation';
import { ChevronLeft, ChevronRight, Bell, Lock, HelpCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();

  const SettingItem = ({ icon, title, onClick }: { icon: React.ReactNode, title: string, onClick: () => void }) => (
    <button 
      className="flex items-center justify-between w-full py-3 px-1 border-b border-gray-100"
      onClick={onClick}
    >
      <div className="flex items-center">
        {icon}
        <span className="ml-3">{title}</span>
      </div>
      <ChevronRight size={18} className="text-gray-400" />
    </button>
  );

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
        
        <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
          <div className="flex items-center mb-4 pb-3 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-finance-primary flex items-center justify-center text-white font-bold">
              U
            </div>
            <div className="ml-3">
              <div className="font-medium">Usuário</div>
              <div className="text-sm text-gray-500">usuario@email.com</div>
            </div>
          </div>
          
          <SettingItem 
            icon={<Bell size={20} className="text-finance-primary" />}
            title="Notificações"
            onClick={() => {}}
          />
          
          <SettingItem 
            icon={<Lock size={20} className="text-finance-primary" />}
            title="Privacidade e Segurança"
            onClick={() => {}}
          />
          
          <SettingItem 
            icon={<HelpCircle size={20} className="text-finance-primary" />}
            title="Ajuda e Suporte"
            onClick={() => {}}
          />
          
          <SettingItem 
            icon={<Info size={20} className="text-finance-primary" />}
            title="Sobre o Aplicativo"
            onClick={() => {}}
          />
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <button className="w-full py-2 text-center text-finance-alert">
            Sair
          </button>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default SettingsPage;
