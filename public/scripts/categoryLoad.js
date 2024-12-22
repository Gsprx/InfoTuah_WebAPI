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
    "/learning-items?category=" + catID
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
  }

  //run the fetching function for subcategories of this category
  let fetchedSubcategories = await fetchData(
    "/categories/" + catID + "/subcategories"
  );
  console.log("Fetched Subcategories: ", fetchedSubcategories);

  //run the fetching function for categories (to find current category title)
  let fetchedCategories = await fetchData("/categories");
  console.log("Fetched Categories: ", fetchedCategories);
  let category = fetchedCategories.find((obj) => obj.id == catID);

  //prepare data to be used in html
  const htmlData = {
    title: category.title,
    books: books,
    lectures: lectures,
    subcourses: fetchedSubcategories,
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
const catID = urlParams.get("id");
console.log("Current Category ID: " + catID);

//run the fetch and implement data into html templates
fetchCategoryData();
