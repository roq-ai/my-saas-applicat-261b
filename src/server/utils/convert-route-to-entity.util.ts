const mapping: Record<string, string> = {
  'blacklisted-wallets': 'blacklisted_wallet',
  platforms: 'platform',
  'smart-contracts': 'smart_contract',
  transactions: 'transaction',
  users: 'user',
  wallets: 'wallet',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
