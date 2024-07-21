import AnimePaginationButton from '@/components/other/AnimePaginationButton';
import FetchSSRData from '@/components/other/FetchSSRData';
import AnimeContentList from '@/components/AnimeContentList';

const AnimeHub = async ({params}) => {
  const { page } = params
  const { contents } = await FetchSSRData(page, "top_anime_content_seasons");
  const totalPages = contents[0]?.totalPages;

  return (
    <div>
      <AnimeContentList contents={contents} />
      <AnimePaginationButton totalPages={totalPages} page={page} cateogry={"top_anime_web_series"} />
    </div>
  );
};

export default AnimeHub;
