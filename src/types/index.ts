export interface WalletAccount {
  address: string;
  did: string;
  balanceAvax: number;
  networkName: string;
  chainId: number;
  publicKeyZk: string;
  privateKeySalt: string;
  isConnected: boolean;
  isCustodial: boolean;
}

export type CredentialCategory = 'defi' | 'dao' | 'subnet' | 'security' | 'developer';

export interface SoulboundCredential {
  id: string;
  tokenId: number;
  name: string;
  category: CredentialCategory;
  description: string;
  iconName: string;
  issuedAt: string;
  blockNumber: number;
  txHash: string;
  issuerName: string;
  issuerDid: string;
  merkleRoot: string;
  issuerSignature: string;
  publicAttributes: {
    categoria: string;
    antiguedadMinima: string;
    protocolo: string;
    estadoOnChain: string;
  };
  privateAttributes: {
    balanceExacto: string;
    volumenHistoricoUsd: string;
    direccionesAsociadas: string[];
    propuestasVotadasExactas: number;
    uptimeValidador: string;
    saltSecreto: string;
  };
  zkStatements: ZKProofStatement[];
}

export interface ZKProofStatement {
  id: string;
  title: string;
  description: string;
  claimType: 'greater_than' | 'range' | 'membership' | 'boolean';
  targetField: string;
  thresholdDisplay: string;
  predicateStatement: string;
}

export interface ZKProof {
  id: string;
  statementId: string;
  credentialId: string;
  credentialTitle: string;
  statementText: string;
  predicateFormula: string;
  commitmentHash: string;
  nullifierHash: string;
  merkleRoot: string;
  publicSignals: {
    thresholdPassed: boolean;
    verifierContract: string;
    avalancheBlockSnapshot: number;
    protocolTag: string;
  };
  proofSnippet: {
    pi_a: [string, string];
    pi_b: [[string, string], [string, string]];
    pi_c: [string, string];
    protocol: string;
    curve: string;
  };
  generatedAt: string;
  verified: boolean;
  selectiveDisclosure: {
    hideWalletAddress: boolean;
    hideExactBalances: boolean;
    hideTimestampHistory: boolean;
  };
  proofJsonString: string;
}

export interface TeleporterMessage {
  id: string;
  proofId: string;
  proofTitle: string;
  sourceChain: {
    name: string;
    chainId: number;
    contractAddress: string;
  };
  targetChain: {
    name: string;
    chainId: number;
    receiverContract: string;
  };
  status: 'submitted' | 'signing_bls' | 'relaying' | 'delivered';
  nonce: number;
  validatorSignaturesCount: number;
  requiredSignatures: number;
  txHashSource: string;
  txHashTarget?: string;
  timestamp: string;
  gasFeeAvax: number;
  payloadHash: string;
}
