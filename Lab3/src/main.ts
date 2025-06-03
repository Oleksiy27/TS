type CategoryItem = {
  id: string;
  full_name: string;
  short_name: string;
  author: string;
  description: string;
  price: number;
};

type CategoryData = CategoryItem[];

let prevRand: number | null = null;

function getCategoryPositions(categoryUrl: string, categoryName: string): void {
  const request = new XMLHttpRequest();

  request.open("GET", categoryUrl);
  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      try {
        const data = JSON.parse(request.responseText);
        if (Array.isArray(data.catalog_items)) {
          setPositions(data.catalog_items, categoryName);
        } else {
          console.error("Очікувався масив у полі 'catalog_items', отримано:", data);
        }
      } catch (e) {
        console.error("Помилка парсингу JSON:", e);
      }
    }
  };
  request.send();
}


function setPositions(categoryData: CategoryData, categoryName: string): void {
  const container = document.getElementById("main");
  if (!container) return;

    const divCatalog = document.createElement("div");
    divCatalog.classList.add("catalog");

  container.innerHTML = '';
  categoryData.forEach((element) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    const img = document.createElement("img");
    img.src = `images/${categoryName}/${element.short_name}.jpg`;
    img.alt = "Item";

    const h2 = document.createElement("h2");
    h2.innerText = element.full_name;

    const h3 = document.createElement("h3");
    h3.innerText = element.author;

    const desc = document.createElement("p");
    desc.innerText = element.description;

    const price = document.createElement("p");
    price.innerText = `${element.price}$`;

    const button = document.createElement("button");
    button.classList.add("buy-button");
    button.innerText = "Купити";

    itemDiv.append(img, h2, h3, desc, price, button);
    divCatalog.appendChild(itemDiv);
    container.appendChild(divCatalog);
  });
}

function setButtonEvents(): void {
  const loadHome = document.getElementById("navHomeButton");
  const loadCatalogButtons = document.querySelectorAll(".catalogButton");
  const randomCategoryBtn = document.getElementById("randomCategory");

  if (loadHome) {
    loadHome.addEventListener('click', () => {
      const container = document.getElementById("main");
      if (!container) return;

      container.innerHTML = `
        <div class="hero">
          <div class="overlay"></div>
          <div class="cta">
            <a href="#" class="button catalogButton" id="loadCatalogBtn">Перейти до комплектуючих</a>
            <a href="#" class="button catalogButton" id="randomCategory">Випадкова категорія</a>
          </div>
        </div>
      `;
      setButtonEvents(); 
    });
  }

  loadCatalogButtons.forEach(button => {
    button.addEventListener('click', () => {
      loadCategoryData();
    });
  });

  if (randomCategoryBtn) {
randomCategoryBtn.addEventListener('click', () => {
  const request = new XMLHttpRequest();
  request.open("GET", "./categories.json");

  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      try {
        const categories = JSON.parse(request.responseText);

        if (!Array.isArray(categories) || categories.length === 0) {
          console.error("Немає категорій або неправильний формат");
          return;
        }

        let rand = Math.floor(Math.random() * categories.length);
        while (rand === prevRand && categories.length > 1) {
          rand = Math.floor(Math.random() * categories.length);
        }
        prevRand = rand;

        const selected = categories[rand];
        getCategoryPositions(selected.url, selected.short_name);
      } catch (e) {
        console.error("Помилка парсингу categories.json:", e);
      }
    } else if (request.readyState === XMLHttpRequest.DONE) {
      console.error("Помилка завантаження categories.json");
    }
  };

  request.send();
    });
  }
}

function setCategoryClickEvents(): void {
  document.querySelectorAll<HTMLElement>('.category').forEach(link => {
    link.addEventListener('click', (event: Event) => {
      event.preventDefault();
      const categoryShortName = link.getAttribute('id');
      if (!categoryShortName) return;

      const request = new XMLHttpRequest();
      request.open("GET", "./categories.json");

      request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
          try {
            const categories = JSON.parse(request.responseText);
            const category = categories.find(
              (cat: any) => cat.short_name === categoryShortName
            );

            if (category) {
              getCategoryPositions(category.url, category.short_name);
            } else {
              console.error("Категорія не знайдена:", categoryShortName);
            }
          } catch (err) {
            console.error("Помилка парсингу categories.json:", err);
          }
        }
      };

      request.send();
    });
  });
}


function loadCategoryData(): void {
  const request = new XMLHttpRequest();
  request.open("GET", "./categories.json");
  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      const data = JSON.parse(request.responseText) as { short_name: string; full_name: string }[];
      setCategoryData(data);
    }
  };
  request.send();
}

function setCategoryData(dataSet: { short_name: string; full_name: string }[]): void {
  const container = document.getElementById("main");
  if (!container) return;

    const divCatalog = document.createElement("div");
    divCatalog.classList.add("catalog");

  container.innerHTML = '';
  dataSet.forEach((element) => {
    const div = document.createElement("div");
    div.classList.add("category");
    div.setAttribute("id", element.short_name); 

    const img = document.createElement("img");
    img.classList.add("bi");
    img.src = `images/${element.short_name}/${element.short_name}.jpg`;
    img.alt = element.full_name;

    const h2 = document.createElement("h2");
    h2.innerText = element.full_name;

    div.append(img, h2);
    divCatalog.appendChild(div);
    container.appendChild(divCatalog);
  });

  setCategoryClickEvents();
}

setButtonEvents();
