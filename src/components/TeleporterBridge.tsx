import React, { useState } from 'react';
import { 
  Send, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Radio, 
  Shield, 
  ExternalLink,
  Cpu,
  RefreshCw,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ZKProof, TeleporterMessage } from '../types';
import { generateRandomHex, truncateHash } from '../utils/crypto';

interface TeleporterBridgeProps {
  availableProofs: ZKProof[];
  activeProof: ZKProof | null;
}

export const TeleporterBridge: React.FC<TeleporterBridgeProps> = ({
  availableProofs,
  activeProof,
}) => {
  const [selectedProofId, setSelectedProofId] = useState<string>(
    activeProof?.id || availableProofs[0]?.id || ''
  );
  
  const targetSubnets = [
    {
      id: 'subnet-dexalot',
      name: 'Dexalot Trading Subnet',
      chainId: 432204,
      receiverContract: '0x18F4bA098234bcdaef1092834710293847102938',
      description: 'Acceso a libros de órdenes limitadas centralizados (CLOB) sin KYC invasivo ni requisitos de depósito masivo.',
    },
    {
      id: 'subnet-dfk',
      name: 'DFK Kingdom Gaming Subnet',
      chainId: 53935,
      receiverContract: '0x71C0192AaBC982103498bCe98721498710294109',
      description: 'Desbloqueo de reputación y acceso a gremios de alto nivel basado en solvencia DeFi comprobada por ZK.',
    },
    {
      id: 'subnet-evergreen',
      name: 'Avalanche Evergreen Institutional Subnet',
      chainId: 77991,
      receiverContract: '0x9920acfa8472191829bc81902bc348e89f1a2384',
      description: 'Cumplimiento normativo y validación de solvencia institucional manteniendo privacidad bancaria estricta.',
    },
  ];

  const [selectedTargetSubnetId, setSelectedTargetSubnetId] = useState<string>('subnet-dexalot');
  const [isBridging, setIsBridging] = useState<boolean>(false);
  const [bridgeStep, setBridgeStep] = useState<number>(0);
  const [blsSignaturesCount, setBlsSignaturesCount] = useState<number>(0);

  const [dispatchedMessages, setDispatchedMessages] = useState<TeleporterMessage[]>([
    {
      id: 'msg-tele-01',
      proofId: 'proof-seed-sample',
      proofTitle: 'Volumen Acumulado Mayor a $50,000 USD',
      sourceChain: {
        name: 'Avalanche C-Chain',
        chainId: 43114,
        contractAddress: '0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf',
      },
      targetChain: {
        name: 'Dexalot Trading Subnet',
        chainId: 432204,
        receiverContract: '0x18F4bA098234bcdaef1092834710293847102938',
      },
      status: 'delivered',
      nonce: 1042,
      validatorSignaturesCount: 22,
      requiredSignatures: 18,
      txHashSource: '0x9812bcdaef109283471029384710293847102938471029384710293847102938',
      txHashTarget: '0x4489102938471029384710293847102938471029384710293847102938471029',
      timestamp: '2026-10-13 19:30:14 UTC',
      gasFeeAvax: 0.0042,
      payloadHash: '0x3f8a92bc019284758129034871029487bcdaef1092834710293847109283471',
    },
  ]);

  const currentProof = availableProofs.find(p => p.id === selectedProofId) || availableProofs[0];
  const currentTargetSubnet = targetSubnets.find(s => s.id === selectedTargetSubnetId) || targetSubnets[0];

  const handleLaunchTeleport = async () => {
    if (!currentProof) return;
    setIsBridging(true);
    setBridgeStep(1);
    setBlsSignaturesCount(0);

    // Step 1: Pack message & emit on C-Chain
    await new Promise(r => setTimeout(r, 600));
    setBridgeStep(2);

    // Step 2: BLS Validators aggregate signatures (Snowman consensus)
    for (let count = 4; count <= 20; count += 4) {
      await new Promise(r => setTimeout(r, 250));
      setBlsSignaturesCount(count);
    }
    setBridgeStep(3);

    // Step 3: Relayer delivers via TeleporterMessenger
    await new Promise(r => setTimeout(r, 600));
    setBridgeStep(4);

    const sourceTx = generateRandomHex(32);
    const targetTx = generateRandomHex(32);
    const payloadHash = generateRandomHex(32);

    const newTeleMsg: TeleporterMessage = {
      id: `msg-tele-${Date.now()}`,
      proofId: currentProof.id,
      proofTitle: currentProof.statementText,
      sourceChain: {
        name: 'Avalanche C-Chain',
        chainId: 43114,
        contractAddress: '0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf',
      },
      targetChain: {
        name: currentTargetSubnet.name,
        chainId: currentTargetSubnet.chainId,
        receiverContract: currentTargetSubnet.receiverContract,
      },
      status: 'delivered',
      nonce: Math.floor(Math.random() * 2000 + 1050),
      validatorSignaturesCount: 20,
      requiredSignatures: 18,
      txHashSource: sourceTx,
      txHashTarget: targetTx,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      gasFeeAvax: 0.0038,
      payloadHash,
    };

    setDispatchedMessages(prev => [newTeleMsg, ...prev]);
    setIsBridging(false);

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#E84142', '#06B6D4', '#FFFFFF'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-b from-[#111827] to-[#0B0F19] border border-[#1F2937] p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E84142] uppercase tracking-wider mb-2">
            <span>Avalanche Teleporter</span>
            <span aria-hidden="true">·</span>
            <span>Avalanche Warp Messaging (AWM)</span>
            <span aria-hidden="true">·</span>
            <span>Interoperabilidad Descentralizada</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Puente Cross-Chain Teleporter & AWM
          </h1>
          <p className="mt-3 text-base text-slate-300 leading-relaxed">
            Exporta tus atestaciones de prueba ZK desde la C-Chain de Avalanche hacia cualquier Subnet o red compatible sin puentes centralizados ni riesgo de custodia, verificado directamente por el conjunto de validadores nativos de Avalanche con firmas BLS agregadas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Teleporter Dispatch Configuration */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-xl bg-[#111827] border border-[#1F2937] space-y-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              1. Configuración de Mensaje Warp
            </span>

            {/* Source Chain */}
            <div className="p-4 rounded-lg bg-[#0B0F19] border border-[#1F2937] flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Cadena de Origen (Source Chain)</span>
                <span className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#E84142]"></span>
                  Avalanche C-Chain (Chain ID: 43114)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Protocolo</span>
                <span className="text-xs font-mono text-[#E84142]">AWM Native</span>
              </div>
            </div>

            {/* Select Destination Subnet */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">
                Seleccionar Subnet o Red de Destino:
              </label>
              <div className="space-y-2.5">
                {targetSubnets.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedTargetSubnetId(sub.id)}
                    className={`w-full p-3.5 rounded-lg border text-left transition-all ${
                      selectedTargetSubnetId === sub.id
                        ? 'bg-[#0B0F19] border-[#E84142] ring-1 ring-[#E84142]/40'
                        : 'bg-[#0B0F19] border-[#1F2937] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">
                        {sub.name}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Chain ID: {sub.chainId}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {sub.description}
                    </p>
                    <div className="mt-2 text-xs font-mono text-slate-500 truncate">
                      Receptor: {sub.receiverContract}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Select ZK Proof to Teleport */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">
                Atestación ZK a Teletransportar:
              </label>
              {availableProofs.length > 0 ? (
                <select
                  value={selectedProofId}
                  onChange={e => setSelectedProofId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1F2937] text-sm text-slate-200 focus:outline-none focus:border-[#E84142]"
                >
                  {availableProofs.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.statementText} ({p.credentialTitle})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 rounded-lg bg-[#0B0F19] border border-[#1F2937] text-xs text-slate-400">
                  No tienes pruebas ZK generadas aún. Genera una en el Estudio ZK para teletransportarla.
                </div>
              )}
            </div>

            {/* Gas & Details summary */}
            <div className="pt-2 border-t border-[#1F2937] flex items-center justify-between text-xs">
              <div className="text-slate-400">
                <span>Tarifa Estimada de Gas: </span>
                <span className="font-mono text-white font-semibold tabular-nums">0.0038 AVAX</span>
              </div>
              <div className="text-slate-400">
                <span>Latencia de Consenso: </span>
                <span className="font-mono text-emerald-400 tabular-nums">~1.5s (Sub-segundo)</span>
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-1">
              <button
                disabled={isBridging || !currentProof}
                onClick={handleLaunchTeleport}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#E84142] to-[#B91C1C] hover:from-[#DC2626] hover:to-[#991B1B] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isBridging ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    Teletransportando con Avalanche Warp Messaging...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Despachar Atestación a {currentTargetSubnet.name}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Consensus Animation & History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Bridging Status */}
          {isBridging && (
            <div className="p-6 rounded-xl bg-[#111827] border border-[#E84142] space-y-4 animate-fade-in shadow-xl">
              <div className="flex items-center gap-2.5 text-[#E84142]">
                <Radio className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-bold text-white">Consenso AWM en Progreso</span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className={`flex items-center gap-2 ${bridgeStep >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span>{bridgeStep >= 1 ? '✓' : '○'}</span>
                  <span>Serializando mensaje en contrato TeleporterMessenger...</span>
                </div>
                <div className={`flex items-center gap-2 ${bridgeStep >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span>{bridgeStep >= 2 ? '✓' : '○'}</span>
                  <span>
                    Firmas BLS de Validadores P-Chain: {blsSignaturesCount}/24 (Umbral: 18)
                  </span>
                </div>
                <div className={`flex items-center gap-2 ${bridgeStep >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span>{bridgeStep >= 3 ? '✓' : '○'}</span>
                  <span>Transmitiendo mensaje Warp a {currentTargetSubnet.name}...</span>
                </div>
                <div className={`flex items-center gap-2 ${bridgeStep >= 4 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span>{bridgeStep >= 4 ? '✓' : '○'}</span>
                  <span>Atestación entregada y registrada en destino.</span>
                </div>
              </div>
            </div>
          )}

          {/* History of Dispatched Messages */}
          <div className="p-6 rounded-xl bg-[#111827] border border-[#1F2937] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Historial de Atestaciones Cross-Chain ({dispatchedMessages.length})
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Teleporter Activo
              </span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {dispatchedMessages.map(msg => (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-lg bg-[#0B0F19] border border-[#1F2937] space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-white">
                      {msg.proofTitle}
                    </span>
                    <span className="text-emerald-400 font-mono text-[11px] bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                      Entregado
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                    <span>{msg.sourceChain.name}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span className="text-[#E84142]">{msg.targetChain.name}</span>
                  </div>

                  <div className="pt-2 border-t border-[#1F2937] grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                    <div>
                      <span className="text-slate-500 block">Nonce Warp:</span>
                      <span className="text-slate-300">#{msg.nonce}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Validadores BLS:</span>
                      <span className="text-slate-300">{msg.validatorSignaturesCount}/{msg.requiredSignatures} firmas</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Tx Origen:</span>
                      <span className="text-slate-300">{truncateHash(msg.txHashSource, 6, 4)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Tx Destino:</span>
                      <span className="text-slate-300">{truncateHash(msg.txHashTarget || '', 6, 4)}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                    <span>{msg.timestamp}</span>
                    <span>Gas: {msg.gasFeeAvax} AVAX</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
