import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Cpu, 
  FileJson, 
  ArrowRight,
  Send,
  RefreshCw,
  Lock
} from 'lucide-react';
import { ZKProof } from '../types';
import { verifyZKProofMathematical, truncateHash } from '../utils/crypto';

interface ZKVerifierProps {
  availableProofs: ZKProof[];
  activeProofToVerify: ZKProof | null;
  onNavigateToTeleporter: (proof: ZKProof) => void;
}

export const ZKVerifier: React.FC<ZKVerifierProps> = ({
  availableProofs,
  activeProofToVerify,
  onNavigateToTeleporter,
}) => {
  const [selectedProofId, setSelectedProofId] = useState<string>(
    activeProofToVerify?.id || availableProofs[0]?.id || ''
  );
  const [jsonInput, setJsonInput] = useState<string>(
    activeProofToVerify ? activeProofToVerify.proofJsonString : availableProofs[0]?.proofJsonString || ''
  );
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    checks: {
      pairingCheck: boolean;
      merkleIntegrity: boolean;
      nullifierSanity: boolean;
      circuitConstraintSatisfied: boolean;
    };
    reason: string;
    verifiedAt: string;
  } | null>(null);

  const handleSelectProofChange = (proofId: string) => {
    setSelectedProofId(proofId);
    setVerificationResult(null);
    const proof = availableProofs.find(p => p.id === proofId);
    if (proof) {
      setJsonInput(proof.proofJsonString);
    }
  };

  const handleRunVerification = async () => {
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const parsedProof = JSON.parse(jsonInput) as ZKProof;
      await new Promise(r => setTimeout(r, 650));

      const result = await verifyZKProofMathematical({
        commitmentHash: parsedProof.commitmentHash,
        nullifierHash: parsedProof.nullifierHash,
        merkleRoot: parsedProof.merkleRoot,
        publicSignals: parsedProof.publicSignals,
        proofSnippet: parsedProof.proofSnippet,
      });

      setVerificationResult({
        ...result,
        verifiedAt: new Date().toLocaleTimeString(),
      });
    } catch {
      await new Promise(r => setTimeout(r, 400));
      setVerificationResult({
        verified: false,
        checks: {
          pairingCheck: false,
          merkleIntegrity: false,
          nullifierSanity: false,
          circuitConstraintSatisfied: false,
        },
        reason: 'Error de sintaxis: el contenido proporcionado no es un JSON de prueba ZK válido.',
        verifiedAt: new Date().toLocaleTimeString(),
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const currentProofObject = availableProofs.find(p => p.id === selectedProofId) || activeProofToVerify;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-b from-[#111827] to-[#0B0F19] border border-[#1F2937] p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#38BDF8] uppercase tracking-wider mb-2">
            <span>Avalanche Universal Verifier</span>
            <span aria-hidden="true">·</span>
            <span>Verificación Cero-Conocimiento</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Trust</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Verificador Universal de Pruebas ZK
          </h1>
          <p className="mt-3 text-base text-slate-300 leading-relaxed">
            Cualquier protocolo de préstamos DeFi, DAO o tercero independiente puede validar aquí la autenticidad matemática de un logro o solvencia sin tener acceso a los datos personales ni a las claves del usuario.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Proof Input & Inspector */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-xl bg-[#111827] border border-[#1F2937] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                1. Seleccionar o Pegar Certificado de Prueba ZK
              </span>
              <span className="text-xs text-slate-500">
                {availableProofs.length} Pruebas en Bóveda
              </span>
            </div>

            {availableProofs.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs text-slate-400">Cargar desde pruebas generadas en la sesión:</label>
                <select
                  value={selectedProofId}
                  onChange={e => handleSelectProofChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-[#1F2937] text-sm text-slate-200 focus:outline-none focus:border-[#38BDF8]"
                >
                  {availableProofs.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.statementText} ({p.credentialTitle})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Cuerpo de la Prueba (Estructura JSON Groth16):</span>
                <span className="font-mono text-slate-500">BN128 / R1CS</span>
              </div>
              <textarea
                rows={10}
                value={jsonInput}
                onChange={e => {
                  setJsonInput(e.target.value);
                  setVerificationResult(null);
                }}
                placeholder="Pega aquí el JSON del certificado de prueba ZK..."
                className="w-full p-3 rounded-lg bg-[#0B0F19] border border-[#1F2937] text-xs font-mono text-cyan-300 focus:outline-none focus:border-[#38BDF8] resize-y"
              />
            </div>

            <div className="pt-2">
              <button
                disabled={isVerifying || !jsonInput.trim()}
                onClick={handleRunVerification}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    Ejecutando Emparejamiento Bilineal ZK...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Ejecutar Verificación Matemática en Avalanche
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Verification Results */}
        <div className="lg:col-span-5 space-y-6">
          {verificationResult ? (
            <div
              className={`p-6 rounded-xl border space-y-5 animate-fade-in shadow-xl ${
                verificationResult.verified
                  ? 'bg-[#111827] border-emerald-500/50'
                  : 'bg-[#111827] border-rose-500/50'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
                <div className="flex items-center gap-2">
                  {verificationResult.verified ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                  <span className="text-base font-bold text-white">
                    {verificationResult.verified ? 'Prueba Válida y Auténtica' : 'Prueba Rechazada'}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400 tabular-nums">
                  {verificationResult.verifiedAt}
                </span>
              </div>

              {/* Status explanation */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {verificationResult.reason}
              </p>

              {/* Step by step cryptographic checks */}
              <div className="space-y-2.5 pt-2 border-t border-[#1F2937]">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Desglose de Comprobaciones Criptográficas:
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-[#0B0F19] text-xs">
                  <span className="text-slate-300">Emparejamiento Bilineal (Bilinear Pairing BN128):</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {verificationResult.checks.pairingCheck ? 'VÁLIDO' : 'FALLIDO'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-[#0B0F19] text-xs">
                  <span className="text-slate-300">Integridad de Raíz Merkle en Avalanche:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {verificationResult.checks.merkleIntegrity ? 'CONFIRMADO' : 'FALLIDO'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-[#0B0F19] text-xs">
                  <span className="text-slate-300">Anti-Doble Gasto (Nullifier Sanity):</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {verificationResult.checks.nullifierSanity ? 'ÚNICO' : 'DUPLICADO'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-[#0B0F19] text-xs">
                  <span className="text-slate-300">Satisfacción del Predicado (R1CS):</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {verificationResult.checks.circuitConstraintSatisfied ? 'CUMPLIDO' : 'INCUMPLIDO'}
                  </span>
                </div>
              </div>

              {/* Zero-knowledge assertion guarantee */}
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-xs text-emerald-300 flex items-start gap-2">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  Confirmado: El usuario ha satisfecho las condiciones sin que la dirección de su billetera ni sus fondos reales hayan sido revelados en ningún paso de la verificación.
                </p>
              </div>

              {/* Action: Teleport */}
              {verificationResult.verified && currentProofObject && (
                <div className="pt-2">
                  <button
                    onClick={() => onNavigateToTeleporter(currentProofObject)}
                    className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-white bg-[#E84142] hover:bg-[#D93839] transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Atestación Cross-Chain con Teleporter
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-[#111827] border border-[#1F2937] text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#0B0F19] border border-[#1F2937] flex items-center justify-center mx-auto text-slate-500">
                <ShieldCheck className="w-6 h-6 text-[#38BDF8]" />
              </div>
              <h3 className="text-base font-bold text-white">
                Verificador Listo
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Selecciona una prueba generada o pega un recibo JSON de cualquier usuario de Avalanche para verificar su autenticidad sin intermediarios.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
