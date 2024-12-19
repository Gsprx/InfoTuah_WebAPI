//url to the remote server we use to fetch data for the site
const url = "https://learning-hub-1whk.onrender.com";

fetchAllData();

async function fetchAllData() {
  //create headers for fetching
  let httpHeaders = new Headers();
  httpHeaders.append("Accept", "application/json");

  let init = {
    method: "GET",
    headers: httpHeaders,
  };

  try {
    // first fetch all categories
    const categoriesResponse = await fetch(url + "/categories", init);
    if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");
    const categories = await categoriesResponse.json();

    // then fetch the subcategories of each category and create an array storing objects mapping the category to its subcategories
    const categoriesAndSubCategoriesPromises = categories.map((category) =>
      fetch(url + "/categories/" + category.id + "/subcategories")
        .then((response) => {
          if (!response.ok)
            throw new Error(
              "Failed to fetch subcategories for the category: " + category.id
            );
          return response.json();
        })
        .then((subcategoriesData) => {
          // change category image path to an entire url
          category.img_url = url + "/" + category.img_url;
          return {
            category: category,
            subcategories: subcategoriesData,
          };
        })
    );

    categoriesAndSubCategories = await Promise.all(
      categoriesAndSubCategoriesPromises
    );

    // console.log(categoriesAndSubCategories);

    //prepare data to be used in html
    const htmlData = {
      courses: categoriesAndSubCategories,
    };

    //get the template from the HTML
    const templateSource = document.getElementById("template").innerHTML;
    //compile the template with Handlebars
    const template = Handlebars.compile(templateSource);
    //generate the HTML by combining the template and the data
    const renderedHTML = template(htmlData);
    //inject the rendered HTML into the DOM
    document.getElementById("home-courses-load").innerHTML = renderedHTML;

    // console.log(categoriesAndSubCategories);
  } catch (error) {
    console.log(error);
  }
}
