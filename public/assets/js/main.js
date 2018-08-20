//Product list
var showProducts = [];

var pNumber = 0;

jQuery(document).ready(function ($) {

    // jQuery sticky Menu

    $(".mainmenu-area").sticky({
        topSpacing: 0
    });


    $('.product-carousel').owlCarousel({
        loop: true,
        nav: true,
        margin: 20,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 3,
            },
            1000: {
                items: 5,
            }
        }
    });

    $('.related-products-carousel').owlCarousel({
        loop: true,
        nav: true,
        margin: 20,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 2,
            },
            1000: {
                items: 2,
            },
            1200: {
                items: 3,
            }
        }
    });

    $('.brand-list').owlCarousel({
        loop: true,
        nav: true,
        margin: 20,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 3,
            },
            1000: {
                items: 4,
            }
        }
    });


    // Bootstrap Mobile Menu fix
    $(".navbar-nav li a").click(function () {
        $(".navbar-collapse").removeClass('in');
    });

    // jQuery Scroll effect
    $('.navbar-nav li a, .scroll-to-up').bind('click', function (event) {
        var $anchor = $(this);
        if ($anchor.attr('href') == '#')
            return;
        var headerH = $('.header-area').outerHeight();
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - headerH + "px"
        }, 1200, 'easeInOutExpo');

        event.preventDefault();
    });

    // Bootstrap ScrollPSY
    $('body').scrollspy({
        target: '.navbar-collapse',
        offset: 95
    })

    showProducts = splitPage(products);
    loadShop(showProducts, 0);

    //search type choosing
    $('.content-drop').bind('click', function (event) {
        var selected = $(this).text();
        $('.dropdown-text').text(selected);
        $('#search-input').attr('placeholder', "Tên " + selected.toLowerCase() + "...");
    });

    //hide other address
    $(".shipping_address").hide();

    //search Enter
    $('#search-input').keypress(function (k) {
        if (k.which === 13) {
            k.preventDefault();
            $('html, body').animate({
                scrollTop: $('.single-product-area').offset().top
            }, 500);

            var val = $('#search-input').val().toLowerCase();
            var search_result = [];
            if ($('.dropdown-text').text() === "Sản phẩm") {
                for (var i = 0; i < products.length; i++) {
                    if (products[i].name.toLowerCase().includes(val)) {
                        search_result.push(products[i]);
                    }
                }
            } else {
                for (var i = 0; i < products.length; i++) {
                    if (products[i].brand.toLowerCase().includes(val)) {
                        search_result.push(products[i]);
                    }
                }
            }

            showProducts = splitPage(search_result);

            loadShop(showProducts, 0);
        }
    })

    //search btn press
    $('.click').bind('click', function (event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $('.single-product-area').offset().top
        }, 500);
        var val = $('#search-input').val().toLowerCase();
        var search_result = [];
        if ($('.dropdown-text').text() === "Sản phẩm") {
            for (var i = 0; i < products.length; i++) {
                if (products[i].name.toLowerCase().includes(val)) {
                    search_result.push(products[i]);
                }
            }
        } else {
            for (var i = 0; i < products.length; i++) {
                if (products[i].brand.toLowerCase().includes(val)) {
                    search_result.push(products[i]);
                }
            }
        }
        showProducts = splitPage(search_result);

        loadShop(showProducts, 0);
    })

    //Menu click
    $('.content-drop-small').bind('click', function (event) {
        window.location.replace('./shop.html');
    })


    //brand filter click
    $('.brand').bind('click', function (event) {
        let type = $(this).text();
        let ListProducts = products.filter(function (product) {
            return product.brand.toLowerCase().indexOf(type.toLowerCase()) !== -1;
        })
        showProducts = splitPage(ListProducts);

        loadShop(showProducts, 0);
    })

    //class filter click
    $('.classify').bind('click', function (event) {
        let type = $(this).text();
        let ListProducts = products.filter(function (product) {
            return product.class.toLowerCase().indexOf(type.toLowerCase()) !== -1;
        })
        showProducts = splitPage(ListProducts);

        loadShop(showProducts, 0);
    })

    $('.filter-btn').bind('click', function (event) {
        let ListBrands = new Array();
        let types = $('.checkbox-btn');
        for (i = 0; i < types.length; i++) {
            if (types[i].checked === true) {
                let list = null
                list = products.filter(function (product) {
                    return product.brand.toLowerCase().indexOf(types[i].classList[0]) !== -1;
                })
                for (j = 0; j < list.length; j++) {
                    ListBrands.push(list[j]);
                }
            }
        }
        let ListTypes = new Array();
        for (i = 0; i < types.length; i++) {
            if (types[i].checked === true) {
                let list = null
                list = ListBrands.filter(function (product) {
                    return product.class.toLowerCase().indexOf(types[i].classList[0]) !== -1;
                })
                for (j = 0; j < list.length; j++) {
                    ListTypes.push(list[j]);
                }
            }
        }
        let min = $("#slider-range").slider("values", 0);
        let max = $("#slider-range").slider("values", 1);
        let ListFinal = null
        ListFinal = ListTypes.filter(function (product) {
            return min <= product.price && product.price <= max;
        })
        showProducts = splitPage(ListFinal);

        loadShop(showProducts, 0);
    })

    //Price slider
    if (document.getElementById("slider-range") != null) {
        $("#slider-range").slider({
            range: true,
            min: 0,
            max: 3000,
            values: [100, 1500],
            slide: function (event, ui) {
                $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
            }
        });
        $("#amount").val("$" + $("#slider-range").slider("values", 0) +
            " - $" + $("#slider-range").slider("values", 1));
    }

    // Click button - in cart
    $('.minus').bind('click', function () {
        let count = $(this).parents('.cart_item').find('.qty').val();
        let amount = $(this).parents('.cart_item').find('.amount').attr('money');
        if (count > 1) {
            count--;
            $('.qty').val(count);
            let money = +count * +amount;
            $(this).parents('.cart_item').find('.amount_count').attr('money', money);
            $(this).parents('.cart_item').find('.amount_count').text(addDotIntoMoney(money) + ' đ');
        }
    });

    //Click button + in cart
    $('.plus').bind('click', function () {
        let count = $(this).parents('.cart_item').find('.qty').val();
        let amount = $(this).parents('.cart_item').find('.amount').attr('money');
        count++;
        $('.qty').val(count);
        let money = +count * +amount;
        $(this).parents('.cart_item').find('.amount_count').attr('money', money);
        $(this).parents('.cart_item').find('.amount_count').text(addDotIntoMoney(money) + ' đ');
    });

    //Click button x in cart
    $('.remove').bind('click', function () {
        let parent = $(this).parent().parent();
        parent.remove();
    });

    //Click Button Update Cart
    $('.update-button').bind('click', function () {
        let amount_count = 0;
        let total_money = 0;
        let list_sp = $('.cart_item');
        for (let i = 0; i < list_sp.length; i++) {
            amount_count = list_sp[i].getElementsByClassName('amount_count')[i].getAttribute('money');
            total_money += +amount_count;
        }
        console.log($('.cart-subtotal').find('.amount'));
        $('.cart-subtotal').find('.amount').val(total_money);
        $('.cart-subtotal').find('.amount').text(addDotIntoMoney(total_money) + ' đ');
        $('.order-total').find('.amount').val(total_money);
        $('.order-total').find('.amount').text(addDotIntoMoney(total_money) + ' đ');
        $('.cart-amunt').val(total_money);
        $('.cart-amunt').text(total_money / 1000000 + ' triệu')
    });

    //Dashboard
    $('.db-tab').bind('click', function () {
        $('.db-tab').attr('class', 'db-tab');
        $(this).attr('class', 'active db-tab');
        var innerTxt = "";
        $(".container.add-button").html("");
        $(".container.add-button").html("<div class='col-sm-12 manage-product'></div>");
        var name = $(this).html().toLowerCase();
        if (name.includes("chủng loại")) {
            innerTxt = "<div class='col-md-3 col-sm-6'><div class='single-shop-product'><div class='product-upper'><img src='./img/Business.png' class='product-img'/></div><h2><p class='product-link'>Bussiness</p></h2><button type='button' class='btn btn-default' style='margin: 0 10px;' onclick='deleteProduct(0)'>Xóa</button></div></div>";
            innerTxt += "<div class='col-md-3 col-sm-6'><div class='single-shop-product'><div class='product-upper'><img src='./img/Gaming.png' class='product-img'/></div><h2><p class='product-link'>Gaming</p></h2><button type='button' class='btn btn-default' style='margin: 0 10px;' onclick='deleteProduct(1)'>Xóa</button></div></div>";
            innerTxt += "<div class='col-md-3 col-sm-6'><div class='single-shop-product'><div class='product-upper'><img src='./img/Workstation.png' class='product-img'/></div><h2><p class='product-link'>Workstation</p></h2><button type='button' class='btn btn-default' style='margin: 0 10px;' onclick='deleteProduct(2)'>Xóa</button></div></div>";
            innerTxt += "<div class='col-md-3 col-sm-6'><div class='single-shop-product'><div class='product-upper'><img src='./img/Ultrabook.png' class='product-img'/></div><h2><p class='product-link'>Ultrabook</p></h2><button type='button' class='btn btn-default' style='margin: 0 10px;' onclick='deleteProduct(3)'>Xóa</button></div></div>";
            $('.manage-product').html(innerTxt);
            var text = $(".container.add-button").html() + "<button type='button' class='btn btn-default add-btn' style='float:right; margin-bottom:20px; width: 200px;'>Thêm</button>";
            $(".container.add-button").html(text);
        } else if (name.includes("sản phẩm")) {
            loadManageProduct(products);
        } else if (name.includes("nhà sản xuất")) {
            innerTxt = "<div class='col-md-3 col-sm-6'><div class='single-shop-product'><div class='product-upper'><img src='./img/LogoAcer.jpg' class='product-img'/></div><button type='button' class='btn btn-default' style='margin: 0 10px;' onclick='deleteProduct(0)'>Xóa</button></div></div>";
            innerTxt += "<div class='col-md-3 col-sm-6'><div class='single-shop-product'><div class='product-upper'><img src='./img/LogoApple.jpg' class='product-img'/></div><button type='button' class='btn btn-default' style='margin: 0 10px;' onclick='deleteProduct(1)'>Xóa</button></div></div>";
            innerTxt += "<div class='col-md-3 col-sm-6'><div class='single-shop-product'><div class='product-upper'><img src='./img/LogoAsus.jpg' class='product-img'/></div><button type='button' class='btn btn-default' style='margin: 0 10px;' onclick='deleteProduct(2)'>Xóa</button></div></div>";
            innerTxt += "<div class='col-md-3 col-sm-6'><div class='single-shop-product'><div class='product-upper'><img src='./img/LogoDell.jpg' class='product-img'/></div><button type='button' class='btn btn-default' style='margin: 0 10px;' onclick='deleteProduct(3)'>Xóa</button></div></div>";
            innerTxt += "<div class='col-md-3 col-sm-6'><div class='single-shop-product'><div class='product-upper'><img src='./img/LogoMsi.jpg' class='product-img'/></div><button type='button' class='btn btn-default' style='margin: 0 10px;' onclick='deleteProduct(3)'>Xóa</button></div></div>";
            innerTxt += "<div class='col-md-3 col-sm-6'><div class='single-shop-product'><div class='product-upper'><img src='./img/LogoHP.jpg' class='product-img'/></div><button type='button' class='btn btn-default' style='margin: 0 10px;' onclick='deleteProduct(3)'>Xóa</button></div></div>";
            innerTxt += "<div class='col-md-3 col-sm-6'><div class='single-shop-product'><div class='product-upper'><img src='./img/LogoLenovo.jpg' class='product-img'/></div><button type='button' class='btn btn-default' style='margin: 0 10px;' onclick='deleteProduct(3)'>Xóa</button></div></div>";
            innerTxt += "<div class='col-md-3 col-sm-6'><div class='single-shop-product'><div class='product-upper'><img src='./img/LogoSony.jpg' class='product-img'/></div><button type='button' class='btn btn-default' style='margin: 0 10px;' onclick='deleteProduct(3)'>Xóa</button></div></div>";
            $('.manage-product').html(innerTxt);
            var text = $(".container.add-button").html() + "<button type='button' class='btn btn-default add-btn' style='float:right; margin-bottom:20px; width: 200px;'>Thêm</button>";
            $(".container.add-button").html(text);
        } else if (name.includes("đơn hàng")) {
            innerTxt = `<div class='dashboard-order have-margin'><table class='table-responsive-2'><thead><tr>
                        <th>
                            <span class='hidden-xs hidden-sm hidden-md'>Mã đơn hàng</span>
                            <span class='hidden-lg'>Code</span>
                        </th>
                        <th>Ngày mua</th>
                        <th>Sản phẩm</th>
                        <th>Tổng tiền</th>
                        <th>
                            <span class='hidden-xs hidden-sm hidden-md'>Trạng thái <br> đơn hàng</span>
                            <span class='hidden-lg'>Trạng thái</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class='colorgrey'>
                        <td><a href='buy-info.html'>47305229</a></td>
                        <td>21/11/2017</td>
                        <td>Dell vostro</td>
                        <td>10.000.000&nbsp;₫</td>
                        <td>
                            <span class='status-btn' onclick='statusOnClick(0, 0)' style='color:#FF6600; font-weight:700;'>Chưa giao</span>|<span class='status-btn' onclick='statusOnClick(0, 1)'>Đang giao</span>|<span class='status-btn' onclick='statusOnClick(0, 2)'>Đã giao</span>
                        </td>
                    </tr>
                    <tr>
                        <td><a href='buy-info.html'>96844700</a></td>
                        <td>14/11/2017</td>
                        <td>MSI gaming</td>
                        <td>42.000.000&nbsp;₫</td>
                        <td>
                        <span class='status-btn' onclick='statusOnClick(1, 0)'>Chưa giao</span>|<span class='status-btn' onclick='statusOnClick(1, 1)'>Đang giao</span>|<span class='status-btn' onclick='statusOnClick(1, 2)' style='color:#FF6600; font-weight:700;'>Đã giao</span>

                        </td>
                    </tr>
                    <tr class='colorgrey'>
                        <td><a href='buy-info.html'>88325378</a></td>
                        <td>11/11/2017</td>
                        <td>Acer Devil G7</td>
                        <td>16.000.000&nbsp;₫</td>
                        <td>
                        <span class='status-btn' onclick='statusOnClick(2, 0)'>Chưa giao</span>|<span class='status-btn' onclick='statusOnClick(2, 1)'>Đang giao</span>|<span class='status-btn' onclick='statusOnClick(2, 2)' style='color:#FF6600; font-weight:700;'>Đã giao</span>

                        </td>
                    </tr>
                    <tr>
                        <td><a href='buy-info.html'>64775432</a></td>
                        <td>11/11/2017</td>
                        <td>HP pro new</td>
                        <td>17.000.000&nbsp;₫</td>
                        <td>
                        <span class='status-btn' onclick='statusOnClick(3, 0)'>Chưa giao</span>|<span class='status-btn' onclick='statusOnClick(3, 1)' style='color:#FF6600; font-weight:700;'>Đang giao</span>|<span class='status-btn' onclick='statusOnClick(3, 2)'>Đã giao</span>
                        </td>
                    </tr>
                    <tr class='colorgrey'>
                        <td><a href='buy-info.html'>98710850</a></td>
                        <td>11/11/2017</td>
                        <td>Dell Inpriron G5</td>
                        <td>16.000.000&nbsp;₫</td>
                        <td>
                            <span class='status-btn' onclick='statusOnClick(4, 0)' style='color:#FF6600; font-weight:700;'>Chưa giao</span>|<span class='status-btn' onclick='statusOnClick(4, 1)'>Đang giao</span>|<span class='status-btn' onclick='statusOnClick(4, 2)'>Đã giao</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>`
            $('.manage-product').html(innerTxt);
        }
    })

    statisticsProducts(products);
    statisticsBrands(products);
    statisticsClassify(products);
    loadManageProduct(products);
});


