import AnimePaginationButton from '@/components/other/AnimePaginationButton';
import FetchSSRData from '@/components/other/FetchSSRData';
import AnimeContentList from '@/components/AnimeContentList';

const AnimeHub = async ({params}) => {
  const { page } = params
  const { contents } = await FetchSSRData(page, "latest_anime_contents");
  const totalPages = contents[0]?.totalPages;

  return (
    <div>
      <AnimeContentList contents={contents} />
      <AnimePaginationButton totalPages={totalPages} page={page} cateogry={"latest_anime_contents"} />
    </div>
  );
};

export default AnimeHub;
