/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  ExternalLink, 
  HelpCircle,
  FileCheck2,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { CredentialsVault } from './components/CredentialsVault';
import { ZKStudio } from './components/ZKStudio';
import { ZKVerifier } from './components/ZKVerifier';
import { TeleporterBridge } from './components/TeleporterBridge';
import { WalletModal } from './components/WalletModal';
import { MintCredentialModal } from './components/MintCredentialModal';
import { SoulboundCredential, WalletAccount, ZKProof } from './types';
import { INITIAL_CREDENTIALS } from './data/initialCredentials';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'vault' | 'zk-studio' | 'verifier' | 'teleporter'>('vault');
  const [credentials, setCredentials] = useState<SoulboundCredential[]>(INITIAL_CREDENTIALS);
  const [selectedCredentialForZK, setSelectedCredentialForZK] = useState<SoulboundCredential | null>(INITIAL_CREDENTIALS[0]);

  // Initial Seed Proof for instant verifier inspection
  const [proofs, setProofs] = useState<ZKProof[]>([
    {
      id: 'proof-seed-sample',
      statementId: 'stmt-vol-50k',
      credentialId: 'cred-defi-titan-01',
      credentialTitle: 'DeFi Liquidity Titan',
      statementText: 'Volumen Acumulado Mayor a $50,000 USD',
      predicateFormula: 'VolumenTotal ≥ 50,000 USD',
      commitmentHash: '0x9d82bcdaef109283471029384710293847102938471029384710293847102938',
      nullifierHash: '0x71a098234bcdaef1092834710293847102938471029384710293847102938471',
      merkleRoot: '0x3f98c812a0f81d45902bc348e89f1a2384759281a0e192837482910aefc98412',
      publicSignals: {
        thresholdPassed: true,
        verifierContract: '0x32A489F09182374619ef09cdaef778129bc48910',
        avalancheBlockSnapshot: 51049280,
        protocolTag: 'Trader Joe & Benqi Finance',
      },
      proofSnippet: {
        pi_a: [
          '0x2c4e82b31f8e4019a776c123ef89d201a4bc56ef98',
          '0x1f90bc2019ea98bcdae891234829104efc89281a0b',
        ],
        pi_b: [
          [
            '0x81902bc348e89f1a2384759281a0e192837482910a',
            '0x92837482910aefc123457a8109bf821049c9a01f81',
          ],
          [
            '0x4981bc2019ea98fa091c1290bcdae8912348291012',
            '0x7a8109bf821049c9a01f928374829104efc89281a0',
          ],
        ],
        pi_c: [
          '0x5b901a87c019284758129034871029487bcdaef109',
          '0x3f98c812a0f81d45902bc348e89f1a2384759281a0',
        ],
        protocol: 'groth16',
        curve: 'bn128',
      },
      generatedAt: '2026-10-13 20:15:00 UTC',
      verified: true,
      selectiveDisclosure: {
        hideWalletAddress: true,
        hideExactBalances: true,
        hideTimestampHistory: true,
      },
      proofJsonString: JSON.stringify(
        {
          statement: 'VolumenTotal ≥ 50,000 USD',
          protocol: 'Groth16 / BN128',
          commitment: '0x9d82bcdaef109283471029384710293847102938471029384710293847102938',
          nullifier: '0x71a098234bcdaef1092834710293847102938471029384710293847102938471',
          merkleRoot: '0x3f98c812a0f81d45902bc348e89f1a2384759281a0e192837482910aefc98412',
          publicSignals: {
            thresholdPassed: true,
            avalancheBlockSnapshot: 51049280,
          },
          proofSnippet: {
            pi_a: ['0x2c4e82b31f8e4019a776c123ef89d201a4bc56ef98', '0x1f90bc2019ea98bcdae891234829104efc89281a0b'],
            pi_b: [
              ['0x81902bc348e89f1a2384759281a0e192837482910a', '0x92837482910aefc123457a8109bf821049c9a01f81'],
              ['0x4981bc2019ea98fa091c1290bcdae8912348291012', '0x7a8109bf821049c9a01f928374829104efc89281a0']
            ],
            pi_c: ['0x5b901a87c019284758129034871029487bcdaef109', '0x3f98c812a0f81d45902bc348e89f1a2384759281a0'],
            protocol: 'groth16'
          }
        },
        null,
        2
      ),
    },
  ]);

  const [activeProofForVerifier, setActiveProofForVerifier] = useState<ZKProof | null>(proofs[0]);
  const [activeProofForTeleporter, setActiveProofForTeleporter] = useState<ZKProof | null>(proofs[0]);

  // Wallet State
  const [wallet, setWallet] = useState<WalletAccount>({
    address: '0x71C0192AaBC982103498bCe98721498710294109',
    did: 'did:avax:c-chain:0x71C0192AaBC982103498bCe98721498710294109',
    balanceAvax: 1420.5,
    networkName: 'Avalanche C-Chain',
    chainId: 43114,
    publicKeyZk: '0xzk8941029384710293847102938471029384710293',
    privateKeySalt: '0x9812aeb7162981ef09cdaef12984bc1234567890',
    isConnected: true,
    isCustodial: false,
  });

  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState<boolean>(false);

  // Handlers
  const handleSelectForZK = (cred: SoulboundCredential) => {
    setSelectedCredentialForZK(cred);
    setCurrentTab('zk-studio');
  };

  const handleProofGenerated = (newProof: ZKProof) => {
    setProofs(prev => [newProof, ...prev]);
    setActiveProofForVerifier(newProof);
    setActiveProofForTeleporter(newProof);
  };

  const handleNavigateToVerifier = (proof: ZKProof) => {
    setActiveProofForVerifier(proof);
    setCurrentTab('verifier');
  };

  const handleNavigateToTeleporter = (proof: ZKProof) => {
    setActiveProofForTeleporter(proof);
    setCurrentTab('teleporter');
  };

  const handleCredentialMinted = (newCred: SoulboundCredential) => {
    setCredentials(prev => [newCred, ...prev]);
    setSelectedCredentialForZK(newCred);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-[#F9FAFB]">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        wallet={wallet}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onOpenMintModal={() => setIsMintModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {currentTab === 'vault' && (
          <CredentialsVault
            credentials={credentials}
            onSelectForZK={handleSelectForZK}
            onOpenMintModal={() => setIsMintModalOpen(true)}
          />
        )}

        {currentTab === 'zk-studio' && (
          <ZKStudio
            credentials={credentials}
            selectedCredential={selectedCredentialForZK}
            onSelectCredential={setSelectedCredentialForZK}
            wallet={wallet}
            onProofGenerated={handleProofGenerated}
            onNavigateToVerifier={handleNavigateToVerifier}
            onNavigateToTeleporter={handleNavigateToTeleporter}
          />
        )}

        {currentTab === 'verifier' && (
          <ZKVerifier
            availableProofs={proofs}
            activeProofToVerify={activeProofForVerifier}
            onNavigateToTeleporter={handleNavigateToTeleporter}
          />
        )}

        {currentTab === 'teleporter' && (
          <TeleporterBridge
            availableProofs={proofs}
            activeProof={activeProofForTeleporter}
          />
        )}
      </main>

      {/* Modals */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        wallet={wallet}
        onUpdateWallet={setWallet}
      />

      <MintCredentialModal
        isOpen={isMintModalOpen}
        onClose={() => setIsMintModalOpen(false)}
        wallet={wallet}
        onCredentialMinted={handleCredentialMinted}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-[#1F2937] bg-[#0B0F19] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">AvaZK Identity</span>
            <span aria-hidden="true">·</span>
            <span>Identidad Soberana en Avalanche C-Chain</span>
            <span aria-hidden="true">·</span>
            <span>Groth16 / Teleporter AWM</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Privacidad Cero-Conocimiento</span>
            <span aria-hidden="true">/</span>
            <span>Contratos Verificados</span>
            <span aria-hidden="true">/</span>
            <span>Subnets Avalanche</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
