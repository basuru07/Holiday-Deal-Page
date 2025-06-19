export default function FinePrintSection({ finePrint }) {
  if (!finePrint || (!finePrint.image && !finePrint.description)) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Fine Print
        </h2>

        <div className="bg-white rounded-lg shadow-md p-8">
          {finePrint.image && (
            <div className="mb-8">
              <img
                src={finePrint.image}
                alt="Fine Print"
                className="w-full max-w-md mx-auto rounded-lg shadow-sm"
              />
            </div>
          )}

          {finePrint.description && (
            <div
              className="text-gray-700 leading-relaxed [&>ul]:list-disc [&>ul]:pl-6 [&>li]:mb-2"
              dangerouslySetInnerHTML={{ __html: finePrint.description }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
