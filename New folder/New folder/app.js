let body = document.querySelector("body");
let listProductHTML = document.querySelector(".listProduct");
let cartTabHTML = document.querySelector(".cartTab .listCart");

let listProducts = [];
let passiveOrders = JSON.parse(localStorage.getItem('passiveOrders')) || [];
let clickCounts = {}; // T�klama say�s�n� saklamak i�in

body.classList.toggle("showCart");

const addDataToHTML = () => {
    // mevcut verileri HTML'den kald�r
    listProductHTML.innerHTML = "";

    // yeni verileri ekle
    if (listProducts.length > 0) {
        // veri varsa
        listProducts.forEach((product) => {
            let newProduct = document.createElement("div");
            newProduct.dataset.id = product.id;
            newProduct.classList.add("item");
            newProduct.innerHTML = `
                <h1>${product.id}</h1>
                <h2>${product.name}</h2>
                <button class="addCart" data-id="${product.id}">${product.removeCart}</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
}

const addDataCartHTML = () => {
    cartTabHTML.innerHTML = "";

    if (passiveOrders.length > 0) {
        passiveOrders.forEach((product) => {
            let newCartProduct = document.createElement("div");
            newCartProduct.dataset.id = product.id;
            newCartProduct.classList.add("item");
            newCartProduct.innerHTML = `
                <h1>${product.id}</h1>
                <h2>${product.name}</h2>
                <button class="removeCart" data-id="${product.id}">AKT�F S�PAR��</button>`;
            cartTabHTML.appendChild(newCartProduct);
        });
    }
}

listProductHTML.addEventListener('click', (event) => {
    if (event.target.classList.contains('addCart')) {
        let productId = event.target.dataset.id;
        clickCounts[productId] = (clickCounts[productId] || 0) + 1;

        if (clickCounts[productId] === 2) {
            let product = listProducts.find(p => p.id == productId);
            if (product) {
                passiveOrders.push(product);
                localStorage.setItem('passiveOrders', JSON.stringify(passiveOrders));
                listProducts = listProducts.filter(p => p.id != productId);
                addDataToHTML();
                addDataCartHTML();
            }
            clickCounts[productId] = 0; // S�f�rlama
        }
    }
})

cartTabHTML.addEventListener('click', (event) => {
    if (event.target.classList.contains('removeCart')) {
        let productId = event.target.dataset.id;
        clickCounts[productId] = (clickCounts[productId] || 0) + 1;

        if (clickCounts[productId] === 2) {
            let product = passiveOrders.find(p => p.id == productId);
            if (product) {
                listProducts.push(product);
                passiveOrders = passiveOrders.filter(p => p.id != productId);
                localStorage.setItem('passiveOrders', JSON.stringify(passiveOrders));
                addDataToHTML();
                addDataCartHTML();
            }
            clickCounts[productId] = 0; // S�f�rlama
        }
    }
})

const initApp = () => {
    // json'dan veri al
    fetch("products.json")
        .then((response) => response.json())
        .then((data) => {
            listProducts = data;
            console.log(listProducts);
            addDataToHTML(); // �r�nleri g�stermek i�in fonksiyonu �a��r
        });

    // Pasif sipari�leri yerel depolamadan ba�lat
    addDataCartHTML();
};

initApp();
