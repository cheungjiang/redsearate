export default function BrandLogo() {
  return (
    <picture>
      <source srcSet="/logo-lockup-header.webp" type="image/webp" />
      <img src="/logo-lockup-header.png" alt="RedSeaRate" width={750} height={128} />
    </picture>
  );
}
