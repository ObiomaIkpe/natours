var $jqtH7$axios = require("axios");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
console.log("hello from the client side!");
const $f60945d37f8e594c$export$4c5dd147b21b9176 = (locations)=>{
    mapboxgl.accessToken = "pk.eyJ1IjoiYWlnbzI0NyIsImEiOiJjbG1lNTlleGkxdnJuM2d0ZnhqNnpvZGRtIn0.TlWzNECzx8Yjl6k8TBxlOQ";
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/aigo247/clmebem2101do01pfg8fq03il",
        scrollZoom: false
    });
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((loc)=>{
        //create a marker
        const el = document.createElement("div");
        el.className = "marker";
        //add a marker
        new mapboxgl.Marker({
            element: el,
            anchor: "bottom"
        }).setLngLat(loc.coordinates).addTo(map);
        //add a popup
        new mapboxgl.Popup({
            offset: 30
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);
        //extend map bounds to include current location.
        bounds.extend(loc.coordinates);
    });
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 120,
            left: 100,
            right: 100
        }
    });
} //secret=sk.eyJ1IjoiYWlnbzI0NyIsImEiOiJjbG1lNW54YnUxczhvM2V0Y3BuOWpnODlmIn0.J_MXrfadNVXWP2mpcLn0JQ
;



/* eslint-disable */ const $3adf927435cf4518$export$516836c6a9dfc573 = ()=>{
    const el = document.querySelector(".alert");
    if (el) el.parentElement.removeChild(el);
};
const $3adf927435cf4518$export$de026b00723010c1 = (type, msg)=>{
    $3adf927435cf4518$export$516836c6a9dfc573();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    window.setTimeout($3adf927435cf4518$export$516836c6a9dfc573, 5000);
};


const $70af9284e599e604$export$596d806903d1f59e = async (email, password)=>{
    //alert(email, password)
    console.log(email, password);
    try {
        const res = await (0, ($parcel$interopDefault($jqtH7$axios)))({
            method: "POST",
            url: "http://localhost:9000/api/v1/users/login",
            data: {
                email: email,
                password: password
            }
        });
        console.log(res);
        if (res.data) {
            (0, $3adf927435cf4518$export$de026b00723010c1)("success", "logged in successfully");
            window.setTimeout(()=>{
                location.assign("/");
            }, 1500);
        }
    } catch (err) {
        //console.log(err.response)
        (0, $3adf927435cf4518$export$de026b00723010c1)("failed", err.response.data.message);
    }
};


console.log("hello from parcel!");
//DOM ELEMENTS
const $d0f7ce18c37ad6f6$var$mapBox = document.getElementById("map");
const $d0f7ce18c37ad6f6$var$loginForm = document.querySelector(".form");
//DELEGATION
if ($d0f7ce18c37ad6f6$var$mapBox) {
    const locations = JSON.parse($d0f7ce18c37ad6f6$var$mapBox.dataset.locations);
    (0, $f60945d37f8e594c$export$4c5dd147b21b9176)(locations);
}
if ($d0f7ce18c37ad6f6$var$loginForm) $d0f7ce18c37ad6f6$var$loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    //VALUES
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    (0, $70af9284e599e604$export$596d806903d1f59e)(email, password);
});


//# sourceMappingURL=bundler.js.map
