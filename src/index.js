// We've gone ahead and translated most of the Conent we need in the files below
import localizedDOM from "./helpers/Contact Us - French.json" assert { type: "json" }; // Localized "Contact Us DOM
import localizedMetadata from "./helpers/seoData.json" assert { type: "json" }; // Localized SEO Data
import frenchTestimonials from "./helpers/Testimonials - French.json" assert { type: "json" }; // Localized Testimonials
import newTestimonial from "./helpers/newTestimonial.json" assert { type: "json" }; // New French Testimonial
import { WebflowClient } from "webflow-api";
import dotenv from "dotenv";

async function run() {
  try {
    /* 🔮 Step 1: Retrieve Locale Information 🔮 */

    // Initialize the API.
    dotenv.config();
    const token = process.env.WEBFLOW_API_TOKEN;
    const webflow = new WebflowClient({ accessToken: token });

    // List sites and get the Astral Fund site's details
    const sites = await webflow.sites.list();
    const astralFundSite = sites.sites.find((site) =>
      site.displayName.includes("AstralFund")
    );
    const siteId = astralFundSite.id;
    const siteDetails = await webflow.sites.get(siteId);

    // Extract and store locale IDs
    const locales = siteDetails.locales;
    const secondaryLocaleId = locales.secondary[0].id; // French is the first secondary locale
    const secondaryCmsLocaleId = locales.secondary[0].CmsId;

    /* 🔮 Step 2: Localize "Contact Us" page 🔮 */

    // Get the Page Info for "Contact Us"
    const pages = await webflow.pages.list(siteId);
    const contactPage = pages.pages.find((page) =>
      page.title.includes("Contact")
    );
    const contactPageId = contactPage.id;

    // Get the DOM for the Contact Us page in English and translate to French
    const primaryContactPageDom = await webflow.pages.getContent(contactPageId);

    // Update the Contact Us page DOM with French content
    await webflow.pages.updateStaticContent(
      contactPageId,
      localizedDOM,
      secondaryLocaleId
    );

    /* 🔮 Step 3: Localize SEO Data 🔮 */

    // Get page metadata with localized SEO data
    const pageMetadata = await webflow.pages.getMetadata(contactPageId);
    await webflow.pages.updatePageSettings(contactPageId, localizedMetadata);

    /* 🔮 Step 4: Manage Testimonials via th CMS 🔮 */

    // Work with CMS data for testimonials
    const collections = await webflow.collections.list(siteId);
    const testimonialsCollectionId = collections.find(
      (collection) => collection.displayName === "Testimonials"
    ).id;
    const items = await webflow.collections.items.listItems(
      testimonialsCollectionId
    );

    // Translate Testimonials, setting the first one to draft
    try {
      for (const [index, value] of items.entries()) {
        const updatedItem = await webflow.collections.items.updateItemLive(
          testimonialsCollectionId,
          frenchTestimonials[index],
          secondaryCmsLocaleId
        );
        console.log(`Item:`, updatedItem.data);
      }
    } catch (error) {
      console.error(`Error updating CMS items:`, error);
      throw error;
    }

    // Create a French-Only Testimonial
    await webflow.collections.items.createItem(
      testimonialsCollectionId,
      newTestimonial,
      secondaryCmsLocaleId
    );

    console.log("Localization process completed successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

run();
