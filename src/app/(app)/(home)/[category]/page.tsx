interface Props {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  return (
    <>
      <h1>Welcome to Category page!</h1>
      <h1>Category {category}</h1>
    </>
  );
}
