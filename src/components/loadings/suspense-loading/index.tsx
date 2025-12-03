import { Flex, Spin } from 'antd';

const SuspenseLoading = () => {
  return (
    <Flex justify='center' align='center' vertical gap={16} className='min-h-screen bg-[var(--bg-base)]'>
      {/* Animated logo */}
      <div className='relative'>
        <div className='w-16 h-16 rounded-2xl bg-gradient-orange animate-pulse' />
        <div className='absolute inset-0 rounded-2xl bg-gradient-orange opacity-30 blur-xl animate-pulse' />
      </div>

      <Spin size='large' />

      <span className='text-[var(--text-tertiary)] text-sm font-medium'>Loading...</span>
    </Flex>
  );
};

export default SuspenseLoading;
