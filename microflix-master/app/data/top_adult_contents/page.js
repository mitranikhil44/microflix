import PaginationButton from '@/components/other/PaginationButton';
import FetchSSRData from '@/components/other/FetchSSRData';
import dynamic from 'next/dynamic';

const DynamicContentList = dynamic(() => import('@/components/ContentList'), {
  ssr: true,
});

const TopAdultContets = async () => {
  const page = 1;
  const { contents } = await FetchSSRData(page, "top_content_adult");
  const totalPages = contents[0]?.totalPages;

  return (
    <>
      <DynamicContentList contents={contents} />
      <PaginationButton totalPages={totalPages} page={page} cateogry={"top_adult_contents"} />
    </>
  );
};

export default TopAdultContets;
