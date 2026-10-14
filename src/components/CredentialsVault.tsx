import React, { useState } from 'react';
import { 
  Coins, 
  Vote, 
  Server, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  FileCode2, 
  ArrowRight,
  ExternalLink,
  PlusCircle
} from 'lucide-react';
import { SoulboundCredential, CredentialCategory } from '../types';
import { truncateHash } from '../utils/crypto';

interface CredentialsVaultProps {
  credentials: SoulboundCredential[];
  onSelectForZK: (credential: SoulboundCredential) => void;
  onOpenMintModal: () => void;
}

export const CredentialsVault: React.FC<CredentialsVaultProps> = ({
  credentials,
  onSelectForZK,
  onOpenMintModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inspectCredential, setInspectCredential] = useState<SoulboundCredential | null>(null);
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});

  const filterCategories = [
    { id: 'all', label: 'Todas las Credenciales' },
    { id: 'defi', label: 'DeFi & Liquidez' },
    { id: 'dao', label: 'Gobernanza DAO' },
    { id: 'subnet', label: 'Subnets & Nodos' },
    { id: 'security', label: 'Seguridad & Crédito' },
  ];

  const filteredCredentials = credentials.filter(cred => {
    if (selectedCategory === 'all') return true;
    return cred.category === selectedCategory;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coins':
        return <Coins className="w-5 h-5 text-amber-400" />;
      case 'Vote':
        return <Vote className="w-5 h-5 text-indigo-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-red-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-cyan-400" />;
    }
  };

  const toggleSecretReveal = (id: string) => {
    setRevealedSecrets(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Intro Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#111827] to-[#0B0F19] border border-[#1F2937] p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E84142] uppercase tracking-wider mb-2">
            <span>Avalanche C-Chain SBT Standard</span>
            <span aria-hidden="true">·</span>
            <span>EIP-5192 Soulbound</span>
            <span aria-hidden="true">·</span>
            <span>Intransferible</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Bóveda Soberana de Credenciales NFT
          </h1>
          <p className="mt-3 text-base text-slate-300 leading-relaxed">
            Tus actividades on-chain quedan selladas criptográficamente como medallas intransferibles en Avalanche. Tus datos y balances reales permanecen cifrados bajo tu control, listos para generar pruebas de conocimiento cero sin doxxing.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenMintModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#E84142] hover:bg-[#D93839] rounded-lg transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Acreditar Nueva Actividad On-Chain
            </button>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>{credentials.length} Credenciales Registradas</span>
              <span aria-hidden="true">·</span>
              <span>100% Verificación Local</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#1F2937] pb-4">
        <div className="flex items-center gap-1.5 p-1 bg-[#111827] border border-[#1F2937] rounded-lg">
          {filterCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#1F2937] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400">
          Mostrando {filteredCredentials.length} credenciales
        </div>
      </div>

      {/* Grid of Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredCredentials.map(cred => (
          <div
            key={cred.id}
            className="group relative rounded-xl bg-[#111827] border border-[#1F2937] hover:border-[#374151] transition-all p-6 flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0B0F19] border border-[#1F2937] flex items-center justify-center">
                    {getIcon(cred.iconName)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#E84142] transition-colors">
                      {cred.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>Token #{cred.tokenId}</span>
                      <span aria-hidden="true">·</span>
                      <span>{cred.publicAttributes.protocolo}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                    SBT Verificado
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-slate-300 leading-normal">
                {cred.description}
              </p>

              {/* Public metadata summary without pills */}
              <div className="mt-4 pt-3 border-t border-[#1F2937] grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Antigüedad Requerida</span>
                  <span className="text-slate-200 font-medium">{cred.publicAttributes.antiguedadMinima}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Emisor Atestador</span>
                  <span className="text-slate-200 font-medium truncate block">{cred.issuerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Bloque C-Chain</span>
                  <span className="text-slate-300 font-mono tabular-nums">#{cred.blockNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Merkle Root</span>
                  <span className="text-slate-300 font-mono tabular-nums">{truncateHash(cred.merkleRoot, 6, 4)}</span>
                </div>
              </div>

              {/* Statements available */}
              <div className="mt-4 p-3 rounded-lg bg-[#0B0F19] border border-[#1F2937]">
                <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1.5 font-medium">
                  <Lock className="w-3.5 h-3.5 text-[#06B6D4]" />
                  <span>Declaraciones ZK Disponibles ({cred.zkStatements.length}):</span>
                </div>
                <div className="space-y-1">
                  {cred.zkStatements.map(stmt => (
                    <div key={stmt.id} className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="text-[#06B6D4]">▸</span>
                      <span>{stmt.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-[#1F2937] flex items-center justify-between gap-3">
              <button
                onClick={() => setInspectCredential(cred)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#0B0F19] hover:bg-[#1F2937] border border-[#1F2937] rounded-lg transition-colors"
              >
                <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
                Inspeccionar Criptografía
              </button>

              <button
                onClick={() => onSelectForZK(cred)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#E84142] hover:bg-[#D93839] rounded-lg transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Crear Prueba ZK
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to Inspect Cryptographic Details */}
      {inspectCredential && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-2xl p-6 text-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#0B0F19] border border-[#1F2937] flex items-center justify-center">
                  {getIcon(inspectCredential.iconName)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    Inspección Criptográfica: {inspectCredential.name}
                  </h2>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>Token #{inspectCredential.tokenId}</span>
                    <span aria-hidden="true">·</span>
                    <span>Emitido: {inspectCredential.issuedAt}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setInspectCredential(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {/* Public vs Private Attributes explanation */}
              <div className="p-3.5 rounded-lg bg-[#111827] border border-[#1F2937]">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Atributos Públicos (Visibles en la C-Chain de Avalanche)
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Categoría:</span>
                    <span className="text-slate-200 ml-2 font-medium">{inspectCredential.publicAttributes.categoria}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Protocolo:</span>
                    <span className="text-slate-200 ml-2 font-medium">{inspectCredential.publicAttributes.protocolo}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Requisito Antigüedad:</span>
                    <span className="text-slate-200 ml-2 font-medium">{inspectCredential.publicAttributes.antiguedadMinima}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Estado On-Chain:</span>
                    <span className="text-emerald-400 ml-2 font-medium">{inspectCredential.publicAttributes.estadoOnChain}</span>
                  </div>
                </div>
              </div>

              {/* Private Shielded Attributes */}
              <div className="p-3.5 rounded-lg bg-[#0B0F19] border border-amber-900/30">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    Atributos Privados Protegidos (Testigo ZK Oculto)
                  </h4>
                  <button
                    onClick={() => toggleSecretReveal(inspectCredential.id)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {revealedSecrets[inspectCredential.id] ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" /> Ocultar Secretos
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" /> Revelar en Pantalla
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Estos valores reales permanecen en tu custodia local. Solo tú puedes utilizarlos para generar la prueba ZK.
                </p>

                <div className="space-y-2 text-xs font-mono bg-[#111827] p-3 rounded-lg border border-[#1F2937]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-sans">Balance Real Almacenado:</span>
                    <span className="text-slate-200">
                      {revealedSecrets[inspectCredential.id] ? inspectCredential.privateAttributes.balanceExacto : '••••••••••••••••'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-sans">Volumen Histórico USD:</span>
                    <span className="text-slate-200">
                      {revealedSecrets[inspectCredential.id] ? inspectCredential.privateAttributes.volumenHistoricoUsd : '••••••••••••••••'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-sans">Votos Emitidos Exactos:</span>
                    <span className="text-slate-200">
                      {revealedSecrets[inspectCredential.id] ? `${inspectCredential.privateAttributes.propuestasVotadasExactas} votos` : '••••'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-sans">Salt Criptográfico Local:</span>
                    <span className="text-cyan-400">
                      {revealedSecrets[inspectCredential.id] ? inspectCredential.privateAttributes.saltSecreto : '••••••••••••••••••••••••'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hashes and Merkle state */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Árbol de Merkle Root (On-Chain)</span>
                  <div className="p-2 rounded bg-[#0B0F19] border border-[#1F2937] font-mono text-slate-300 break-all select-all">
                    {inspectCredential.merkleRoot}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Hash de Transacción de Acuñación</span>
                  <div className="p-2 rounded bg-[#0B0F19] border border-[#1F2937] font-mono text-slate-300 break-all select-all">
                    {inspectCredential.txHash}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Firma Criptográfica del Emisor</span>
                  <div className="p-2 rounded bg-[#0B0F19] border border-[#1F2937] font-mono text-slate-400 break-all select-all">
                    {inspectCredential.issuerSignature}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center justify-end gap-3">
              <button
                onClick={() => setInspectCredential(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  const cred = inspectCredential;
                  setInspectCredential(null);
                  onSelectForZK(cred);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#E84142] hover:bg-[#D93839] rounded-lg transition-colors"
              >
                Crear Prueba ZK Ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
