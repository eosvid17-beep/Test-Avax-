import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  Shield, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  ArrowRight, 
  Cpu, 
  EyeOff, 
  RotateCcw,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SoulboundCredential, ZKProof, WalletAccount } from '../types';
import { generateSyntheticZKProof, truncateHash } from '../utils/crypto';

interface ZKStudioProps {
  credentials: SoulboundCredential[];
  selectedCredential: SoulboundCredential | null;
  onSelectCredential: (cred: SoulboundCredential) => void;
  wallet: WalletAccount;
  onProofGenerated: (proof: ZKProof) => void;
  onNavigateToVerifier: (proof: ZKProof) => void;
  onNavigateToTeleporter: (proof: ZKProof) => void;
}

export const ZKStudio: React.FC<ZKStudioProps> = ({
  credentials,
  selectedCredential,
  onSelectCredential,
  wallet,
  onProofGenerated,
  onNavigateToVerifier,
  onNavigateToTeleporter,
}) => {
  const currentCred = selectedCredential || credentials[0];
  const [selectedStatementIndex, setSelectedStatementIndex] = useState<number>(0);
  
  // Selective Disclosure Configuration
  const [hideWalletAddress, setHideWalletAddress] = useState<boolean>(true);
  const [hideExactBalances, setHideExactBalances] = useState<boolean>(true);
  const [hideTimestampHistory, setHideTimestampHistory] = useState<boolean>(true);

  // Computing State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [generatedProof, setGeneratedProof] = useState<ZKProof | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const activeStatement = currentCred?.zkStatements[selectedStatementIndex] || currentCred?.zkStatements[0];

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleGenerateProof = async () => {
    if (!currentCred || !activeStatement) return;
    setIsGenerating(true);
    setCurrentStep(1);
    setGeneratedProof(null);

    // Step 1: Extract private witness
    await new Promise(r => setTimeout(r, 600));
    setCurrentStep(2);

    // Step 2: Compute commitment & nullifier
    await new Promise(r => setTimeout(r, 650));
    setCurrentStep(3);

    // Step 3: Circuit constraints evaluation
    await new Promise(r => setTimeout(r, 700));
    setCurrentStep(4);

    // Step 4: Groth16 synthesized proof
    let actualNum = 100000;
    let thresholdNum = 50000;
    if (activeStatement.id === 'stmt-vol-50k') {
      actualNum = 148920;
      thresholdNum = 50000;
    } else if (activeStatement.id === 'stmt-avax-1000') {
      actualNum = 1420;
      thresholdNum = 1000;
    } else if (activeStatement.id === 'stmt-dao-15') {
      actualNum = 26;
      thresholdNum = 15;
    } else if (activeStatement.id === 'stmt-uptime-99') {
      actualNum = 99.98;
      thresholdNum = 99.5;
    } else {
      actualNum = 1;
      thresholdNum = 1;
    }

    const proofData = await generateSyntheticZKProof({
      statementId: activeStatement.id,
      credentialId: currentCred.id,
      userDid: wallet.did,
      secretSalt: currentCred.privateAttributes.saltSecreto,
      actualValue: actualNum,
      thresholdValue: thresholdNum,
      predicateFormula: activeStatement.predicateStatement,
      merkleRoot: currentCred.merkleRoot,
      hideWallet: hideWalletAddress,
      hideExactValue: hideExactBalances,
    });

    const newProof: ZKProof = {
      id: `proof-${Date.now()}`,
      statementId: activeStatement.id,
      credentialId: currentCred.id,
      credentialTitle: currentCred.name,
      statementText: activeStatement.title,
      predicateFormula: activeStatement.predicateStatement,
      commitmentHash: proofData.commitment,
      nullifierHash: proofData.nullifier,
      merkleRoot: currentCred.merkleRoot,
      publicSignals: {
        thresholdPassed: proofData.isValid,
        verifierContract: '0x32A489F09182374619ef09cdaef778129bc48910',
        avalancheBlockSnapshot: 51049280,
        protocolTag: currentCred.publicAttributes.protocolo,
      },
      proofSnippet: {
        pi_a: proofData.pi_a,
        pi_b: proofData.pi_b,
        pi_c: proofData.pi_c,
        protocol: 'groth16',
        curve: 'bn128',
      },
      generatedAt: new Date().toISOString(),
      verified: true,
      selectiveDisclosure: {
        hideWalletAddress,
        hideExactBalances,
        hideTimestampHistory,
      },
      proofJsonString: '',
    };

    newProof.proofJsonString = JSON.stringify(newProof, null, 2);

    await new Promise(r => setTimeout(r, 400));
    setIsGenerating(false);
    setGeneratedProof(newProof);
    onProofGenerated(newProof);

    // Confetti celebration
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#06B6D4', '#E84142', '#38BDF8'],
      });
    } catch {
      // ignore
    }
  };

  const handleDownloadJson = (proof: ZKProof) => {
    const blob = new Blob([proof.proofJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zk-proof-${proof.statementId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-b from-[#111827] to-[#0B0F19] border border-[#1F2937] p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#06B6D4] uppercase tracking-wider mb-2">
            <span>Zero-Knowledge SNARKs</span>
            <span aria-hidden="true">·</span>
            <span>Groth16 / BN128</span>
            <span aria-hidden="true">·</span>
            <span>Revelación Selectiva</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Estudio Generador de Pruebas ZK
          </h1>
          <p className="mt-3 text-base text-slate-300 leading-relaxed">
            Genera pruebas matemáticas que demuestren que cumples con requisitos financieros, solvencia de colateral o participación en gobernanza de Avalanche, sin exponer en ningún momento tus direcciones ni balances reales.
          </p>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Select Credential */}
          <div className="p-6 rounded-xl bg-[#111827] border border-[#1F2937] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Paso 1: Seleccionar Credencial de Actividad
              </span>
              <span className="text-xs text-slate-500">
                {credentials.length} Disponibles
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {credentials.map(cred => (
                <button
                  key={cred.id}
                  onClick={() => {
                    onSelectCredential(cred);
                    setSelectedStatementIndex(0);
                    setGeneratedProof(null);
                  }}
                  className={`p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                    currentCred?.id === cred.id
                      ? 'bg-[#1F2937] border-[#06B6D4] shadow-sm'
                      : 'bg-[#0B0F19] border-[#1F2937] hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-sm text-white truncate">
                    {cred.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <span>Token #{cred.tokenId}</span>
                    <span aria-hidden="true">·</span>
                    <span>{cred.zkStatements.length} declaraciones</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select Predicate Statement */}
          <div className="p-6 rounded-xl bg-[#111827] border border-[#1F2937] space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Paso 2: Declaración a Demostrar Matemáticamente
            </span>

            <div className="space-y-2.5">
              {currentCred?.zkStatements.map((stmt, idx) => (
                <button
                  key={stmt.id}
                  onClick={() => {
                    setSelectedStatementIndex(idx);
                    setGeneratedProof(null);
                  }}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    selectedStatementIndex === idx
                      ? 'bg-[#0B0F19] border-[#06B6D4] ring-1 ring-[#06B6D4]/30'
                      : 'bg-[#0B0F19] border-[#1F2937] hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">
                      {stmt.title}
                    </span>
                    <span className="text-xs font-mono text-[#06B6D4] bg-[#06B6D4]/10 border border-[#06B6D4]/20 px-2 py-0.5 rounded">
                      {stmt.thresholdDisplay}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">
                    {stmt.description}
                  </p>
                  <div className="mt-2 text-xs font-mono text-slate-500">
                    Fórmula Circuito: {stmt.predicateStatement}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Selective Disclosure Privacy Toggles */}
          <div className="p-6 rounded-xl bg-[#111827] border border-[#1F2937] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Paso 3: Matriz de Revelación Selectiva (Privacidad)
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Máxima Confidencialidad
              </span>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg bg-[#0B0F19] border border-[#1F2937] cursor-pointer hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-[#1F2937] flex items-center justify-center text-slate-300">
                    <EyeOff className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Ocultar Dirección de Monedero</div>
                    <div className="text-xs text-slate-400">
                      Reemplaza tu wallet real por un Nullifier criptográfico de único uso
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hideWalletAddress}
                  onChange={e => setHideWalletAddress(e.target.checked)}
                  className="w-4 h-4 accent-[#06B6D4] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-[#0B0F19] border border-[#1F2937] cursor-pointer hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-[#1F2937] flex items-center justify-center text-slate-300">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Ocultar Saldos y Volúmenes Exactos</div>
                    <div className="text-xs text-slate-400">
                      Solo certifica que superas el umbral ({activeStatement?.thresholdDisplay}) sin revelar la cifra real
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hideExactBalances}
                  onChange={e => setHideExactBalances(e.target.checked)}
                  className="w-4 h-4 accent-[#06B6D4] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-[#0B0F19] border border-[#1F2937] cursor-pointer hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-[#1F2937] flex items-center justify-center text-slate-300">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Ocultar Marcas Temporales Históricas</div>
                    <div className="text-xs text-slate-400">
                      Impide correlaciones cruzadas por fecha y hora de emisión del bloque
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hideTimestampHistory}
                  onChange={e => setHideTimestampHistory(e.target.checked)}
                  className="w-4 h-4 accent-[#06B6D4] rounded"
                />
              </label>
            </div>

            <div className="pt-2">
              <button
                disabled={isGenerating}
                onClick={handleGenerateProof}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#06B6D4] to-[#0284C7] hover:from-[#0891B2] hover:to-[#0369A1] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    Computando Prueba ZK-SNARK...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Sintetizar y Generar Prueba ZK en Local
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Terminal & Output Proof */}
        <div className="lg:col-span-5 space-y-6">
          {/* Computing Progress Box */}
          {isGenerating && (
            <div className="p-6 rounded-xl bg-[#111827] border border-[#06B6D4]/40 space-y-4 animate-pulse">
              <div className="flex items-center gap-2.5 text-[#06B6D4]">
                <Cpu className="w-5 h-5 animate-spin" />
                <span className="text-sm font-bold">Ejecutando Circuito Cero-Conocimiento</span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span>{currentStep >= 1 ? '✓' : '○'}</span>
                  <span>Extrayendo testigo privado del monedero...</span>
                </div>
                <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span>{currentStep >= 2 ? '✓' : '○'}</span>
                  <span>Calculando compromiso Poseidon y Nullifier...</span>
                </div>
                <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span>{currentStep >= 3 ? '✓' : '○'}</span>
                  <span>Evaluando restricciones del sistema R1CS en BN128...</span>
                </div>
                <div className={`flex items-center gap-2 ${currentStep >= 4 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span>{currentStep >= 4 ? '✓' : '○'}</span>
                  <span>Generando polinomio Groth16 (pi_a, pi_b, pi_c)...</span>
                </div>
              </div>
            </div>
          )}

          {/* Generated Proof Certificate */}
          {generatedProof ? (
            <div className="p-6 rounded-xl bg-[#111827] border border-[#06B6D4] space-y-5 animate-fade-in shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-bold text-white">Certificado de Prueba ZK Generado</span>
                </div>
                <span className="text-xs font-mono text-[#06B6D4] bg-[#06B6D4]/10 border border-[#06B6D4]/30 px-2 py-0.5 rounded">
                  Groth16 / BN128
                </span>
              </div>

              {/* Verified statement */}
              <div className="p-3.5 rounded-lg bg-[#0B0F19] border border-[#1F2937]">
                <div className="text-xs text-slate-400">Aserción Pública Verificada:</div>
                <div className="text-sm font-semibold text-white mt-1">
                  {generatedProof.statementText}
                </div>
                <div className="text-xs font-mono text-[#06B6D4] mt-1">
                  Predicado: {generatedProof.predicateFormula}
                </div>
              </div>

              {/* Cryptographic hashes */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>Compromiso Criptográfico (Commitment):</span>
                    <button
                      onClick={() => handleCopy(generatedProof.commitmentHash, 'comm')}
                      className="hover:text-white flex items-center gap-1"
                    >
                      {copiedField === 'comm' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'comm' ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                  <div className="p-2 rounded bg-[#0B0F19] border border-[#1F2937] font-mono text-slate-300 break-all select-all">
                    {generatedProof.commitmentHash}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>Nullifier Criptográfico (Anti-Doble Gasto):</span>
                    <button
                      onClick={() => handleCopy(generatedProof.nullifierHash, 'null')}
                      className="hover:text-white flex items-center gap-1"
                    >
                      {copiedField === 'null' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'null' ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                  <div className="p-2 rounded bg-[#0B0F19] border border-[#1F2937] font-mono text-slate-300 break-all select-all">
                    {generatedProof.nullifierHash}
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 mb-1">Puntos de Curva Elíptica (pi_a, pi_b):</div>
                  <div className="p-2 rounded bg-[#0B0F19] border border-[#1F2937] font-mono text-slate-400 space-y-0.5">
                    <div>pi_a[0]: {generatedProof.proofSnippet.pi_a[0]}</div>
                    <div>pi_b[0][0]: {generatedProof.proofSnippet.pi_b[0][0]}</div>
                  </div>
                </div>
              </div>

              {/* Next Actions */}
              <div className="space-y-2 pt-2 border-t border-[#1F2937]">
                <button
                  onClick={() => onNavigateToVerifier(generatedProof)}
                  className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-white bg-[#0B0F19] hover:bg-[#1F2937] border border-[#06B6D4] transition-colors flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4 text-[#06B6D4]" />
                  Comprobar en Verificador Universal ZK
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onNavigateToTeleporter(generatedProof)}
                  className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-white bg-[#E84142] hover:bg-[#D93839] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  Teletransportar a otra Subnet (AWM)
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDownloadJson(generatedProof)}
                  className="w-full py-2 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar Recibo Criptográfico JSON
                </button>
              </div>
            </div>
          ) : !isGenerating && (
            <div className="p-8 rounded-xl bg-[#111827] border border-[#1F2937] text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#0B0F19] border border-[#1F2937] flex items-center justify-center mx-auto text-slate-500">
                <Sparkles className="w-6 h-6 text-[#06B6D4]" />
              </div>
              <h3 className="text-base font-bold text-white">
                Listo para Generar Prueba
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Configura tu declaración y las opciones de privacidad en la columna izquierda y presiona «Sintetizar y Generar Prueba ZK» para computar la atestación criptográfica.
              </p>
              <div className="pt-2 text-xs text-slate-500">
                Procesado 100% en el cliente vía WebAssembly / Web Crypto
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
