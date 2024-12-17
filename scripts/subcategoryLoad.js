//-------------------------------------------------------- Functions ---------------------------------------------------------------------------- //

//generic fetching function
//returns a promised json object
//depends on the path input relative to the remote server url
async function fetchData(relativePath) {
  //create headers for fetching
  let httpHeaders = new Headers();
  httpHeaders.append("Accept", "application/json");

  let init = {
    method: "GET",
    headers: httpHeaders,
  };

  let result;
  try {
    //use fetch api to get category data from remote server
    const response = await fetch(url + relativePath, init);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    result = await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  //this result is not yet resolved as a promise
  return result;
}

//fetch all category related data and inject them into handlebars templates
async function fetchCategoryData() {
  //run the fetching function for learning items
  let fetchedLearningItems = await fetchData(
    "/learning-items?subcategory=" + subcatID
  );
  console.log("Fetched Learning Items: ", fetchedLearningItems);

  let books = [];
  let lectures = [];

  for (item of fetchedLearningItems) {
    if (item.type === "Book") {
      books.push(item);
    } else {
      lectures.push(item);
    }
    //create a features array property for each item that can be used by handlebars instead of the original single-string features
    item.featuresArray = item.features.split(";");
  }

  //run the fetching function for subcategories (to find current subcategory title)
  let fetchedCategories = await fetchData("/subcategories");
  console.log("Fetched Subcategories: ", fetchedCategories);
  let category = fetchedCategories.find((obj) => obj.id == subcatID);

  //prepare data to be used in html
  const htmlData = {
    title: category.title,
    books: books,
    lectures: lectures,
    hasBooks: books.length > 0,
    hasLectures: lectures.length > 0,
  };

  //get the template from the HTML
  const templateSource = document.getElementById("template").innerHTML;

  //compile the template with Handlebars
  const template = Handlebars.compile(templateSource);

  //generate the HTML by combining the template and the data
  const renderedHTML = template(htmlData);

  //inject the rendered HTML into the DOM
  document.getElementById("loaded-template-container").innerHTML = renderedHTML;
}
//----------------------------------------------------------------- Start of Script ---------------------------------------------------------------------------- //

//url to the remote server we use to fetch data for the site
const url = "https://learning-hub-1whk.onrender.com";

//obtain the category id through url search parameters api and window's location property search segment
const urlParams = new URLSearchParams(window.location.search);
const subcatID = urlParams.get("id");
console.log("Current Subcategory ID: " + subcatID);

//run the fetch and implement data into html templates
fetchCategoryData();