function loadShop(product_list, id) {
    //Load products
    var nP = product_list.length;
    var prev = "<li><a href='#search-result' aria-label='Previous' id='back-btn' onclick='prevOnClick()'><span aria-hidden='true'>&laquo;</span></a></li>";
    var next = "<li><a href='#search-result' aria-label='Next' id='forward-btn' onclick='nextOnClick()'><span aria-hidden='true'>&raquo;</span></a></li>";
    $(".product-list").empty();
    if (nP === 0) {
        $(".product-list").html("<h3>Không tìm thấy sản phẩm nào</h3>");
    }
    for (var i = 0; i < product_list[id].length; i++) {
        var innerTxt = "";
        var link = "";
        if (i % 2 === 0) {
            link = "./single-product.html";
        } else {
            link = "./second-product.html";
        }
        innerTxt = $(".product-list").html() + "<div class='col-md-3 col-sm-6'><div class='single-shop-product'><div class='product-upper'><img src='" + product_list[id][i].image + "' alt='" + product_list[id][i].name + "' title='" + product_list[id][i].name + "' class='product-img'/></div><h2><a href='" + link + "' class='product-link'>" + product_list[id][i].name + "</a></h2><div class='product-carousel-price'><del>$" + product_list[id][i].orginprice + ".00</del><ins>$" + product_list[id][i].price + ".00</ins></div><div class='product-option-shop'><a class='add_to_cart_button' data-quantity='1' data-product_sku='' data-product_id='70' rel='nofollow' href='./cart.html'>Add to cart</a></div></div></div>";
        $(".product-list").html(innerTxt);
    }
    var navTxt = "" + prev;
    for (var i = 0; i < nP; i++) {
        if (i === id) {
            pNumber = id;
            navTxt += "<li class='active'><a href='#search-result' class='page-split' onclick='splitOnClick(" + i + ")'>" + (i + 1).toString() + "</a></li>";
        } else {
            navTxt += "<li><a href='#search-result' class='page-split' onclick='splitOnClick(" + i + ")'>" + (i + 1).toString() + "</a></li>";
        }
    }
    navTxt += next;
    $('.pagination').html(navTxt);
}

