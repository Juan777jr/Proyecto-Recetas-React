const Hero = ({
  title = 'Recetas caseras para todos los días',
  subtitle = 'Explora preparaciones paso a paso, guarda tus favoritas y comparte tus propias recetas.',
}) => {
  return (
    <section className="bg-amber-600 py-14 px-4 text-center text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-extrabold sm:text-5xl">{title}</h1>
        <p className="mt-4 text-base text-amber-100 sm:text-xl">{subtitle}</p>
      </div>
    </section>
  );
};

export default Hero;