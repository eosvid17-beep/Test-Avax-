import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  Coins, 
  Vote, 
  Server, 
  ShieldCheck, 
  Award,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SoulboundCredential, WalletAccount } from '../types';
import { generateRandomHex } from '../utils/crypto';

interface MintCredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletAccount;
  onCredentialMinted: (newCred: SoulboundCredential) => void;
}

export const MintCredentialModal: React.FC<MintCredentialModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onCredentialMinted,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [mintStep, setMintStep] = useState<number>(0);

  if (!isOpen) return null;

  const templates = [
    {
      name: 'Avalanche Ecosystem Builder',
      category: 'developer' as const,
      iconName: 'Award',
      description: 'Atestación de despliegue de contratos inteligentes verificados en la C-Chain de Avalanche con más de 500 interacciones de usuarios.',
      protocol: 'Avalanche Developer Protocol',
      zkClaim: 'Contratos Desplegados ≥ 3',
      actualVol: '$75,000 USD en valor asegurado',
      exactNum: 5,
    },
    {
      name: 'TraderJoe V2 Liquidity Master',
      category: 'defi' as const,
      iconName: 'Coins',
      description: 'Provisión activa en Liquidity Book de TraderJoe con volumen en pools de AVAX/USDC superior a $80,000 USD sin pérdida impermanente severa.',
      protocol: 'TraderJoe Liquidity Book',
      zkClaim: 'Volumen en Pools ≥ $50,000 USD',
      actualVol: '$92,400.00 USD',
      exactNum: 92400,
    },
    {
      name: 'Avalanche Subnet Architect',
      category: 'subnet' as const,
      iconName: 'Server',
      description: 'Configuración y despliegue exitoso de una Subnet personalizada con máquina virtual Subnet-EVM y puente Teleporter activado.',
      protocol: 'Avalanche Subnet CLI & Teleporter',
      zkClaim: 'Subnets Creadas ≥ 1',
      actualVol: '1 Subnet Productiva',
      exactNum: 1,
    },
  ];

  const currentTpl = templates[selectedTemplate];

  const handleExecuteMint = async () => {
    setIsMinting(true);
    setMintStep(1);

    // Step 1: Querying Avalanche RPC
    await new Promise(r => setTimeout(r, 600));
    setMintStep(2);

    // Step 2: Hashing Merkle tree
    await new Promise(r => setTimeout(r, 650));
    setMintStep(3);

    // Step 3: Minting EIP-5192 Soulbound NFT on Avalanche C-Chain
    await new Promise(r => setTimeout(r, 700));

    const newTokenId = Math.floor(Math.random() * 5000 + 5000);
    const newTxHash = generateRandomHex(32);
    const newMerkleRoot = generateRandomHex(32);
    const newSecretSalt = generateRandomHex(16);

    const newCred: SoulboundCredential = {
      id: `cred-${Date.now()}`,
      tokenId: newTokenId,
      name: currentTpl.name,
      category: currentTpl.category,
      description: currentTpl.description,
      iconName: currentTpl.iconName,
      issuedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      blockNumber: Math.floor(Math.random() * 20000 + 51200000),
      txHash: newTxHash,
      issuerName: currentTpl.protocol,
      issuerDid: `did:avax:c-chain:${generateRandomHex(20)}`,
      merkleRoot: newMerkleRoot,
      issuerSignature: generateRandomHex(32).slice(0, 42),
      publicAttributes: {
        categoria: currentTpl.protocol,
        antiguedadMinima: '≥ 3 Meses',
        protocolo: currentTpl.protocol,
        estadoOnChain: 'Válido y No Revocado',
      },
      privateAttributes: {
        balanceExacto: `${wallet.balanceAvax} AVAX`,
        volumenHistoricoUsd: currentTpl.actualVol,
        direccionesAsociadas: [wallet.address],
        propuestasVotadasExactas: 12,
        uptimeValidador: '99.9%',
        saltSecreto: newSecretSalt,
      },
      zkStatements: [
        {
          id: `stmt-mint-${Date.now()}`,
          title: currentTpl.zkClaim,
          description: `Demuestra ${currentTpl.zkClaim} sin revelar la actividad transaccional privada.`,
          claimType: 'greater_than',
          targetField: 'volumenHistoricoUsd',
          thresholdDisplay: currentTpl.zkClaim,
          predicateStatement: `${currentTpl.zkClaim}`,
        },
      ],
    };

    onCredentialMinted(newCred);
    setIsMinting(false);
    onClose();

    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#E84142', '#38BDF8', '#10B981'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-2xl p-6 text-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E84142]/20 border border-[#E84142]/40 flex items-center justify-center text-[#E84142]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Acreditar Nueva Actividad On-Chain</h2>
              <p className="text-xs text-slate-400">Emisión de medalla Soulbound (EIP-5192) verificada en Avalanche</p>
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
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Selecciona el tipo de logro a validar con los nodos de Avalanche:
          </label>

          <div className="space-y-2.5">
            {templates.map((tpl, idx) => (
              <button
                key={tpl.name}
                onClick={() => setSelectedTemplate(idx)}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  selectedTemplate === idx
                    ? 'bg-[#111827] border-[#E84142] ring-1 ring-[#E84142]/40'
                    : 'bg-[#111827] border-[#1F2937] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    {tpl.name}
                  </span>
                  <span className="text-xs font-mono text-emerald-400">
                    {tpl.zkClaim}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-300">
                  {tpl.description}
                </p>
                <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
                  <span>Emisor: {tpl.protocol}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-300 font-mono">EIP-5192 SBT</span>
                </div>
              </button>
            ))}
          </div>

          {/* Minting progress animation */}
          {isMinting && (
            <div className="p-4 rounded-lg bg-[#111827] border border-[#E84142] space-y-2 font-mono text-xs">
              <div className="flex items-center gap-2 text-[#E84142] font-sans font-bold">
                <Cpu className="w-4 h-4 animate-spin" />
                <span>Procesando emisión on-chain...</span>
              </div>
              <div className={mintStep >= 1 ? 'text-emerald-400' : 'text-slate-500'}>
                {mintStep >= 1 ? '✓' : '○'} Verificando historial de transacciones en C-Chain RPC...
              </div>
              <div className={mintStep >= 2 ? 'text-emerald-400' : 'text-slate-500'}>
                {mintStep >= 2 ? '✓' : '○'} Computando raíz del árbol de Merkle y firma EIP-712...
              </div>
              <div className={mintStep >= 3 ? 'text-emerald-400' : 'text-slate-500'}>
                {mintStep >= 3 ? '✓' : '○'} Acuñando NFT Soulbound en la dirección de custodia...
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>

          <button
            disabled={isMinting}
            onClick={handleExecuteMint}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#E84142] hover:bg-[#D93839] rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            {isMinting ? 'Acuñando...' : 'Acreditar y Acuñar SBT On-Chain'}
          </button>
        </div>
      </div>
    </div>
  );
};
