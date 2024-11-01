export const loader = () => {
  // handle "GET" request
  // separating xml content from Response to keep clean code.
  const content = `
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<url>
<loc>https://yourealvest.com/</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>1.00</priority>
</url>

<url>
<loc>https://yourealvest.com/auth/?lang=sr</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>1.00</priority>
</url>

<url>
<loc>https://yourealvest.com/?lang=en</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>1.00</priority>
</url>

<url>
<loc>https://yourealvest.com/auth/register/</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>0.80</priority>
</url>

<url>
<loc>https://yourealvest.com/auth/</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>0.80</priority>
</url>

<url>
<loc>https://yourealvest.com/blog/</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>0.80</priority>
</url>

<url>
<loc>https://yourealvest.com/market/</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>0.80</priority>
</url>

<url>
<loc>https://yourealvest.com/dashboard/search/</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>0.80</priority>
</url>

<url>
<loc>https://yourealvest.com/terms/</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>0.60</priority>
</url>

<url>
<loc>https://yourealvest.com/privacy/</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>0.60</priority>
</url>

<url>
<loc>https://yourealvest.com/auth/forgot_password/</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>0.64</priority>
</url>

<url>
<loc>https://yourealvest.com/auth/?lang=en</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>0.64</priority>
</url>

<url>
<loc>https://yourealvest.com/auth/register/?lang=en</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>0.64</priority>
</url>
<url>
<loc>https://yourealvest.com/auth?lang=en</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>0.64</priority>
</url>

<url>
<loc>https://yourealvest.com/blog?lang=en</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>0.64</priority>
</url>

<url>
<loc>https://yourealvest.com/terms?lang=en</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>0.64</priority>
</url>

<url>
<loc>https://yourealvest.com/privacy?lang=en</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>0.64</priority>
</url>

<url>
<loc>https://yourealvest.com/blog/da-li-su-nekretnine-u-beogradu-skupe/</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>0.64</priority>
</url>

<url>
<loc>https://yourealvest.com/blog/da-li-se-izdavanje-nekretnina-u-beogradu-isplati/</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>0.64</priority>
</url>

<url>
<loc>https://yourealvest.com/blog/stanovi-pregrevica-kupovina/</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>0.64</priority>
</url>

<url>
<loc>https://yourealvest.com/blog/prodaja-stanova-donji-dorol/</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>0.64</priority>
</url>

<url>
<loc>https://yourealvest.com/auth/forgot_password?lang=en</loc>
<lastmod>2024-10-17T13:16:01+00:00</lastmod>
<priority>0.51</priority>
</url>

</urlset>
      `;
  // Return the response with the content, a status 200 message, and the appropriate headers for an XML page
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8",
    },
  });
};
