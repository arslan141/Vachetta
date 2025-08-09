// Mock KV implementation for local development
type KVStore = Map<string, any>;

class MockKV {
  private store: KVStore = new Map();

  async get<T>(key: string): Promise<T | null> {
    const value = this.store.get(key);
    return value || null;
  }

  async set(key: string, value: any): Promise<void> {
    this.store.set(key, value);
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async exists(key: string): Promise<number> {
    return this.store.has(key) ? 1 : 0;
  }
}

// Export mock KV for local development
export const mockKV = new MockKV();
