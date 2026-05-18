import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const noop = () => {};
const safe = (fn) => (Platform.OS === 'web' ? noop : fn);

export const tap = safe(() => Haptics.selectionAsync());
export const lightTap = safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
export const mediumTap = safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
export const success = safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
