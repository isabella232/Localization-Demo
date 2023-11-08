import Webflow from "webflow-api"
import dotenv from "dotenv"
import { webflow, createFrenchTestimonial} from "./src/helpers/helpers.js"
import newTestimonial from "./src/helpers/newTestimonial.json" assert { type: 'json' }



const siteId = "65427cf400e02b306eaa049c";
const collectionId = "65427cf400e02b306eaa04c8";
const cmsLocaleId = "65427cf400e02b306eaa04a1";

// Immediately Invoked Function Expression (IIFE) to use async/await at the top level
(async () => {

  const newItem = await createFrenchTestimonial(collectionId, newTestimonial, cmsLocaleId)
  console.log(newItem)

  })();