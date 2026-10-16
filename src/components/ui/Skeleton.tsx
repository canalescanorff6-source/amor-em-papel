export function Skeleton({ height = 160 }: { height?: number }) {
  return <div className="skeleton" aria-hidden="true" style={{ height }} />;
}
