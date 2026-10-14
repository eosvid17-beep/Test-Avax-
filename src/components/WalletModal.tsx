import React, { useState } from 'react';
import { X, Check, Copy, Key, Shield, RefreshCw, ExternalLink, Download } from 'lucide-react';
import { WalletAccount } from '../types';
import { generateRandomHex } from '../utils/crypto';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletAccount;
  onUpdateWallet: (updated: WalletAccount) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onUpdateWallet,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleGenerateNewIdentity = () => {
    const newAddress = '0x' + generateRandomHex(20).slice(2);
    const newSalt = generateRandomHex(16);
    const newPkZk = '0xzk' + generateRandomHex(16).slice(2);
    onUpdateWallet({
      ...wallet,
      address: newAddress,
      did: `did:avax:c-chain:${newAddress}`,
      balanceAvax: Math.floor(Math.random() * 2500 + 400),
      publicKeyZk: newPkZk,
      privateKeySalt: newSalt,
      isCustodial: false,
    });
  };

  const handleExportIdentityJson = () => {
    const identityDump = {
      version: '1.0',
      standard: 'W3C-DID-Avalanche-C-Chain',
      did: wallet.did,
      address: wallet.address,
      publicKeyZk: wallet.publicKeyZk,
      network: wallet.networkName,
      chainId: wallet.chainId,
      timestamp: new Date().toISOString(),
      privacyProtocol: 'Groth16/BN128-Selective-Disclosure',
    };
    const blob = new Blob([JSON.stringify(identityDump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `identity-${wallet.address.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-2xl p-6 text-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E84142]/20 border border-[#E84142]/40 flex items-center justify-center text-[#E84142]">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Monedero Auto-Custodiado</h2>
              <p className="text-xs text-slate-400">Control criptográfico soberano de credenciales en Avalanche</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Network & Balance card */}
          <div className="p-4 rounded-lg bg-[#111827] border border-[#1F2937] flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Red Conectada</div>
              <div className="text-sm font-semibold text-white flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#E84142]"></span>
                {wallet.networkName} (Chain ID: {wallet.chainId})
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Balance Soberano</div>
              <div className="text-base font-bold text-white font-mono tabular-nums mt-0.5">
                {wallet.balanceAvax.toLocaleString()} AVAX
              </div>
            </div>
          </div>

          {/* Identity DID */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Identificador Descentralizado (DID)</span>
              <button
                onClick={() => handleCopy(wallet.did, 'did')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                {copiedField === 'did' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copiedField === 'did' ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-[#1F2937] text-xs font-mono text-slate-300 break-all select-all">
              {wallet.did}
            </div>
          </div>

          {/* Wallet Address */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Dirección de Custodia C-Chain</span>
              <button
                onClick={() => handleCopy(wallet.address, 'address')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                {copiedField === 'address' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copiedField === 'address' ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-[#1F2937] text-xs font-mono text-slate-300 break-all select-all">
              {wallet.address}
            </div>
          </div>

          {/* ZK Identity Public Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Clave Pública ZK (Para Verificación Cero-Conocimiento)</span>
              <button
                onClick={() => handleCopy(wallet.publicKeyZk, 'zkKey')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                {copiedField === 'zkKey' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copiedField === 'zkKey' ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-[#1F2937] text-xs font-mono text-[#06B6D4] break-all select-all">
              {wallet.publicKeyZk}
            </div>
          </div>

          {/* Privacy Security Note */}
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs text-emerald-300/90 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Tus credenciales y saldos están protegidos por tu salt secreto local. Cuando generas pruebas ZK, los protocolos externos solo reciben la prueba de veracidad sin conocer tu dirección ni tus fondos exactos.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center justify-between gap-3">
          <button
            onClick={handleGenerateNewIdentity}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Generar Nueva Identidad
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportIdentityJson}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white bg-[#111827] hover:bg-[#1F2937] border border-[#374151] rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              Exportar DID (.json)
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#E84142] hover:bg-[#D93839] rounded-lg transition-colors"
            >
              Listo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
