

$('.dashboard-customers').bind('click', function () {
        $('.statistics-customers').show();
        $('.statistics-products').hide();
        $('.statistics-classify').hide();
        $('.statistics-brands').hide();


        $('.dashboard').removeClass('active');
        $('.dashboard-products').removeClass('active');
        $('.dashboard-classify').removeClass('active');
        $('.dashboard-brands').removeClass('active');
        $('.dashboard-customers').addClass('active');
    })

    $('.dashboard-products').bind('click', function () {
        $('.statistics-customers').hide();
        $('.statistics-products').show();
        $('.statistics-classify').hide();
        $('.statistics-brands').hide();


        $('.dashboard').removeClass('active');
        $('.dashboard-products').addClass('active');
        $('.dashboard-classify').removeClass('active');
        $('.dashboard-brands').removeClass('active');
        $('.dashboard-customers').removeClass('active');
    })

    $('.dashboard-classify').bind('click', function () {
        $('.statistics-customers').hide();
        $('.statistics-products').hide();
        $('.statistics-classify').show();
        $('.statistics-brands').hide();


        $('.dashboard').removeClass('active');
        $('.dashboard-products').removeClass('active');
        $('.dashboard-classify').addClass('active');
        $('.dashboard-brands').removeClass('active');
        $('.dashboard-customers').removeClass('active');
    })

    $('.dashboard-brands').bind('click', function () {
        $('.statistics-customers').hide();
        $('.statistics-products').hide();
        $('.statistics-classify').hide();
        $('.statistics-brands').show();

        $('.dashboard').removeClass('active');
        $('.dashboard-products').removeClass('active');
        $('.dashboard-classify').removeClass('active');
        $('.dashboard-brands').addClass('active');
        $('.dashboard-customers').removeClass('active');
    })

statisticsProducts(products);
statisticsBrands(products);
statisticsClassify(products);

function addDotIntoMoney(money) {
    var parts = money.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(".");
}

function statisticsProducts(products) {
    let body = $('.statistics-products').find('tbody');
    let tr;
    let td;
    let text;
    for (product of products) {
        tr = document.createElement('tr');

        td = document.createElement('td');
        text = document.createTextNode(product.name);
        td.appendChild(text);
        tr.appendChild(td);

        td = document.createElement('td');
        text = document.createTextNode('$' + addDotIntoMoney(product.price));
        td.appendChild(text);
        tr.appendChild(td);

        td = document.createElement('td');
        text = document.createTextNode(Math.floor((Math.random() * 100) + 1));
        td.appendChild(text);
        tr.appendChild(td);

        body.append(tr);
    }
}

function statisticsBrands(products) {
    let Brand = {};
    let Price = {};
    let arr = [];
    let body = $('.statistics-brands').find('tbody');
    let td, tr, text;

    //Filter products same to Object
    products.forEach(element => {
        Brand[element.brand] = (Brand[element.brand] || 0) + 1;
        Price[element.brand] = (Price[element.brand] || 0) + element.price;
    });

    //Push Object To Array
    for (key in Brand) {
        arr.push({
            brand: key,
            count: Brand[key],
            price: Price[key]
        });
    }

    for (item of arr) {
        tr = document.createElement('tr');
        td = document.createElement('td');
        text = document.createTextNode(item.brand);
        td.appendChild(text);
        tr.appendChild(td);

        td = document.createElement('td');
        text = document.createTextNode(item.count);
        td.appendChild(text);
        tr.appendChild(td);

        td = document.createElement('td');
        text = document.createTextNode('$' + addDotIntoMoney(item.price))
        td.appendChild(text);
        tr.appendChild(td);

        body.append(tr);
    }
}

function statisticsClassify(products) {
    let Classify = {};
    let Price = {};
    let arr = [];
    let body = $('.statistics-classify').find('tbody');
    let td, tr, text;

    //Filter products same to Object
    products.forEach(element => {
        Classify[element.class] = (Classify[element.class] || 0) + 1;
        Price[element.class] = (Price[element.class] || 0) + element.price;
    });

    //Push Object To Array
    for (key in Classify) {
        arr.push({
            classify: key,
            count: Classify[key],
            price: Price[key]
        });
    }

    for (item of arr) {
        tr = document.createElement('tr');
        td = document.createElement('td');
        text = document.createTextNode(item.classify);
        td.appendChild(text);
        tr.appendChild(td);

        td = document.createElement('td');
        text = document.createTextNode(item.count);
        td.appendChild(text);
        tr.appendChild(td);

        td = document.createElement('td');
        text = document.createTextNode('$' + addDotIntoMoney(item.price))
        td.appendChild(text);
        tr.appendChild(td);

        body.append(tr);
    }
}
