import MainHeader from "../_components/main-header";
import { CategoryTabs } from "./_components/category-tabs";

export default function LorasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <MainHeader menu={<CategoryTabs />} />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
