import AnimePaginationButton from '@/components/other/AnimePaginationButton';
import FetchSSRData from '@/components/other/FetchSSRData';
import AnimeContentList from '@/components/AnimeContentList';

const AnimeHub = async ({params}) => {
  const { page } = params
  const { contents } = await FetchSSRData(page, "anime_content_movies");
  const totalPages = contents[0]?.totalPages;

  return (
    <div>
      <AnimeContentList contents={contents} />
      <AnimePaginationButton totalPages={totalPages} page={page} cateogry={"anime_movies"} />
    </div>
  );
};

export default AnimeHub;
