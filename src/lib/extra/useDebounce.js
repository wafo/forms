import React from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    // Cancel timeout if value changes (also on delay change)
    // This is how we prevent debounced value from updating if value is changed
    // within the delay period. timeout gets cleared and restarted.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
