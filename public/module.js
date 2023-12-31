import $69tjs$axios from "axios";

console.log("hello from the client side!");
const $f6b1c9ed51ec7162$export$4c5dd147b21b9176 = (locations)=>{
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



/* eslint-disable */ const $1eb0cc260df27e1b$export$516836c6a9dfc573 = ()=>{
    const el = document.querySelector(".alert");
    if (el) el.parentElement.removeChild(el);
};
const $1eb0cc260df27e1b$export$de026b00723010c1 = (type, msg)=>{
    $1eb0cc260df27e1b$export$516836c6a9dfc573();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    window.setTimeout($1eb0cc260df27e1b$export$516836c6a9dfc573, 5000);
};


const $e33d9ff231aec008$export$596d806903d1f59e = async (email, password)=>{
    //alert(email, password)
    console.log(email, password);
    try {
        const res = await (0, $69tjs$axios)({
            method: "POST",
            url: "http://localhost:9000/api/v1/users/login",
            data: {
                email: email,
                password: password
            }
        });
        console.log(res);
        if (res.data) {
            (0, $1eb0cc260df27e1b$export$de026b00723010c1)("success", "logged in successfully");
            window.setTimeout(()=>{
                location.assign("/");
            }, 1500);
        }
    } catch (err) {
        //console.log(err.response)
        (0, $1eb0cc260df27e1b$export$de026b00723010c1)("failed", err.response.data.message);
    }
};


console.log("hello from parcel!");
//DOM ELEMENTS
const $1cd085a7ac742057$var$mapBox = document.getElementById("map");
const $1cd085a7ac742057$var$loginForm = document.querySelector(".form");
//DELEGATION
if ($1cd085a7ac742057$var$mapBox) {
    const locations = JSON.parse($1cd085a7ac742057$var$mapBox.dataset.locations);
    (0, $f6b1c9ed51ec7162$export$4c5dd147b21b9176)(locations);
}
if ($1cd085a7ac742057$var$loginForm) $1cd085a7ac742057$var$loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    //VALUES
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    (0, $e33d9ff231aec008$export$596d806903d1f59e)(email, password);
});


//# sourceMappingURL=module.js.map
