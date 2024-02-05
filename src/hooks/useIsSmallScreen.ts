import {useWindowSize} from './useWindowSize.ts';

export function useIsSmallScreen() {
  const windowSize: any = useWindowSize();
  return windowSize.width < 600;
}
