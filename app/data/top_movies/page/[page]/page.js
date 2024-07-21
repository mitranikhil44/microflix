import PaginationButton from '@/components/other/PaginationButton';
import FetchSSRData from '@/components/other/FetchSSRData';
import dynamic from 'next/dynamic';

const DynamicContentList = dynamic(() => import('@/components/ContentList'), {
  ssr: true,
});

const TopMoviesContentPages = async ({ params }) => {
  const { page } = params
  const { contents } = await FetchSSRData(page, "top_content_movies");
  const totalPages = contents[0]?.totalPages;

  return (
    <>
      <DynamicContentList contents={contents} />
      <PaginationButton totalPages={totalPages} page={page} cateogry={"top_movies"} />
    </>
  );
};

export default TopMoviesContentPages;
