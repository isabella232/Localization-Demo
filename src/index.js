// We've gone ahead and translated most of the Conent we need in the files below
import localizedDOM from "./helpers/Contact Us - French.json" assert {type: "json"}// Localized "Contact Us DOM
import localizedMetadata from "./helpers/seoData.json" assert {type: "json"}// Localized SEO Data
import frenchTestimonials from "./helpers/Testimonials - French.json" assert {type: "json"}// Localized Testimonials
import newTestimonial from "./helpers/newTestimonial.json" assert {type: "json"} // New French Testimonial
import Webflow from "webflow-api"

// Importing some helper functions. Be sure to check them out in "helpers.js" to see how they work.
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
  updateLocalizedCmsItems,
  createFrenchTestimonial,
} from "../src/helpers/helpers.js"


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
    const astralFundSite = sites.find(site => site.displayName.includes("AstralFund"));
    const siteId = astralFundSite.id;
    const siteDetails = await getSiteDetails(siteId);


    // Extract and store locale IDs
    const locales = siteDetails.locales;
    const secondaryLocaleId = locales.secondary[0].id; // French is the first secondary locale
    const secondaryCmsLocaleId = locales.secondary[0].CmsId

    /* 🔮 Step 4: Localize "Contact Us" page 🔮 */

    // Get the Page Info for "Contact Us"
    const pages = await listPages(siteId)
    const contactPage = pages.find(page => page.title.includes("Contact"));
    const contactPageId = contactPage.id

    // Get the DOM for the Contact Us page in English and translate to French
    const primaryContactPageDom = await getDOM(contactPageId);

    // Update the Contact Us page DOM with French content
    await updateDOM(contactPageId, localizedDOM, secondaryLocaleId);

    /* 🔮 Step 5: Localize SEO Data 🔮 */

    // Get page metadata with localized SEO data
    const pageMetadata = await getPageMetadata(contactPageId);
    await updatePageMetadata(contactPageId, localizedMetadata);

    /* 🔮 Step 6: Manage Testimonials via th CMS 🔮 */

    // Work with CMS data for testimonials
    const collections = await getCmsCollections(siteId);
    const testimonialsCollectionId = collections.find(collection => collection.displayName === 'Testimonials').id;
    const testimonials = await getCmsItems(testimonialsCollectionId);

    // Translate Testimonials, setting the first one to draft
    const localizedItems = await updateLocalizedCmsItems(testimonialsCollectionId, frenchTestimonials, secondaryCmsLocaleId)

    // Create a French-Only Testimonial
    await createFrenchTestimonial(testimonialsCollectionId, newTestimonial, secondaryCmsLocaleId);

    console.log('Localization process completed successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

run();
