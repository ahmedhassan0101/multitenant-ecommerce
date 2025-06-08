interface Props {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

export default async function SubCategoryPage({ params }: Props) {
  const { category, subcategory } = await params;
  return (
    <>
      <h1>Welcome to SubCategory page!</h1>
      <h1>Category: {category} </h1>
      <h1>SubCategory: {subcategory}</h1>
    </>
  );
}
