interface PageHeroProps {
  title: string;
  subtitle?: string;
  image: string;
}

const PageHero = ({ title, subtitle, image }: PageHeroProps) => (
  <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
    <img
      src={image}
      alt={title}
      className="safari-image-cover absolute inset-0"
    />
    <div className="safari-gradient-overlay absolute inset-0" />
    <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  </section>
);

export default PageHero;
