import { useCartStore } from '../store/cartStore';
import { useUiStore } from '../store/uiStore';
import { findItem } from '../constants/menu';

// Single entry point for adding a dish — updates the cart and fires a toast.
// Used by every screen + the AI chat flow so the behaviour stays consistent.
export function addDish(item_id, { addedBy = 'user', qty = 1, modifiers = {} } = {}) {
  const item = findItem(item_id);
  if (!item) return;
  useCartStore.getState().add(item_id, qty, modifiers, { addedBy });
  const q = qty > 1 ? ` ×${qty}` : '';
  useUiStore.getState().pushToast(`Added · ${item.name}${q}${addedBy === 'lea' ? ' · by Léa' : ''}`);
}
