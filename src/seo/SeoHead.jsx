// English code as requested
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

export function withHelmet(Component) {
  return function Wrapped(props) {
    return (
      <HelmetProvider>
        <Component {...props} />
      </HelmetProvider>
    );
  };
}

export function SeoHead({
  title,
  description,
  url,
  image,
  canonical,
  noindex = false,
}) {
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {canonical && <link rel="canonical" href={canonical} />}
      {/* Open Graph */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