function otherAddress() {
    if ($(".input-checkbox").is(":checked"))
        $(".shipping_address").show();
    else
        $(".shipping_address").hide();
}

function processSelectCountries(id) {
    const country_list = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua &amp; Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia &amp; Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre &amp; Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts &amp; Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad &amp; Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks &amp; Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];

    let select = $(id);
    if (select.length == 0)
        return;
    for (country of country_list) {
        var opt = document.createElement('option');
        opt.value = country;
        opt.text = country;
        select.append(opt);
    }
}

function selectCountries() {
    processSelectCountries('#billing_country');
    processSelectCountries('#shipping_country');
    processSelectCountries('#calc_shipping_country');
}

selectCountries();

(function ($) {
    "use strict";

    /*==================================================================
    [ Focus Contact2 ]*/
    $('.input100').each(function () {
        $(this).on('blur', function () {
            if ($(this).val().trim() != "") {
                $(this).addClass('has-val');
            } else {
                $(this).removeClass('has-val');
            }
        })
    })

    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function () {
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        } else {
            if ($(input).val().trim() == '') {
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }


    /*==================================================================
    [ Show / hide Form ]*/

})(jQuery);


function splitPage(list) {
    var result = [];
    var count = 0;
    var page = [];
    for (var i = 0; i < list.length; i++) {
        page.push(list[i]);
        count++;
        if (count === 12 || i === list.length - 1) {
            result.push(page);
            page = [];
            count = 0;
        }
    }
    return result;
}



function splitOnClick(id) {
    loadShop(showProducts, id);
}

function prevOnClick() {
    if (pNumber === 0) {
        pNumber = showProducts.length - 1;
    } else pNumber--;
    loadShop(showProducts, pNumber);
}


function nextOnClick() {
    if (pNumber === showProducts.length - 1) {
        pNumber = 0;
    } else pNumber++;
    loadShop(showProducts, pNumber);
}


function addDotIntoMoney(money) {
    var parts = money.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(".");
}

//quản lý sản phẩm
function loadManageProduct(product_list) {
    //Load products
    var nP = product_list.length;
    $(".manage-product").empty();
    if (nP === 0) {
        $(".manage-product").html("<h3>Không có sản phẩm nào</h3>");
    }
    for (var i = 0; i < nP; i++) {
        var innerTxt = "";
        innerTxt = $(".manage-product").html() + "<div class='col-md-3 col-sm-6'><div class='single-shop-product'><div class='product-upper'><img src='" + product_list[i].image + "' alt='" + product_list[i].name + "' title='" + product_list[i].name + "' class='product-img'/></div><h2><p class='product-link'>" + product_list[i].name + "</p></h2><div class='product-carousel-price'><del>$" + product_list[i].orginprice + ".00</del><ins>$" + product_list[i].price + ".00</ins></div><button type='button' class='btn btn-default' style='margin: 0 10px;' onclick='deleteProduct(" + i + ")'>Xóa</button><button type='button' class='btn btn-default' style='margin: 0 10px;' onclick='window.open(\"./single_product_update.html\", \"_blank\")'>Chỉnh sửa</button></div></div>";
        $(".manage-product").html(innerTxt);
    }
    var text = $(".container.add-button").html() + "<button type='button' class='btn btn-default add-btn' style='float:right; margin-bottom:20px; width: 200px;'>Thêm</button>";
    $(".container.add-button").html(text);
}

function deleteProduct(id) {
    var confirm = prompt("Bạn có thật sự muốn xóa sản phẩm?\n Nếu có vui lòng gõ \"YES\" vào ô bên dưới:");
    if (confirm === "YES") {
        alert("Bạn đã xóa thành công sản phẩm!");
    } else {
        alert("Chuỗi xác nhận không đúng!");
    }
}

function statusOnClick(id, type) {
    document.getElementsByClassName('status-btn')[id * 3].style.color = 'black';
    document.getElementsByClassName('status-btn')[id * 3 + 1].style.color = 'black';
    document.getElementsByClassName('status-btn')[id * 3 + 2].style.color = 'black';
    document.getElementsByClassName('status-btn')[id * 3].style.fontWeight = '100';
    document.getElementsByClassName('status-btn')[id * 3 + 1].style.fontWeight = '100';
    document.getElementsByClassName('status-btn')[id * 3 + 2].style.fontWeight = '100';
    document.getElementsByClassName('status-btn')[id * 3 + type].style.color = '#FF6600';
    document.getElementsByClassName('status-btn')[id * 3 + type].style.fontWeight = '700';
}