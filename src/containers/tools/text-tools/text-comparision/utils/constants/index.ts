const darkDiffStyles = {
  variables: {
    dark: {
      diffViewerBackground: 'var(--bg-container)',
      diffViewerColor: 'var(--text-primary)',
      addedBackground: 'rgba(34, 197, 94, 0.15)',
      addedColor: '#4ade80',
      removedBackground: 'rgba(239, 68, 68, 0.15)',
      removedColor: '#f87171',
      wordAddedBackground: 'rgba(34, 197, 94, 0.3)',
      wordRemovedBackground: 'rgba(239, 68, 68, 0.3)',
      addedGutterBackground: 'rgba(34, 197, 94, 0.1)',
      removedGutterBackground: 'rgba(239, 68, 68, 0.1)',
      gutterBackground: 'var(--bg-spotlight)',
      gutterBackgroundDark: 'var(--bg-surface)',
      highlightBackground: 'rgba(249, 115, 22, 0.1)',
      highlightGutterBackground: 'rgba(249, 115, 22, 0.15)',
      codeFoldGutterBackground: 'var(--bg-spotlight)',
      codeFoldBackground: 'var(--bg-container)',
      emptyLineBackground: 'var(--bg-surface)',
      gutterColor: 'var(--text-tertiary)',
      addedGutterColor: '#4ade80',
      removedGutterColor: '#f87171',
      codeFoldContentColor: 'var(--text-secondary)',
      diffViewerTitleBackground: 'var(--bg-elevated)',
      diffViewerTitleColor: 'var(--text-primary)',
      diffViewerTitleBorderColor: 'var(--border-default)'
    }
  },
  wordDiff: {
    display: 'inline'
  },
  contentText: {
    fontFamily: "'Cousine', monospace",
    fontSize: '14px'
  },
  gutter: {
    minWidth: '40px',
    padding: '0 10px'
  },
  line: {
    padding: '2px 10px'
  }
};

export { darkDiffStyles };
