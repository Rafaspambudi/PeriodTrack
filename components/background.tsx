export function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Mesh gradient halus */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(251,207,232,0.55),transparent_55%),radial-gradient(ellipse_at_top_right,rgba(221,214,254,0.5),transparent_55%),radial-gradient(ellipse_at_bottom_center,rgba(254,215,170,0.35),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(190,24,93,0.14),transparent_55%),radial-gradient(ellipse_at_top_right,rgba(109,40,217,0.14),transparent_55%),radial-gradient(ellipse_at_bottom_center,rgba(234,88,12,0.08),transparent_60%)]" />
      {/* Bokeh */}
      <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-pink-300/25 blur-3xl dark:bg-pink-500/10" />
      <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-violet-300/25 blur-3xl dark:bg-violet-500/10" />
      <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-orange-200/25 blur-3xl dark:bg-orange-400/10" />
    </div>
  );
}
