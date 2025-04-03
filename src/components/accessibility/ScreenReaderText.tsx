import React from 'react';

interface ScreenReaderTextProps {
  children: React.ReactNode;
  id?: string;
}

/**
 * Component for text that is only visible to screen readers
 * This is useful for providing additional context to screen reader users
 * without affecting the visual layout
 */
const ScreenReaderText: React.FC<ScreenReaderTextProps> = ({ children, id }) => {
  return (
    <span
      id={id}
      className="sr-only"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: '0'
      }}
    >
      {children}
    </span>
  );
};

export default ScreenReaderText;
