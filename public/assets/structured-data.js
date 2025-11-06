
(function(){
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://365cloud.ai/",
    "name": "365cloud.ai",
    "description": "Independent consulting for Microsoft 365, Power Platform, Azure Cloud & Azure AI.",
    "publisher": {"@type":"Organization","name":"365cloud.ai","url":"https://365cloud.ai/"},
    "potentialAction": {"@type":"SearchAction","target":"https://365cloud.ai/blog/?q={search_term_string}","query-input":"required name=search_term_string"},
    "hasPart": [
      {"@type":"CollectionPage","name":"Blog","url":"https://365cloud.ai/blog/"},
      {"@type":"WebPage","name":"Project Power","url":"https://365cloud.ai/project-power/"},
      {"@type":"WebPage","name":"Imprint","url":"https://365cloud.ai/imprint/"}
    ],
    "service": {"@type":"Service","serviceType":"Cloud & AI Advisory","serviceOutput":"Architecture, pilots, governance, and production-ready solutions","audience":{"@type":"Audience","audienceType":"SMBs & Enterprises"},"provider":{"@type":"Organization","name":"365cloud.ai"},"areaServed":{"@type":"Place","name":"Europe"},"offers":{"@type":"Offer","priceCurrency":"CHF","availability":"https://schema.org/InStock"}}
  };
  const s = document.createElement('script'); s.type='application/ld+json'; s.text = JSON.stringify(data); document.head.appendChild(s);
})();
