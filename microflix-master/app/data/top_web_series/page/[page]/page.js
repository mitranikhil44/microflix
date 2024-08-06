import PaginationButton from '@/components/other/PaginationButton';
import FetchSSRData from '@/components/other/FetchSSRData';
import dynamic from 'next/dynamic';

const DynamicContentList = dynamic(() => import('@/components/ContentList'), {
  ssr: true,
});

const TopWebSeriesContentPages = async ({ params }) => {
  const { page } = params
  const { contents } = await FetchSSRData(page, "top_content_seasons");
  const totalPages = contents[0]?.totalPages;

  return (
    <>
      <DynamicContentList contents={contents} />
      <PaginationButton totalPages={totalPages} page={page} cateogry={"top_web_series"} />
    </>
  );
};

export default TopWebSeriesContentPages;
