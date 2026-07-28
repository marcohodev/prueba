import { Account } from '../models/Account';

const API_BASE = 'http://localhost:3000';
const ACCOUNTS_PATH = '/api';

export async function fetchAccounts(): Promise<Account[]> {
  const res = await fetch(API_BASE + ACCOUNTS_PATH);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to load accounts: ${res.status} ${res.statusText} ${text}`);
  }
  const data = await res.json();
  return (data && data.accounts) ? (data.accounts as Account[]) : []; 
}
