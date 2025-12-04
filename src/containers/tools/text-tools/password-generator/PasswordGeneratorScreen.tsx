import { CopyOutlined, ReloadOutlined } from '@ant-design/icons';
import { App, Button, Checkbox, Flex, InputNumber, Slider, Typography } from 'antd';
import { useEffect, useState } from 'react';

import StyledTextArea from '@/components/common/StyledTextArea';
import ToolLayout from '@/components/layouts/ToolLayout';
import SEO from '@/components/SEO';
import { APP_BASE_URL } from '@/utils/constants/app';
import Route from '@/utils/constants/route';

import { CHAR_SETS } from './utils/constants';
import { PasswordOptions } from './utils/types';

const PasswordGeneratorScreen = () => {
  const [password, setPassword] = useState<string>('');
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });

  const { message } = App.useApp();

  useEffect(() => {
    handleGeneratePassword();
  }, [options]);

  const handleGeneratePassword = () => {
    let charset = '';

    if (options.uppercase) charset += CHAR_SETS.uppercase;
    if (options.lowercase) charset += CHAR_SETS.lowercase;
    if (options.numbers) charset += CHAR_SETS.numbers;
    if (options.symbols) charset += CHAR_SETS.symbols;

    if (charset === '') {
      setPassword('');
      return;
    }

    const array = new Uint32Array(options.length);
    crypto.getRandomValues(array);

    let result = '';
    for (let i = 0; i < options.length; i++) {
      result += charset[array[i] % charset.length];
    }

    setPassword(result);
  };

  const handleCopyPassword = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    if (!password) {
      message.warning('No password to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      message.success('Password copied to clipboard');
    } catch (error) {
      console.error('Copy failed:', error);
      message.error('Failed to copy to clipboard');
    }
  };

  const handleUpdateOption = <K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const getPasswordStrength = (): { label: string; color: string } => {
    if (!password) return { label: 'None', color: 'var(--text-secondary)' };

    let score = 0;
    if (options.length >= 12) score++;
    if (options.length >= 16) score++;
    if (options.uppercase) score++;
    if (options.lowercase) score++;
    if (options.numbers) score++;
    if (options.symbols) score++;

    if (score <= 2) return { label: 'Weak', color: '#ef4444' };
    if (score <= 4) return { label: 'Medium', color: '#f59e0b' };
    if (score <= 5) return { label: 'Strong', color: '#22c55e' };
    return { label: 'Very Strong', color: '#10b981' };
  };

  const strength = getPasswordStrength();

  return (
    <>
      <SEO
        title='Free Password Generator - Utilee'
        description='Generate strong, secure passwords instantly. Customize length and character types including uppercase, lowercase, numbers, and symbols. Free online password generator tool.'
        keywords='password generator, secure password, strong password, random password, password creator, online password generator, free password tool'
        url={`${APP_BASE_URL}${Route.TOOLS.PASSWORD_GENERATOR}`}
      />

      <ToolLayout
        title='Password Generator'
        description='Generate strong, secure passwords with customizable length and character options. Create unique passwords for all your accounts instantly!'
        actions={[
          <Button type='default' icon={<ReloadOutlined />} onClick={handleGeneratePassword}>
            Generate
          </Button>,
          <Button type='default' shape='circle' icon={<CopyOutlined />} onClick={handleCopyPassword} />
        ]}
      >
        <Flex vertical gap={24} className='flex-1'>
          <StyledTextArea
            value={password}
            readOnly
            className='text-2xl! font-mono! text-center! h-24! leading-relaxed!'
            style={{ letterSpacing: '2px' }}
          />

          <Flex
            vertical
            gap={16}
            className='bg-[var(--bg-elevated)] p-6! rounded-xl border border-[var(--border-default)]'
          >
            <Flex justify='space-between' align='center'>
              <Typography.Text className='text-[var(--text-secondary)]!'>Password Length</Typography.Text>
              <InputNumber
                min={4}
                max={128}
                value={options.length}
                onChange={(value) => handleUpdateOption('length', value ?? 16)}
                className='w-20!'
              />
            </Flex>

            <Slider
              min={4}
              max={128}
              value={options.length}
              onChange={(value) => handleUpdateOption('length', value)}
              tooltip={{ formatter: (value) => `${value} characters` }}
            />

            <Flex vertical gap={12} className='mt-2'>
              <Typography.Text className='text-[var(--text-secondary)]! font-medium!'>Character Types</Typography.Text>

              <Flex wrap='wrap' gap={16}>
                <Checkbox
                  checked={options.uppercase}
                  onChange={(e) => handleUpdateOption('uppercase', e.target.checked)}
                >
                  Uppercase (A-Z)
                </Checkbox>
                <Checkbox
                  checked={options.lowercase}
                  onChange={(e) => handleUpdateOption('lowercase', e.target.checked)}
                >
                  Lowercase (a-z)
                </Checkbox>
                <Checkbox checked={options.numbers} onChange={(e) => handleUpdateOption('numbers', e.target.checked)}>
                  Numbers (0-9)
                </Checkbox>
                <Checkbox checked={options.symbols} onChange={(e) => handleUpdateOption('symbols', e.target.checked)}>
                  Symbols (!@#$...)
                </Checkbox>
              </Flex>
            </Flex>

            <Flex justify='space-between' align='center' className='mt-4 pt-4 border-t border-[var(--border-default)]'>
              <Typography.Text className='text-[var(--text-secondary)]! pt-2'>Password Strength</Typography.Text>
              <Typography.Text strong style={{ color: strength.color }} className='pt-2'>
                {strength.label}
              </Typography.Text>
            </Flex>
          </Flex>
        </Flex>
      </ToolLayout>
    </>
  );
};

export default PasswordGeneratorScreen;
