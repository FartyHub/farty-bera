import { RefObject, useEffect } from 'react';

export function useOutsideAlerter(
  ref: RefObject<HTMLElement>,
  onOutsideClick?: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref?.current &&
        !ref.current.contains(event?.target as Node) &&
        onOutsideClick
      ) {
        onOutsideClick();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
