import type { TextAreaProps } from 'antd/es/input';

import { Input } from 'antd';
import { forwardRef } from 'react';

type StyledTextAreaVariant = 'default' | 'monospace' | 'readonly';

interface StyledTextAreaProps extends Omit<TextAreaProps, 'variant'> {
  variant?: StyledTextAreaVariant;
}

const baseClassName =
  'bg-[var(--bg-spotlight)]! border-[var(--border-default)]! text-[var(--text-primary)]! resize-none! p-4!';

const variantClassNames: Record<StyledTextAreaVariant, string> = {
  default: '',
  monospace: 'font-mono!',
  readonly: 'bg-[var(--bg-surface)]! cursor-text!'
};

const StyledTextArea = forwardRef<HTMLTextAreaElement, StyledTextAreaProps>(
  ({ className, variant = 'default', style, ...props }, ref) => {
    const combinedClassName = [baseClassName, variantClassNames[variant], className].filter(Boolean).join(' ');

    return (
      <Input.TextArea
        ref={ref}
        className={combinedClassName}
        style={{
          fontSize: 16,
          minHeight: 16 * 10 * 1.5,
          ...style
        }}
        {...props}
      />
    );
  }
);

StyledTextArea.displayName = 'StyledTextArea';

export default StyledTextArea;
export type { StyledTextAreaProps, StyledTextAreaVariant };
