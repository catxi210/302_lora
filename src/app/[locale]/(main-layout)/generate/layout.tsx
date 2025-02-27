import MainHeader from "../_components/main-header";

export default function LorasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <MainHeader />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
