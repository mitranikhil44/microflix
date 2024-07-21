import PaginationButton from '@/components/other/PaginationButton';
import FetchSSRData from '@/components/other/FetchSSRData';
import dynamic from 'next/dynamic';

const DynamicContentList = dynamic(() => import('@/components/ContentList'), {
  ssr: true,
});

const TopContets = async () => {
  const page = 1;
  const { contents } = await FetchSSRData(page, "top_contents");
  const totalPages = contents[0]?.totalPages;

  return (
    <>
      <DynamicContentList contents={contents} />
      <PaginationButton totalPages={totalPages} page={page} cateogry={"top_contents"} />
    </>
  );
};

export default TopContets;
