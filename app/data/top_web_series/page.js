import PaginationButton from '@/components/other/PaginationButton';
import FetchSSRData from '@/components/other/FetchSSRData';
import ContentList from '@/components/ContentList';

const TopWebSeriesContents = async () => {
  const page = 1;
  const { contents } = await FetchSSRData(page, "top_content_seasons");
  const totalPages = contents[0]?.totalPages;

  return (
    <>
      <ContentList contents={contents} />
      <PaginationButton totalPages={totalPages} page={page} cateogry={"top_web_series"} />
    </>
  );
};

export default TopWebSeriesContents;
