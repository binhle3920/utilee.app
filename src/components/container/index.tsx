import { useBreakpoint } from '@ant-design/pro-components';
import { FlexProps } from 'antd';
import { PropsWithoutRef, useEffect, useState } from 'react';

const Container = (props: PropsWithoutRef<FlexProps>) => {
  const { children, style, className, ...rest } = props;

  const [padding, setPadding] = useState<number>(0);
  const [maxWidth, setMaxWidth] = useState<number>(0);

  const screen = useBreakpoint();

  useEffect(() => {
    if (screen === 'xs' || screen === 'sm' || screen === 'md') {
      setPadding(16);
    } else if (screen === 'lg') {
      setPadding(24);
    } else if (screen === 'xl') {
      setPadding(24);
      setMaxWidth(1440);
    } else if (screen === 'xxl') {
      setPadding(24);
      setMaxWidth(1600);
    }
  }, [screen]);

  return (
    <div className='w-full flex justify-center items-center'>
      <div
        className={`w-full ${className}`}
        style={{
          paddingLeft: padding,
          paddingRight: padding,
          maxWidth: maxWidth || '100%',
          ...style
        }}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
