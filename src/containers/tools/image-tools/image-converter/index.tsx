import { DeleteOutlined, DownloadOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Flex,
  Image,
  Progress,
  Row,
  Select,
  Slider,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
  message,
  Modal,
  Tag
} from 'antd';
import { RcFile } from 'antd/es/upload';
import { useState } from 'react';
import { useMount } from 'react-use';

import ToolLayout from '@/components/layouts/tool-layout';
import SEO from '@/components/SEO';
import {
  formatOptions,
  qualityMarks,
  defaultQuality,
  defaultFormat
} from '@/containers/tools/image-tools/image-converter/utils/constants';
import { downloadAllImages, downloadImage } from '@/containers/tools/image-tools/image-converter/utils/download-utils';
import { formatFileSize, getCompressionRatio } from '@/containers/tools/image-tools/image-converter/utils/format-utils';
import {
  ConvertedImage,
  convertMultipleImages
} from '@/containers/tools/image-tools/image-converter/utils/image-conveter';
import { APP_BASE_URL } from '@/utils/constants/app';
import Route from '@/utils/constants/route';
import '@/containers/tools/image-tools/image-converter/index.css';

const { Text } = Typography;

const ImageConverterScreen = () => {
  const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [outputFormat, setOutputFormat] = useState<string>(defaultFormat);
  const [quality, setQuality] = useState<number>(defaultQuality);
  const [converting, setConverting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');

  useMount(() => {
    return () => {
      convertedImages.forEach((img) => {
        URL.revokeObjectURL(img.convertedUrl);
      });
    };
  });

  const handleChange: UploadProps['onChange'] = (info) => {
    // Check the file format
    const validFiles = info.fileList.filter((file) => {
      const isImage = file.type?.startsWith('image/');
      if (!isImage) {
        message.error(`${file.name} is not an image`);
      }

      return isImage;
    });

    // Update the file list
    setUploadFileList(validFiles);
  };

  const handleConvert = async () => {
    if (uploadFileList.length === 0) {
      message.warning('Please upload at least one image');
      return;
    }

    setConverting(true);
    setProgress(0);

    try {
      const files = uploadFileList.map((file) => file.originFileObj as RcFile).filter(Boolean);
      const newConvertedImages = await convertMultipleImages(files, outputFormat, quality, setProgress);

      setConvertedImages(newConvertedImages);
      message.success(`Successfully converted ${newConvertedImages.length} image(s)`);
    } catch (error) {
      message.error('Failed to convert images');
      console.error('Conversion error:', error);
    } finally {
      setConverting(false);
    }
  };

  const handleDownload = (convertedImage: ConvertedImage) => {
    downloadImage(convertedImage);
  };

  const handleDownloadAll = () => {
    if (convertedImages.length === 0) {
      message.warning('No converted images to download');
      return;
    }

    downloadAllImages(convertedImages);
    message.success('All converted images have been downloaded');
  };

  const handleRemoveOriginal = (file: UploadFile) => {
    const newFileList = uploadFileList.filter((item) => item.uid !== file.uid);
    setUploadFileList(newFileList);
  };

  const handleRemoveConverted = (id: string) => {
    setConvertedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handlePreview = (url: string) => {
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  const onClearAll = () => {
    setUploadFileList([]);
    setConvertedImages([]);
    setProgress(0);

    message.success('All images and converted images have been cleared');
  };

  const actionButtons = [
    <Flex justify='center' align='center' gap={8}>
      <Button onClick={onClearAll}>Clear All</Button>
      <Button type='primary' icon={<DownloadOutlined />} onClick={handleDownloadAll}>
        Download All
      </Button>
    </Flex>
  ];

  return (
    <>
      <SEO
        title='Free Online Image Converter - Utilee'
        description='Convert images to WebP, JPEG, PNG, AVIF formats instantly. Batch convert multiple images with custom quality settings. Free, fast, and secure image conversion tool.'
        keywords='image converter, image format converter, webp converter, jpeg converter, png converter, avif converter, batch image converter, image compression, free image tools'
        url={`${APP_BASE_URL}/${Route.TOOLS.IMAGE_CONVERTER}`}
      />

      <ToolLayout
        title='Image Converter'
        description='Convert your images to different formats with customizable quality settings. Supports WebP, JPEG, PNG, and AVIF formats.'
        actions={actionButtons}
      >
        {/* Upload Section */}
        <Card title='Upload Images' className='mt-6! mb-4!'>
          <Upload
            listType='picture-card'
            fileList={uploadFileList}
            multiple
            accept='image/*'
            showUploadList={{
              showPreviewIcon: true,
              showRemoveIcon: true
            }}
            onChange={handleChange}
            beforeUpload={() => false}
            onRemove={handleRemoveOriginal}
            onPreview={(file) => {
              const url = URL.createObjectURL(file.originFileObj as RcFile);
              handlePreview(url);
            }}
          >
            <Flex justify='center' align='center' gap={8} vertical>
              <UploadOutlined className='text-2xl' color='secondary' />
              <Text className='text-xs!' type='secondary'>
                Upload your Images
              </Text>
            </Flex>
          </Upload>
        </Card>

        {/* Conversion Settings */}
        {uploadFileList.length > 0 && (
          <Card title='Conversion Settings' className='my-4!'>
            <Row gutter={[24, 16]}>
              <Col span={24} md={12}>
                <div className='mb-2'>
                  <Text strong>Output Format</Text>
                </div>
                <Select value={outputFormat} onChange={setOutputFormat} style={{ width: '100%' }} size='large'>
                  {formatOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      <Flex justify='space-between' align='center' gap={8}>
                        <div>{option.label}</div>
                        <div className='text-xs text-gray-500'>{option.description}</div>
                      </Flex>
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={24} md={12}>
                <div className='mb-2'>
                  <Text strong>Quality: {quality}%</Text>
                  {outputFormat === 'png' && (
                    <Text type='secondary' className='ml-2'>
                      (PNG is lossless)
                    </Text>
                  )}
                </div>
                <Slider
                  min={10}
                  max={100}
                  value={quality}
                  onChange={setQuality}
                  disabled={outputFormat === 'png'}
                  marks={qualityMarks}
                />
              </Col>
            </Row>

            <div className='mt-4'>
              <Button
                type='primary'
                size='large'
                onClick={handleConvert}
                loading={converting}
                disabled={uploadFileList.length === 0}
                block
              >
                Convert {uploadFileList.length} Image{uploadFileList.length > 1 ? 's' : ''}
              </Button>
            </div>

            {converting && (
              <div className='mt-4'>
                <Progress percent={Math.round(progress)} status='active' />
              </div>
            )}
          </Card>
        )}

        {/* Converted Images */}
        {convertedImages.length > 0 && (
          <Card title={`Converted Images (${convertedImages.length})`}>
            <Row gutter={[16, 16]}>
              {convertedImages.map((img) => (
                <Col key={img.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    size='small'
                    className='converted-image-card'
                    cover={
                      <div className='image-preview relative'>
                        <img
                          alt='converted'
                          src={img.convertedUrl}
                          className='w-full h-32 object-cover cursor-pointer'
                          onClick={() => handlePreview(img.convertedUrl)}
                        />
                        <div className='absolute top-2 right-2'>
                          <Tag color='blue'>{img.format.toUpperCase()}</Tag>
                        </div>
                      </div>
                    }
                    actions={[
                      <EyeOutlined key='preview' onClick={() => handlePreview(img.convertedUrl)} />,
                      <DownloadOutlined key='download' onClick={() => handleDownload(img)} />,
                      <DeleteOutlined key='delete' onClick={() => handleRemoveConverted(img.id)} />
                    ]}
                  >
                    <div className='text-xs'>
                      <div className='truncate font-medium mb-1'>{img.originalFile.name}</div>
                      <Flex justify='space-between' className='text-gray-600'>
                        <span>{formatFileSize(img.originalSize)}</span>
                        <span>→</span>
                        <span>{formatFileSize(img.convertedSize)}</span>
                      </Flex>
                      <div className='text-center mt-1'>
                        <Tag color={img.convertedSize < img.originalSize ? 'green' : 'orange'}>
                          {getCompressionRatio(img.originalSize, img.convertedSize)}
                        </Tag>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        )}

        {/* Preview Modal */}
        <Modal
          open={previewVisible}
          title='Image Preview'
          footer={null}
          onCancel={() => setPreviewVisible(false)}
          width={800}
          centered
        >
          <Flex justify='center' align='center' className='h-full'>
            <Image src={previewImage} alt='preview' style={{ maxWidth: '100%', maxHeight: '70vh' }} preview={false} />
          </Flex>
        </Modal>
      </ToolLayout>
    </>
  );
};

export default ImageConverterScreen;
