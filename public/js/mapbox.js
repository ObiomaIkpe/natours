console.log('hello from the client side!')

const locations = JSON.parse(document.getElementById('map').dataset.locations)

export const displayMap = (locations) => {



mapboxgl.accessToken = 'pk.eyJ1IjoiYWlnbzI0NyIsImEiOiJjbG1lNTlleGkxdnJuM2d0ZnhqNnpvZGRtIn0.TlWzNECzx8Yjl6k8TBxlOQ';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/aigo247/clmebem2101do01pfg8fq03il', // style URL
    scrollZoom: false
    //center: [-109.55099, 37.283469], // starting position [lng, lat]
    //zoom: 9, // starting zoom
    //interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => { 
    //create a marker
    const el = document.createElement('div');
    el.className = 'marker';

    //add a marker
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);

    //add a popup
    new mapboxgl.Popup({
        offset: 30
    })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map)

    //extend map bounds to include current location.
    bounds.extend(loc.coordinates)

})


map.fitBounds(bounds,  {
    padding: {
        top: 200,
        bottom: 120,
        left: 100,
        right: 100
    }
});
}


//secret=sk.eyJ1IjoiYWlnbzI0NyIsImEiOiJjbG1lNW54YnUxczhvM2V0Y3BuOWpnODlmIn0.J_MXrfadNVXWP2mpcLn0JQ
