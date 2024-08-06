import PaginationButton from '@/components/other/PaginationButton';
import FetchSSRData from '@/components/other/FetchSSRData';
import ContentList from '@/components/ContentList';

const WebSeriesContentPages = async ({ params }) => {
  const { page } = params
  const { contents } = await FetchSSRData(page, "content_seasons");
  const totalPages = contents[0]?.totalPages;

  return (
    <>
      <ContentList contents={contents} />
      <PaginationButton totalPages={totalPages} page={page} cateogry={"web_series"} />
    </>
  );
};

export default WebSeriesContentPages;
