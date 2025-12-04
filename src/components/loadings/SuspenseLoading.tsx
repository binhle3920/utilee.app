import { Flex } from 'antd';

const SuspenseLoading = () => {
  return (
    <Flex justify='center' align='center' vertical gap={16} className='h-full w-full bg-[var(--bg-base)]'>
      {/* Animated logo */}
      <div className='relative'>
        <img src={'/logo/logo.webp'} alt='Utilee' className='w-16 h-16 rounded-xl animate-pulse' />
      </div>
    </Flex>
  );
};

export default SuspenseLoading;
