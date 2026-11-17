export enum NetworkHealthTier {
  Excellent = 'Excellent',
  Fair = 'Fair',
  Poor = 'Poor',
  Degraded = 'Degraded',
}

export type NetworkDiagnosticResult = {
  idlePingMs: number;
  downloadSpeedMbps: number;
  uploadSpeedMbps: number;
  downloadPingMs: number;
  uploadPingMs: number;
  packetLossPercent: number;
  timestamp: number;
};

export const excellentMinMbps = 10.0;
export const fairMinMbps = 2.0;
export const highLatencyMs = 250.0;
export const degradedLatencyMs = 1000.0;
export const degradedPacketLossPercent = 20.0;

export function classifyNetworkHealth(result: NetworkDiagnosticResult): NetworkHealthTier {
  const highestTransferPing = Math.max(result.downloadPingMs, result.uploadPingMs);
  const maxPingMs = Number.isFinite(highestTransferPing) ? highestTransferPing : result.idlePingMs;
  const loss = result.packetLossPercent;

  if (loss >= degradedPacketLossPercent || maxPingMs >= degradedLatencyMs) {
    return NetworkHealthTier.Degraded;
  }
  if (result.downloadSpeedMbps > excellentMinMbps && maxPingMs <= highLatencyMs) {
    return NetworkHealthTier.Excellent;
  }
  if (result.downloadSpeedMbps >= fairMinMbps) {
    return NetworkHealthTier.Fair;
  }
  return NetworkHealthTier.Poor;
}
