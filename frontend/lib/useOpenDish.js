import { useRouter } from 'expo-router';

// Opens a dish detail screen. The reveal animation now lives inside the dish
// vessel on the detail screen itself — see components/DishVessel.js.
export function useOpenDish() {
  const router = useRouter();
  return (dish) => router.push(`/item/${dish.id}`);
}
