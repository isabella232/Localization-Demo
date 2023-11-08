import {
    listSites,
    getSiteDetails,
    listPages,
    getDOM,
    updateDOM,
    getPageMetadata,
    updatePageMetadata,
    getCmsCollections,
    getCmsItems,
    createFrenchTestimonial,
  } from "./helpers.js"

import contactData from "../helpers/Contact Us - French.json"
import seoData from "../helpers/seoData.json"
import frenchTestimonials from "../helpers/Testimonials - French.json"
import newTestimonial from "../src/helpers/newTestimonial.json"

async function run() {
  try {

    /* 🔮 Step 3: Retrieve Locale Information 🔮 */

    // Initialize the API.
    const webflow = new Webflow(
      { token: process.env.WEBFLOW_API_TOKEN,
        beta: true
      }
      );
    
    // List sites and get the Astral Fund site's details
    const sites = await listSites();
    const astralFundSite = sites.find(site => site.name.includes("AstralFund"));
    try {
      const siteId = astralFundSite._id;
      const siteDetails = await getSiteDetails(siteId);
      // Continue with other operations using siteDetails...
    } catch {
      console.log('Astral Fund site not found');
    }

    // Extract and store locale IDs
    const locales = siteDetails.locales;
    const secondaryLocaleId = locales.secondary[0].id; // French is the first secondary locale
    const secondaryCmsLocaleId = locales.secondary[0].CmsId

    /* 🔮 Step 4: Localize "Contact Us" page 🔮 */

    // Get the Page Info for "Contact Us"
    const pages = await listPages(siteId)
    const contactPage = pages.find(site => site.name.includes("Contact"));
    const contactPageId = contactPage.id

    // Get the DOM for the Contact Us page in English and translate to French
    const primaryContactPageDom = await getDOM(contactPageId);
    const translatedDom = contactData

    // Update the Contact Us page DOM with French content
    await updateDOM(contactPageId, translatedDom, secondaryLocaleId);

    /* 🔮 Step 5: Localize SEO Data 🔮 */

    // Get page metadata with localized SEO data
    const pageMetadata = await getPageMetadata(contactPageId);
    await updatePageMetadata(contactPageId, pageMetadata);

    /* 🔮 Step 6: Manage Testimonials via th CMS 🔮 */

    // Work with CMS data for testimonials
    const collections = await getCmsCollections(siteId);
    const testimonialsCollectionId = collections.find(collection => collection.displayName === 'Testimonials').id;
    const testimonials = await getCmsItems(testimonialsCollectionId);

    // Translate Testimonials, setting the first one to draft
    const localizedItems = await updateLocalizedCmsItems(testimonialsCollectionId, frenchTestimonials, secondaryCmsLocaleId)

    // Create a French-Only Testimonial
    await createTestimonial(testimonialsCollectionId, newTestimonial, cmsLocaleId);

    console.log('Localization process completed successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

run();
