import Image from "next/image";

// Recortes com fundo transparente extraídos do brandbook oficial
// (Identidade_Formô_RGB.pdf) — sempre um dos pares logo/fundo aprovados:
// azul sobre mostarda, creme sobre coral/sálvia, rosa sobre marinho.
const LOGO_SOURCES = {
  blue: "/brand/formo-logo-blue.png",
  cream: "/brand/formo-logo-cream.png",
  pink: "/brand/formo-logo-pink.png",
} as const;

const ASPECT_RATIO = 900 / 835; // largura / altura do arquivo original

export function FormoLogo({
  variant,
  height = 32,
  className,
}: {
  variant: keyof typeof LOGO_SOURCES;
  height?: number;
  className?: string;
}) {
  return (
    <Image
      src={LOGO_SOURCES[variant]}
      alt="Formô"
      width={Math.round(height * ASPECT_RATIO)}
      height={height}
      style={{ height, width: "auto" }}
      className={className}
      priority
    />
  );
}
