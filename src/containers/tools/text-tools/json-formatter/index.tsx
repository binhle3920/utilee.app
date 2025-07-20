import { UnorderedListOutlined } from '@ant-design/icons';
import { Button, Dropdown, Flex, Typography } from 'antd';

import ToolLayout from '@/components/layouts/tool-layout';
import SEO from '@/components/SEO';
import { APP_BASE_URL } from '@/utils/constants/app';
import Route from '@/utils/constants/route';

const JsonFormatterScreen = () => {
  return (
    <>
      <SEO
        title='Free JSON Formatter - Utilee'
        description='Format JSON data for better readability and structure.'
        keywords='json formatter, json, format, json formatter, json format, json formatter, json format'
        url={`${APP_BASE_URL}/${Route.TOOLS.JSON_FORMATTER}`}
      />

      <ToolLayout
        title='JSON Formatter'
        description='Format JSON data for better readability and structure.'
        actions={[
          <Flex className='justify-end items-center' gap={8}>
            <Dropdown
              menu={{
                items: [
                  { key: 'json', label: 'JSON' },
                  { key: 'yaml', label: 'YAML' },
                  { key: 'xml', label: 'XML' },
                  { key: 'csv', label: 'CSV' },
                  { key: 'sql', label: 'SQL' }
                ]
              }}
              placement='bottomRight'
            >
              <Button icon={<UnorderedListOutlined />}>
                <Typography.Text>JSON</Typography.Text>
              </Button>
            </Dropdown>
          </Flex>
        ]}
      ></ToolLayout>
    </>
  );
};

export default JsonFormatterScreen;
