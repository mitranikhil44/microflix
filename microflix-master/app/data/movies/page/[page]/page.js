import PaginationButton from '@/components/other/PaginationButton';
import FetchSSRData from '@/components/other/FetchSSRData';
import dynamic from 'next/dynamic';

const DynamicContentList = dynamic(() => import('@/components/ContentList'), {
  ssr: true,
});

const MoviesContentPages = async ({ params }) => {
  const { page } = params
  const { contents } = await FetchSSRData(page, "content_movies");
  const totalPages = contents[0]?.totalPages;

  return (
    <>
      <DynamicContentList contents={contents} />
      <PaginationButton totalPages={totalPages} page={page} cateogry={"movies"} />
    </>
  );
};

export default MoviesContentPages;
