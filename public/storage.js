export const STORAGE_KEY = 'cfa-pocket-v1';

// Web keeps its existing origin/key. Native uses Android SharedPreferences.
// Serialize snapshots at call time and writes in order, including rapid actions.
export function createStudyStorage({ local, preferences, onError = () => {} }) {
  let pending = Promise.resolve();
  return {
    async load() {
      if (preferences) {
        const { value } = await preferences.get({ key: STORAGE_KEY });
        if (value !== null) return JSON.parse(value);
      }
      const raw = local.getItem(STORAGE_KEY);
      const value = raw === null ? null : JSON.parse(raw);
      if (preferences && raw !== null) {
        // Copy, never remove, a previous WebView record. Browsers are separate.
        await preferences.set({ key: STORAGE_KEY, value: raw });
      }
      return value;
    },
    save(state) {
      const value = JSON.stringify(state);
      // localStorage is the primary Web store; native is not dependent on it.
      if (!preferences) {
        try { local.setItem(STORAGE_KEY, value); return Promise.resolve(true); }
        catch (error) { onError(error); return Promise.resolve(false); }
      }
      pending = pending.then(async () => {
        try { await preferences.set({ key: STORAGE_KEY, value }); return true; }
        catch (error) { onError(error); return false; }
      });
      return pending;
    },
    flush() { return pending; }
  };
}
