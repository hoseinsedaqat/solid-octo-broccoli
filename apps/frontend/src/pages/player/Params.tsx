/**
 * Thin wrappers that read route params and render the detail pages.
 * Kept separate so App.tsx can lazy-load them and each detail page keeps a plain React prop API.
 */
import { ExtractDetailPage, SellDetailPage } from './Resources';
import { ExportDetailPage, ImportDetailPage } from './Trade';

export function ExtractDetailRoute({ params }: { params?: Record<string, string> }) {
  return <ExtractDetailPage resourceKey={params?.key ?? 'oil'} />;
}
export function SellDetailRoute({ params }: { params?: Record<string, string> }) {
  return <SellDetailPage resourceKey={params?.key ?? 'oil'} />;
}
export function ExportDetailRoute({ params }: { params?: Record<string, string> }) {
  return <ExportDetailPage resourceKey={params?.key ?? 'oil'} />;
}
export function ImportDetailRoute({ params }: { params?: Record<string, string> }) {
  return <ImportDetailPage resourceKey={params?.key ?? 'oil'} />;
}
