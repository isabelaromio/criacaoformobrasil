// Cursor pixelado decorativo (referência estética Y2K/Windows 95)
export function PixelCursor({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M4 2h2v2H4V2Zm2 2h2v2H6V4Zm0 2h2v2H6V6Zm2 0h2v2H8V6Zm0 2h2v2H8V8Zm2 0h2v2h-2V8Zm0 2h2v2h-2v-2Zm2 0h2v2h-2v-2Zm0 2h2v2h-2v-2Zm-8-8h2v10H6V10Zm-2-6h2v14H4V4Z"
      />
    </svg>
  );
}
