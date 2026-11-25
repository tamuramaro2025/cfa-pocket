export const STORAGE_KEY = 'cfa-pocket-v1';
export const SYNC_CONFIG_KEY = 'cfa-pocket-sync-v1';

// Web keeps its existing origin/key. Native uses Android SharedPreferences.
// Serialize snapshots at call time and writes in order, including rapid actions.
export function createStudyStorage({ local, preferences, key = STORAGE_KEY, onError = () => {} }) {
  let pending = Promise.resolve();
  return {
    async load() {
      if (preferences) {
        const { value } = await preferences.get({ key });
        if (value !== null) return JSON.parse(value);
      }
      const raw = local.getItem(key);
      const value = raw === null ? null : JSON.parse(raw);
      if (preferences && raw !== null) {
        // Copy, never remove, a previous WebView record. Browsers are separate.
        await preferences.set({ key, value: raw });
      }
      return value;
    },
    save(state) {
      const value = JSON.stringify(state);
      // localStorage is the primary Web store; native is not dependent on it.
      if (!preferences) {
        try { local.setItem(key, value); return Promise.resolve(true); }
        catch (error) { onError(error); return Promise.resolve(false); }
      }
      pending = pending.then(async () => {
        try { await preferences.set({ key, value }); return true; }
        catch (error) { onError(error); return false; }
      });
      return pending;
    },
    flush() { return pending; }
  };
}
