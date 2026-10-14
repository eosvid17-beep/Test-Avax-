import React from 'react';
import { Shield, Wallet, ArrowUpRight } from 'lucide-react';
import { WalletAccount } from '../types';
import { truncateHash } from '../utils/crypto';

interface NavbarProps {
  currentTab: 'vault' | 'zk-studio' | 'verifier' | 'teleporter';
  onSelectTab: (tab: 'vault' | 'zk-studio' | 'verifier' | 'teleporter') => void;
  wallet: WalletAccount;
  onOpenWalletModal: () => void;
  onOpenMintModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  wallet,
  onOpenWalletModal,
  onOpenMintModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1F2937] bg-[#0B0F19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single element brand wordmark */}
        <button
          onClick={() => onSelectTab('vault')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#E84142]/15 border border-[#E84142]/30 flex items-center justify-center text-[#E84142] group-hover:border-[#E84142] transition-colors">
            <Shield className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            AvaZK Identity
          </span>
        </button>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => onSelectTab('vault')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              currentTab === 'vault'
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bóveda NFTs
            {currentTab === 'vault' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E84142]" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('zk-studio')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              currentTab === 'zk-studio'
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Estudio ZK
            {currentTab === 'zk-studio' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#06B6D4]" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('verifier')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              currentTab === 'verifier'
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Verificador ZK
            {currentTab === 'verifier' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#38BDF8]" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('teleporter')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              currentTab === 'teleporter'
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Teleporter AWM
            {currentTab === 'teleporter' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E84142]" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenMintModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#111827] hover:bg-[#1F2937] border border-[#1F2937] rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Acreditar Actividad
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={onOpenWalletModal}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#E84142] hover:bg-[#D93839] rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span className="font-mono tabular-nums">
              {wallet.isConnected ? truncateHash(wallet.address, 6, 4) : 'Conectar Wallet'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
