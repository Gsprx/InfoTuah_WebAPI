// fetching function
async function fetchData() {
  // create headers for fetching
  let httpHeaders = new Headers();
  httpHeaders.append("Accept", "application/json");

  let init = {
    method: "GET",
    headers: httpHeaders,
  };

  let result;
  try {
    // use fetch api to get category data from remote server
    const response = await fetch(
      url + "/learning-items?category=" + catID,
      init
    );
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

//use the fetched data by injecting it to the html template
async function logFetchedData() {
  let fetchedData = await fetchData();
  console.log("Fetched Data:", fetchedData); // Now prints the data after fetch

  let books = [];
  let lectures = [];

  //filter books and lectures into arrays
  for (item of fetchedData) {
    if (item.type === "Book") {
      books.push(item);
    } else {
      lectures.push(item);
    }
  }

  // data to be used in html
  const htmlData = {
    title: "Course",
    books: books,
    lectures: lectures,
  };

  // get the template from the HTML
  const templateSource = document.getElementById("template").innerHTML;

  // compile the template with Handlebars
  const template = Handlebars.compile(templateSource);

  // generate the HTML by combining the template and the data
  const renderedHTML = template(htmlData);

  // inject the rendered HTML into the DOM
  document.getElementById("loaded-template-container").innerHTML = renderedHTML;
}

//----------------------------------------------------------------- Start of Script ---------------------------------------------------------------------------- //

// url to the remote server we use to fetch data for the site
const url = "https://learning-hub-1whk.onrender.com";

// obtain the category id through url search parameters api and window's location property search segment
const urlParams = new URLSearchParams(window.location.search);
const catID = urlParams.get("id");
console.log("Current Category ID: " + catID);

//run the fetch and implement data into html templates
logFetchedData();
