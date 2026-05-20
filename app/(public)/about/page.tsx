const stats = [
  { label: "Products", value: "24+" },
  { label: "Employees", value: "8" },
  { label: "Years in business", value: "5" },
  { label: "Happy clients", value: "300+" },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
          About Veltra
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Veltra was founded with a simple belief: that good design and genuine
          craftsmanship should be accessible to everyone. We build products that
          last — things you reach for every day without thinking twice.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="text-center p-6 bg-gray-900 border border-gray-800 rounded-2xl"
          >
            <p className="text-3xl font-bold text-blue-400 mb-2">{stat.value}</p>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6 text-gray-400 leading-relaxed text-base">
        <p>
          Based out of a small workshop in the Pacific Northwest, Veltra started
          as a passion project between two designers who were tired of choosing
          between beauty and function. That false choice became the founding
          problem we set out to solve.
        </p>
        <p>
          Every product in our catalogue goes through months of iteration before
          it reaches you. We prototype, we break things, we start over. The goal
          is always the same: something that feels obvious in hindsight — like it
          could not have been designed any other way.
        </p>
        <p>
          Today, Veltra ships to customers worldwide. Our team has grown, but our
          approach hasn&#39;t. We still sign off on every design before
          production, still respond to every message personally, and still
          believe that the best thing we can make is something you&#39;ll keep
          forever.
        </p>
      </div>
    </div>
  );
}
