import PaginationButton from '@/components/other/PaginationButton';
import FetchSSRData from '@/components/other/FetchSSRData';
import ContentList from '@/components/ContentList';

const WebSeriesContents = async () => {
  const page = 1;
  const { contents } = await FetchSSRData(page, "content_seasons");
  const totalPages = contents[0]?.totalPages;

  return (
    <>
      <ContentList contents={contents} />      
      <PaginationButton totalPages={totalPages} page={1} cateogry={"web_series"} />
    </>
  );
};

export default WebSeriesContents;
