import React from 'react';

const useClickOutside = (active, onOutsideClick = f => f, onInsideClick = f => f) => {
  const node = React.useRef();

  React.useEffect(() => {
    function handleClick(event) {
      if (node.current && node.current.contains(event.target)) {
        onInsideClick();
      } else {
        onOutsideClick();
      }
    }

    if (active) {
      // the event autoremoves when fired once.
      // document.addEventListener("click", handleClick, { once: true });
      document.addEventListener('click', handleClick);
    }
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [active, onOutsideClick, onInsideClick]);

  return node;
}

export default useClickOutside;
