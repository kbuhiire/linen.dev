import Button from 'components/Button';
import { useS3Upload } from 'next-s3-upload';
import { useRef, useState } from 'react';
import { SerializedAccount } from 'serializers/account';
import { captureException } from '@sentry/nextjs';
import { toast } from 'components/Toast';
import { qs } from 'utilities/url';

const fail = () => toast.error('Something went wrong');

export default function ImportFromSlack({
  account,
}: {
  account?: SerializedAccount;
}) {
  const [loading, setLoading] = useState(false);
  let ref = useRef<HTMLInputElement>(null);

  let { uploadToS3, files } = useS3Upload();
  const communityType = account && account.communityType;

  const openFileDialog = () => {
    if (ref.current) {
      ref.current.value = '';
      ref.current?.click();
    }
  };

  const handleFileChange = async (event: any) => {
    setLoading(true);
    try {
      const file = event.target.files[0];
      const uploadResult = await uploadToS3(file, {
        endpoint: {
          request: {
            body: {
              asset: 'slack-import',
            },
            headers: {},
          },
        },
      });
      if (!uploadResult.url) {
        throw uploadResult;
      }
      const startSync = await fetch(
        '/api/sync?' +
          qs({
            account_id: account?.id,
            file_location: uploadResult.url,
          })
      );
      if (!startSync.ok) {
        throw startSync;
      }
      toast.success('Import process initiated');
    } catch (error) {
      captureException(error);
      fail();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {communityType !== 'discord' && (
        <div className="bg-white">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex">
              <div className="grow">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Import conversations from Slack
                </h3>
                <div className="mt-2 sm:flex sm:items-start sm:justify-between">
                  <div className="max-w-xl text-sm text-gray-500">
                    <p>
                      You can import all your public channel conversations
                      beyond 90 days from Slack (even on free tier). See
                      instructions on how to export it{' '}
                      <a
                        rel="noreferrer"
                        href="https://slack.com/help/articles/201658943-Export-your-workspace-data"
                        target="_blank"
                        className="underline"
                      >
                        here
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col self-center gap-2">
                <input
                  onChange={handleFileChange}
                  ref={ref}
                  type="file"
                  className="hidden"
                  accept=".zip"
                />
                <Button onClick={openFileDialog} disabled={loading}>
                  {!loading ? 'Upload file' : 'Uploading...'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
