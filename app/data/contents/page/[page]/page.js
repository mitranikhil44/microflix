import PaginationButton from '@/components/other/PaginationButton';
import FetchSSRData from '@/components/other/FetchSSRData';
import dynamic from 'next/dynamic';

const DynamicContentList = dynamic(() => import('@/components/ContentList'), {
  ssr: true,
});

export default async function PageContent({ params }) {
  const { page } = params;
  const { contents } = await FetchSSRData(page, "contents");
  const totalPages = contents[0]?.totalPages;

  return (
    <>
      <DynamicContentList cateogry="contents" contents={contents} />
      <PaginationButton totalPages={totalPages} page={page} cateogry={"contents"} />
    </>
  );
}

