export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-slate font-serif">Загрузка...</p>
    </div>
  );
}
