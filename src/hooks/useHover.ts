import { useCallback, useRef, useState } from 'react';

export default function useHover() {
  const [value, setValue] = useState<any>(false);

  const handleMouseOver = useCallback(() => setValue(true), []);
  const handleMouseOut = useCallback(() => setValue(false), []);

  const ref: any = useRef();

  const callbackRef = useCallback(
    (node: any) => {
      if (ref.current) {
        ref.current.removeEventListener('mouseenter', handleMouseOver);
        ref.current.removeEventListener('mouseleave', handleMouseOut);
      }

      ref.current = node;

      if (ref.current) {
        ref.current.addEventListener('mouseenter', handleMouseOver);
        ref.current.addEventListener('mouseleave', handleMouseOut);
      }
    },
    [handleMouseOver, handleMouseOut],
  );

  return [callbackRef, value];
}
