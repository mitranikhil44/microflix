import PaginationButton from '@/components/other/PaginationButton';
import FetchSSRData from '@/components/other/FetchSSRData';
import dynamic from 'next/dynamic';

const DynamicContentList = dynamic(() => import('@/components/ContentList'), {
  ssr: true,
});

const Contents = async () => {
  const page = 1;
  const { contents } = await FetchSSRData(page, "contents");
  const totalPages = contents[0]?.totalPages;

  return (
    <div>
      <DynamicContentList contents={contents} />
      <PaginationButton totalPages={totalPages} page={page} cateogry={"contents"} />
    </div>
  );
};

export default Contents;
