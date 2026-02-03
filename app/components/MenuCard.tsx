type MenuItem = {
  name: string;
  description: string;
  price: string;
};

export default function MenuCard({ item }: { item: MenuItem }) {
  return (
    <div className="glass p-6 rounded-xl hover:-translate-y-1 transition">
      <h3 className="text-xl font-medium">{item.name}</h3>
      <p className="text-white/60 text-sm mt-2">
        {item.description}
      </p>
      <p className="mt-4 font-semibold text-lg">
        {item.price}
      </p>
    </div>
  );
}
