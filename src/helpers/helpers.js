import Webflow from "webflow-api"

// Initialize the API
const webflow = new Webflow({ 
  token: "e71ee51c18046f6f3997d4017bf7ec74ec55ad8f54bdf954521c844a6f5c7006",
  beta: true
 });

// Function to list sites
async function listSites() {
  try {
    const sites = await webflow.get('/sites');
    console.log('Sites:', sites.data);
    return sites.data.sites;
  } catch (error) {
    console.error('Error listing sites:', error);
  }
}

// Function to get site details
async function getSiteDetails(siteId) {
  try {
    const site = await webflow.get(`/sites/${siteId}`);
    console.log('Site Details:', site.data);
    return site.data;
  } catch (error) {
    console.error('Error getting site details:', error);
  }
}

// Function to list pages
async function listPages(siteId) {
    try {
      const pages = await webflow.get(`sites/${siteId}/pages`);
      console.log('Pages:', pages.data);
      return pages.data.pages;
    } catch (error) {
      console.error('Error listing pages:', error);
    }
  }

// Function to get Contact Us page DOM in French
async function getDOM(pageId, locale) {
  try {
    const dom = await webflow.get(`/pages/${pageId}/dom`, {
      params: { locale: locale },
    });
    console.log('Contact Us Page DOM:', dom);
    return dom;
  } catch (error) {
    console.error('Error getting Contact Us page DOM:', error);
  }
}

// Function to update Contact Us page DOM with French text
async function updateDOM(pageId, dom) {
  try {
    const updatedDom = await webflow.put(`/pages/${pageId}/dom`, dom);
    console.log('Updated Contact Us Page DOM:', updatedDom);
    return updatedDom;
  } catch (error) {
    console.error('Error updating Contact Us page DOM:', error);
  }
}

// Function to get page metadata
async function getPageMetadata(pageId) {
  try {
    const metadata = await webflow.get(`/pages/${pageId}`);
    console.log('Page Metadata:', metadata);
    return metadata;
  } catch (error) {
    console.error('Error getting page metadata:', error);
  }
}

// Function to update page metadata with localized SEO data
async function updatePageMetadata(pageId, metadata) {
  try {
    const updatedMetadata = await webflow.post(`/pages/${pageId}`, metadata);
    console.log('Updated Page Metadata:', updatedMetadata);
    return updatedMetadata;
  } catch (error) {
    console.error('Error updating page metadata:', error);
  }
}

// Function to get CMS collections
async function getCmsCollections(siteId) {
  try {
    const collections = await webflow.get(`/sites/${siteId}/collections`);
    console.log('CMS Collections:', collections.data);
    return collections.data.collections;
  } catch (error) {
    console.error('Error getting CMS collections:', error);
  }
}

// Function to get CMS items from a specific collection
async function getCmsItems(collectionId) {
  try {
    const items = await webflow.get(`/collections/${collectionId}/items`);
    console.log('CMS Items:', items.data.items);
    return items.data.items;
  } catch (error) {
    console.error('Error fetching CMS items:', error);
    throw error;
  }
}

async function updateLocalizedCmsItems(collectionId, cmsItems, cmsLocaleId){
  try{

    let items = []
    for (const item of cmsItems){

      const updatedItem = await webflow.patch(`/collections/${collectionId}/items/${item.id}`, { cmsLocaleId: cmsLocaleId, fieldData:item.fieldData})
      console.log(`Item:`, updatedItem.data)
      items.push(updatedItem.data)
    }

    return items

  } catch (error) {
    console.error(`Error updating CMS items:`, error)
    throw error;
  }
}

// Function to create a new testimonial in the French CMS
async function createFrenchTestimonial(collectionId, testimonial, cmsLocaleId) {
  try {
    const newTestimonial = await webflow.post(`/collections/${collectionId}/items/live`, { cmsLocaleId: cmsLocaleId, fieldData:testimonial});
    console.log('Created French Testimonial:', newTestimonial.data);
    return newTestimonial;
  } catch (error) {
    console.error('Error creating French testimonial:', error);
  }
}

export {
    webflow,
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
  };